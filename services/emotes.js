const fs = require("fs");
const path = require("path");
const config = require("../config");
const log = require("../utils/logger");
const {
  normalizeText,
  transliterateArabic,
  normalizeLatinPhonetic,
  normalizeLatinFuzzy,
  getSearchForms
} = require("../utils/text");
const {
  users,
  hasConversation,
  getLanguage
} = require("./users");
const { askGroqRaw, GROQ_API_KEY } = require("./ai");
const { awardEmoteXp, formatLevelUp } = require("./levels");
const { getBotLanguage } = require("./language");

const emotesPath = path.join(__dirname, "..", "emotes.json");
let emotes = [];

function loadEmotes() {
  try {
    if (!fs.existsSync(emotesPath)) {
      log.error("Emotes", "emotes.json not found.");
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(emotesPath, "utf8"));
    if (!Array.isArray(data)) {
      throw new Error("emotes.json must contain an array.");
    }
    emotes = data
      .map((item, index) => ({
        number: Number(item.number ?? index + 1),
        name: String(item.name || "").trim(),
        id: String(item.id || "").trim(),
        duration:
          item.duration === null ||
          item.duration === undefined ||
          item.duration === ""
            ? null
            : Number(item.duration)
      }))
      .filter((item) => item.name && item.id);

    log.info("Emotes", `Loaded ${emotes.length} emotes.`);
    if (emotes.length !== 396) {
      log.warn("Emotes", `Expected 396 emotes, loaded ${emotes.length}.`);
    }
  } catch (error) {
    log.error("Emotes", `Failed to load emotes.json: ${error.message}`);
    process.exit(1);
  }
}

loadEmotes();

const emoteByNumber = new Map();
const emoteByName = new Map();
const emoteById = new Map();

for (const emote of emotes) {
  emoteByNumber.set(emote.number, emote);
  emoteByName.set(normalizeText(emote.name), emote);
  emoteById.set(normalizeText(emote.id), emote);
}

const emoteAliases = new Map();

function addEmoteAlias(alias, emote) {
  const normalized = normalizeText(alias);
  if (!normalized || !emote) return;

  emoteAliases.set(normalized, emote);

  const transliterated = transliterateArabic(normalized);
  if (transliterated) {
    emoteAliases.set(normalizeText(transliterated), emote);
    const fuzzy = normalizeLatinFuzzy(transliterated);
    if (fuzzy) {
      emoteAliases.set(fuzzy, emote);
    }
  }
}

const builtInEmoteAliases = {
  rest: ["ريست", "رست", "ريسـت", "reset", "reست", "reest"],
  macarena: ["ماكارينا", "ماكاريناا", "مكارينا", "macarena"]
};

function resolveEmoteDirectOnly(input) {
  const value = String(input || "").trim();
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    return emoteByNumber.get(Number(value)) || null;
  }

  const forms = getSearchForms(value);
  for (const form of forms) {
    const direct = emoteByName.get(form) || emoteById.get(form);
    if (direct) return direct;
  }
  return null;
}

function buildEmoteAliases() {
  for (const emote of emotes) {
    addEmoteAlias(emote.name, emote);
    addEmoteAlias(emote.id, emote);
  }

  for (const [emoteKey, aliases] of Object.entries(builtInEmoteAliases)) {
    const emote = resolveEmoteDirectOnly(emoteKey);
    if (!emote) continue;

    for (const alias of aliases) {
      addEmoteAlias(alias, emote);
    }
  }

  if (config.emote_aliases && typeof config.emote_aliases === "object") {
    for (const [emoteKey, aliases] of Object.entries(config.emote_aliases)) {
      const emote = resolveEmoteDirectOnly(emoteKey);
      if (!emote) {
        log.warn("EmoteAlias", `Unknown emote key: ${emoteKey}`);
        continue;
      }
      if (Array.isArray(aliases)) {
        for (const alias of aliases) {
          addEmoteAlias(alias, emote);
        }
      } else {
        addEmoteAlias(aliases, emote);
      }
    }
  }

  log.info("Emotes", `Loaded ${emoteAliases.size} emote aliases.`);
}

function resolveEmote(input) {
  const value = String(input || "").trim();
  if (!value) return null;

  const normalized = normalizeText(value);
  if (/^\d+$/.test(normalized)) {
    return emoteByNumber.get(Number(normalized)) || null;
  }

  const forms = getSearchForms(value);
  for (const form of forms) {
    const direct =
      emoteByName.get(form) || emoteById.get(form) || emoteAliases.get(form);
    if (direct) return direct;
  }
  return null;
}

function levenshtein(a, b) {
  a = String(a || "");
  b = String(b || "");

  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = new Array(b.length + 1);
  let current = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j++) previous[j] = j;

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }
    [previous, current] = [current, previous];
  }

  return previous[b.length];
}

function similarityScore(a, b) {
  const originalA = normalizeLatinPhonetic(a);
  const originalB = normalizeLatinPhonetic(b);

  if (!originalA || !originalB) return 0;
  if (originalA === originalB) return 1;

  const normalDistance = levenshtein(originalA, originalB);
  const maxLength = Math.max(originalA.length, originalB.length);
  let normalScore = maxLength ? 1 - normalDistance / maxLength : 0;

  const fuzzyA = normalizeLatinFuzzy(originalA);
  const fuzzyB = normalizeLatinFuzzy(originalB);

  if (fuzzyA && fuzzyB) {
    const fuzzyDistance = levenshtein(fuzzyA, fuzzyB);
    const fuzzyMax = Math.max(fuzzyA.length, fuzzyB.length);
    const fuzzyScore = fuzzyMax ? 1 - fuzzyDistance / fuzzyMax : 0;
    normalScore = Math.max(normalScore, fuzzyScore);
  }

  return normalScore;
}

let emoteSearchEntries = [];

function rebuildEmoteSearchEntries() {
  const entries = [];

  for (const emote of emotes) {
    const terms = new Set();
    terms.add(normalizeText(emote.name));
    terms.add(normalizeText(emote.id));

    for (const [alias, aliasEmote] of emoteAliases.entries()) {
      if (aliasEmote.number === emote.number) {
        terms.add(normalizeText(alias));
      }
    }

    for (const term of terms) {
      if (!term) continue;
      entries.push({ emote, term });
    }
  }

  entries.sort((a, b) => b.term.length - a.term.length);
  emoteSearchEntries = entries;
}

function searchEmotesLocally(query, limit = 5) {
  const forms = getSearchForms(query);
  if (!forms.length) return [];

  const scored = emotes.map((emote) => {
    const nameForms = getSearchForms(emote.name);
    const idForms = getSearchForms(emote.id);
    const aliasForms = [];

    for (const [alias, aliasEmote] of emoteAliases.entries()) {
      if (aliasEmote.number === emote.number) {
        aliasForms.push(alias);
      }
    }

    let score = 0;

    for (const queryForm of forms) {
      if (nameForms.includes(queryForm)) score = Math.max(score, 100);
      if (idForms.includes(queryForm)) score = Math.max(score, 100);
      if (aliasForms.includes(queryForm)) score = Math.max(score, 100);
    }

    for (const queryForm of forms) {
      for (const nameForm of nameForms) {
        if (nameForm.includes(queryForm)) score = Math.max(score, 78);
        if (queryForm.includes(nameForm)) score = Math.max(score, 74);
      }
      for (const aliasForm of aliasForms) {
        if (aliasForm.includes(queryForm)) score = Math.max(score, 78);
        if (queryForm.includes(aliasForm)) score = Math.max(score, 74);
      }
    }

    for (const queryForm of forms) {
      const words = queryForm.split(" ").filter(Boolean);
      for (const word of words) {
        if (word.length < 2) continue;
        for (const nameForm of nameForms) {
          if (nameForm.includes(word)) score += 10;
        }
        for (const aliasForm of aliasForms) {
          if (aliasForm.includes(word)) score += 10;
        }
        for (const idForm of idForms) {
          if (idForm.includes(word)) score += 5;
        }
      }
    }

    for (const queryForm of forms) {
      for (const nameForm of nameForms) {
        const similarity = similarityScore(queryForm, nameForm);
        if (similarity >= 0.93) score = Math.max(score, 94);
        else if (similarity >= 0.86) score = Math.max(score, 84);
        else if (similarity >= 0.78 && queryForm.length >= 4 && nameForm.length >= 4)
          score = Math.max(score, 70);
        else if (similarity >= 0.68 && queryForm.length >= 5 && nameForm.length >= 5)
          score = Math.max(score, 55);
      }

      for (const aliasForm of aliasForms) {
        const similarity = similarityScore(queryForm, aliasForm);
        if (similarity >= 0.93) score = Math.max(score, 94);
        else if (similarity >= 0.86) score = Math.max(score, 84);
        else if (similarity >= 0.78 && queryForm.length >= 4 && aliasForm.length >= 4)
          score = Math.max(score, 70);
      }
    }

    return { emote, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.emote.number - b.emote.number)
    .slice(0, limit)
    .map((item) => item.emote);
}

function calculateLocalMatchScore(query, emote) {
  const forms = getSearchForms(query);
  const nameForms = getSearchForms(emote.name);
  const idForms = getSearchForms(emote.id);
  const aliasForms = [];

  for (const [alias, aliasEmote] of emoteAliases.entries()) {
    if (aliasEmote.number === emote.number) {
      aliasForms.push(alias);
    }
  }

  let best = 0;
  for (const q of forms) {
    for (const n of nameForms) {
      best = Math.max(best, similarityScore(q, n) * 100);
      if (q === n) best = Math.max(best, 100);
      if (n.includes(q) || q.includes(n)) best = Math.max(best, 78);
    }

    for (const alias of aliasForms) {
      best = Math.max(best, similarityScore(q, alias) * 100);
      if (q === alias) best = Math.max(best, 100);
      if (alias.includes(q) || q.includes(alias)) best = Math.max(best, 78);
    }

    for (const id of idForms) {
      best = Math.max(best, similarityScore(q, id) * 100);
    }
  }

  return best;
}

buildEmoteAliases();
rebuildEmoteSearchEntries();

function extractKnownEmoteFromText(text) {
  const normalized = normalizeText(text);
  if (!normalized) return null;

  const numberMatch = normalized.match(/(?:^|\s)(\d+)(?:\s|$)/);
  if (numberMatch) {
    const emote = resolveEmote(numberMatch[1]);
    if (emote) {
      return { ...emote, confidence: "high", source: "local" };
    }
  }

  for (const entry of emoteSearchEntries) {
    const term = entry.term;
    if (!term || term.length < 2) continue;

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, "i");

    if (regex.test(normalized)) {
      return { ...entry.emote, confidence: "high", source: "local" };
    }
  }

  for (const [alias, emote] of emoteAliases.entries()) {
    if (alias.length < 3) continue;
    if (normalized.includes(alias)) {
      return { ...emote, confidence: "high", source: "local" };
    }
  }

  return null;
}

function getStrongLocalEmote(query) {
  const normalized = normalizeText(query);
  if (!normalized) return null;

  const exact = resolveEmote(query);
  if (exact) {
    return { ...exact, confidence: "high", source: "local" };
  }

  const extracted = extractKnownEmoteFromText(query);
  if (extracted) return extracted;

  const results = searchEmotesLocally(query, 5);
  if (!results.length) return null;

  const top = results[0];
  const topScore = calculateLocalMatchScore(query, top);

  const second = results[1];
  const secondScore = second ? calculateLocalMatchScore(query, second) : 0;

  if (topScore >= 88 && topScore - secondScore >= 8) {
    return { ...top, confidence: "high", source: "local" };
  }

  return null;
}

const lastEmoteByUser = new Map();

function setLastEmote(userId, emote) {
  if (!userId || !emote) return;
  lastEmoteByUser.set(userId, emote);
}

function getLastEmote(userId) {
  if (!userId) return null;
  return lastEmoteByUser.get(userId) || null;
}

const lastReferencedEmoteByUser = new Map();

function setLastReferencedEmote(userId, emote) {
  if (!userId || !emote) return;
  lastReferencedEmoteByUser.set(userId, emote);
}

function getLastReferencedEmote(userId) {
  if (!userId) return null;
  return lastReferencedEmoteByUser.get(userId) || null;
}

function getContextualEmote(userId) {
  return (
    getLastReferencedEmote(userId) || getLastEmote(userId) || null
  );
}

function isRepeatRequest(text) {
  const normalized = normalizeText(text);
  const patterns = [
    "again", "play again", "do it again", "do that again", "do this again",
    "repeat", "repeat it", "play it again", "start again", "same one", "same",
    "one more time", "تاني", "تاني بقى", "شغل تاني", "شغلها تاني", "شغله تاني",
    "شغلها كمان", "شغله كمان", "اعملها تاني", "اعمل تاني", "ارقصها تاني",
    "ارقص تاني", "كرر", "كررها", "عيد", "عيدها", "نفسها", "نفس الرقصة", "نفس الحركة"
  ];

  return patterns.some((pattern) => {
    const p = normalizeText(pattern);
    return normalized === p || normalized.includes(p);
  });
}

function containsKnownEmoteReference(text) {
  const normalized = normalizeText(text);
  if (!normalized) return false;

  const numberMatch = normalized.match(/(?:^|\s)(\d+)(?:\s|$)/);
  if (numberMatch) {
    const emote = resolveEmote(numberMatch[1]);
    if (emote) return true;
  }

  const extracted = extractKnownEmoteFromText(normalized);
  return Boolean(extracted);
}

function looksLikeEmoteRequest(text) {
  const normalized = normalizeText(text);
  if (!normalized) return false;

  if (containsKnownEmoteReference(text)) return true;
  if (isRepeatRequest(text)) return true;

  const keywords = [
    "emote", "emotes", "dance", "dances", "dancing", "animation", "animations",
    "move", "movement", "gesture", "pose", "song dance", "tiktok dance",
    "fortnite dance", "dance name", "dance number", "emote number", "emote name",
    "play emote", "play dance", "how do i dance", "how can i dance",
    "رقصة", "رقشه", "رقص", "رقصات", "حركة", "حركه", "حركات", "ايموت", "إيموت",
    "ايموتة", "إيموتة", "ايموته", "إيموته", "ايموتات", "رقمها", "رقمه", "اسمها",
    "اسمه", "شغلها", "شغله", "اشغلها", "ارقصها", "ارقص", "شغل رقصة", "شغل رقصه",
    "رقم الرقصة", "رقم الرقصه", "اسم الرقصة", "اسم الرقصه", "رقصة شبه",
    "رقصه شبه", "حركة شبه", "ra2sa", "r2sa", "ra2set", "ra2sat", "ra2s", "emot",
    "emotat", "emota", "haraka", "7araka", "ro2s", "ro2sa"
  ];

  return keywords.some((keyword) => normalized.includes(normalizeText(keyword)));
}

function detectEmoteIntent(text) {
  const normalized = normalizeText(text);
  if (!normalized) return "identify";

  if (isRepeatRequest(text)) return "repeat";

  const suggestPatterns = [
    "suggest", "suggest me", "recommend", "recommend me", "pick a dance",
    "pick me a dance", "choose a dance", "choose one", "give me a dance",
    "give me an emote", "show me a dance", "what dance should i use",
    "which dance should i use", "اقترح", "اقترحلي", "اقترح عليا", "اقترح علي",
    "رشح", "رشحلي", "رشح لي", "رشح عليا", "اختارلي", "اختار لي", "اختارلي رقصة",
    "هاتلي رقصة", "هات لي رقصة", "وريني رقصة", "عايز رقصة", "عايز ترشحلي رقصة",
    "ممكن ترشحلي رقصة", "ممكن تقترحلي رقصة", "متقترح عليا رقصه", "متقترحش",
    "رقصة تقترحها", "رقصه تقترحها"
  ];

  const hasSuggest = suggestPatterns.some((pattern) => {
    const p = normalizeText(pattern);
    return p && normalized.includes(p);
  });

  if (hasSuggest) return "suggest";

  const playPatterns = [
    "play", "play it", "play this", "play that", "start", "start it", "do it",
    "do this", "do that", "perform", "perform it", "perform this", "dance it",
    "make it dance", "شغل", "شغلها", "شغله", "اشغل", "اشغلها", "شغل الرقصة",
    "شغل الرقصه", "شغل الايموت", "شغل الإيموت", "ارقص", "ارقصها", "اعملها",
    "اعمل الرقصة", "اعمل الرقصه", "ابدأ", "ابدأها"
  ];

  const lookupPatterns = [
    "number", "name", "what number", "which number", "what is the number",
    "whats the number", "what's the number", "how do i play", "how can i play",
    "how to play", "how do i use", "how can i use", "what is this", "whats this",
    "what's this", "which emote", "which dance", "dance number", "emote number",
    "dance name", "emote name", "رقم", "رقمها", "رقمه", "اسم", "اسمها", "اسمه",
    "ازاي اشغل", "ازاي استخدم", "اشغل ازاي", "استخدمها ازاي", "بتتعمل ازاي",
    "الرقصة دي ايه", "الرقصه دي ايه", "دي رقمها كام", "دي رقمها ايه",
    "رقم الرقصة", "رقم الرقصه", "اسم الرقصة", "اسم الرقصه", "اشغلها ازاي"
  ];

  const hasPlay = playPatterns.some((pattern) =>
    normalized.includes(normalizeText(pattern))
  );

  const hasLookup = lookupPatterns.some((pattern) =>
    normalized.includes(normalizeText(pattern))
  );

  if (hasPlay && hasLookup) return "both";
  if (hasPlay) return "play";
  if (hasLookup) return "lookup";

  return "identify";
}

function cleanEmoteQuery(text) {
  let value = normalizeText(text);
  if (!value) return "";

  const removablePhrases = [
    "how do i play", "how can i play", "how to play", "how do i use",
    "how can i use", "what is the number of", "what number is",
    "whats the number of", "what's the number of", "what is the name of",
    "whats the name of", "what's the name of", "which emote is", "which dance is",
    "play it", "play this", "play that", "play", "start it", "start", "dance",
    "emote", "emotes", "dancing", "number", "name", "this", "that", "again",
    "repeat", "same one", "one more time", "عايز رقصة", "عايز رقصه", "عايز ايموت",
    "عايز إيموت", "عايز حركة", "عايز حركه", "رقصة", "رقصه", "رقص", "حركة",
    "حركه", "ايموت", "إيموت", "ايموتة", "إيموتة", "ايموته", "إيموته",
    "رقم الرقصة", "رقم الرقصه", "اسم الرقصة", "اسم الرقصه", "رقمها ايه",
    "رقمه ايه", "رقمها كام", "رقمه كام", "اسمها ايه", "اسمه ايه", "اشغلها ازاي",
    "ازاي اشغلها", "اشغلها", "شغلها", "ازاي اشغل", "ازاي استخدمها",
    "استخدمها ازاي", "استخدمها", "شغل", "اشغل", "ارقص", "ارقصها", "اعملها",
    "اعمل الرقصة", "اعمل الرقصه", "شبه", "زي", "نفس", "اللي شبه", "ممكن",
    "عايز", "عاوزه", "محتاج", "محتاجه", "و"
  ];

  removablePhrases.sort((a, b) => normalizeText(b).length - normalizeText(a).length);

  for (const phrase of removablePhrases) {
    const normalizedPhrase = normalizeText(phrase);
    if (!normalizedPhrase) continue;

    const escaped = normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`, "gi");
    value = value.replace(regex, " ");
  }

  const englishStopWords = [
    "how", "do", "i", "it", "this", "that", "the", "is", "my", "me", "please",
    "can", "could", "would", "want", "need", "tell", "show"
  ];

  for (const word of englishStopWords) {
    value = value.replace(new RegExp(`(?:^|\\s)${word}(?=\\s|$)`, "gi"), " ");
  }

  const arabicStopWords = [
    "عايز", "عاوزه", "محتاج", "محتاجه", "ممكن", "بص", "طيب", "طب", "هي", "هو",
    "دي", "ده", "ايه", "كام", "ازاي", "ازاى", "بقى", "بس", "من", "في", "فى",
    "اللي", "الى", "إلى"
  ];

  for (const word of arabicStopWords) {
    value = value.replace(new RegExp(`(?:^|\\s)${word}(?=\\s|$)`, "gi"), " ");
  }

  value = value.replace(/(^|\s)ال(?=[\u0600-\u06FF])/g, "$1");

  return normalizeText(value);
}

function findLocalEmoteFromQuery(text) {
  const exact = resolveEmote(text);
  if (exact) {
    return { ...exact, confidence: "high", source: "local" };
  }

  const extracted = extractKnownEmoteFromText(text);
  if (extracted) return extracted;

  const cleaned = cleanEmoteQuery(text);
  if (cleaned) {
    const cleanedExact = resolveEmote(cleaned);
    if (cleanedExact) {
      return { ...cleanedExact, confidence: "high", source: "local" };
    }

    const cleanedExtracted = extractKnownEmoteFromText(cleaned);
    if (cleanedExtracted) return cleanedExtracted;

    const strong = getStrongLocalEmote(cleaned);
    if (strong) return strong;
  }

  const originalResults = searchEmotesLocally(text, 5);
  if (originalResults.length) {
    const top = originalResults[0];
    const score = calculateLocalMatchScore(text, top);
    const second = originalResults[1];
    const secondScore = second ? calculateLocalMatchScore(text, second) : 0;

    if (score >= 90 && score - secondScore >= 8) {
      return { ...top, confidence: "high", source: "local" };
    }
  }

  return null;
}

function getRandomEmoteCandidates(limit = 5) {
  if (!Array.isArray(emotes) || !emotes.length) return [];
  const shuffled = [...emotes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}

async function guessEmoteWithAI(text, language) {
  const cleaned = cleanEmoteQuery(text);
  const searchQuery = cleaned || text;

  const cleanedResults = searchEmotesLocally(searchQuery, 5);
  const originalResults = searchEmotesLocally(text, 5);

  const candidateMap = new Map();
  for (const emote of [...cleanedResults, ...originalResults]) {
    if (!candidateMap.has(emote.number)) {
      candidateMap.set(emote.number, emote);
    }
  }

  const localResults = Array.from(candidateMap.values()).slice(0, 5);
  const strongLocal = findLocalEmoteFromQuery(text);
  if (strongLocal) return strongLocal;

  if (localResults.length === 0) return null;

  const candidates = localResults
    .map(
      (emote) =>
        `#${emote.number} ${String(emote.name).replace(/\|/g, "/")} (${String(
          emote.id
        ).replace(/\|/g, "/")})`
    )
    .join("\n");

  const systemPrompt = `
You are Beatly's internal emote selector.

Your ONLY job is to choose the most likely emote from the provided VERIFIED candidates.

You MUST NOT invent an emote.
You MUST NOT choose an emote that is not in the candidates.
You MUST NOT change the number.
You MUST NOT change the candidate name.

Understand:
- English
- Arabic
- Egyptian Arabic
- Arabic-English mixed language
- slang
- transliteration
- misspellings
- approximate descriptions
- similar-to requests
- dance descriptions
- TikTok-style descriptions

Examples:
reset
rest
ريست
رست
ماكارينا
رقصة شبه كذا

Reply ONLY:

NUMBER|NAME|CONFIDENCE

Confidence must be exactly:
high
medium
low
`;

  const userPrompt =
    language === "en"
      ? `
The user is trying to identify a Beatly emote/dance.

User message:
"${String(text || "")}"

Cleaned search:
"${String(searchQuery || "")}"

Available VERIFIED candidates:
${candidates}

Choose the closest candidate ONLY from this list.
`
      : `
المستخدم بيحاول يحدد رقصة أو Emote في Beatly.

رسالة المستخدم:
"${String(text || "")}"

البحث المنظف:
"${String(searchQuery || "")}"

الاختيارات المؤكدة الموجودة فعليًا في Beatly:
${candidates}

اختار أقرب اختيار من القائمة فقط.
ممنوع اختراع أي رقم أو اسم.
`;

  const result = await askGroqRaw(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    { temperature: 0.1, max_completion_tokens: 40, top_p: 0.9 }
  );

  if (!result) return null;

  const match = result.match(
    /^\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*(high|medium|low)\s*$/i
  );

  if (!match) {
    log.warn("EmoteAI", `Invalid selector response: ${result}`);
    return null;
  }

  const number = Number(match[1]);
  const confidence = match[3].toLowerCase();
  const emote = localResults.find((item) => item.number === number);

  if (!emote) {
    log.warn("EmoteAI", `AI selected non-candidate emote #${number}.`);
    return null;
  }

  return { ...emote, confidence, source: "ai" };
}

async function suggestEmote(text, language) {
  const known = findLocalEmoteFromQuery(text);
  if (known) return known;

  const candidates = getRandomEmoteCandidates(5);
  if (!candidates.length) return null;

  const candidateText = candidates
    .map(
      (emote) =>
        `#${emote.number} ${String(emote.name).replace(/\|/g, "/")} (${String(
          emote.id
        ).replace(/\|/g, "/")})`
    )
    .join("\n");

  if (GROQ_API_KEY) {
    const systemPrompt = `
You are Beatly's internal dance recommendation selector.

Your ONLY job is to select ONE emote from the VERIFIED candidate list.

IMPORTANT:
- You MUST choose ONLY from the candidates.
- NEVER invent an emote.
- NEVER invent a number.
- NEVER change a candidate number.
- NEVER create a new emote.
- The candidates are real Beatly emotes.

The user may speak:
- Arabic
- Egyptian Arabic
- English
- Arabic-English mixed
- slang
- transliteration
- misspellings

If the user gives a generic request such as:
"اقترح عليا رقصة"
"رشحلي رقصة"
"suggest me a dance"

simply choose the candidate that seems most fun/suitable.

Reply ONLY:

NUMBER|NAME
`;

    const userPrompt = `
User request:
"${String(text || "")}"

Verified Beatly emotes:
${candidateText}

Choose exactly ONE candidate.
`;

    const result = await askGroqRaw(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      { temperature: 0.7, max_completion_tokens: 30, top_p: 0.9 }
    );

    if (result) {
      const match = result.match(/^\s*(\d+)\s*\|\s*([^|]+?)\s*$/i);
      if (match) {
        const number = Number(match[1]);
        const selected = candidates.find((e) => e.number === number);
        if (selected) {
          return { ...selected, confidence: "high", source: "ai-suggestion" };
        }
      }
      log.warn("EmoteAI", `Invalid suggestion response: ${result}`);
    }
  }

  const fallback =
    candidates[Math.floor(Math.random() * candidates.length)];
  if (!fallback) return null;

  log.info(
    "EmoteAI",
    `Using local suggestion fallback: #${fallback.number} ${fallback.name}`
  );

  return { ...fallback, confidence: "high", source: "local-suggestion" };
}

function formatEmoteInfo(emote, language, intent) {
  if (!emote) return null;

  if (language === "en") {
    if (intent === "play") {
      return `🎭 Playing ${emote.name} (#${emote.number}).\nSend "stop" to stop it.`;
    }
    return `🎭 ${emote.name} is #${emote.number}.\nPlay it by sending ${emote.number} or "${emote.name}".`;
  }

  if (intent === "play") {
    return `🎭 شغلت \n${emote.name} (#${emote.number}).\nابعت \n"stop" \nأو "توقف" عشان توقفها.`;
  }

  return `🎭 رقصة ${emote.name} رقمها #${emote.number}.\nشغّلها بإرسال ${emote.number} أو اسمها "${emote.name}".`;
}

function formatEmoteSuggestion(emote, language) {
  if (!emote) return null;

  if (language === "en") {
    return `🎭 I'd suggest ${emote.name} (#${emote.number}).\nPlay it by sending "${emote.name}" or "${emote.number}".`;
  }

  return `🎭 أرشحلك \n${emote.name} (#${emote.number}).\nشغّلها بإرسال \n"${emote.name}" \nأو \n"${emote.number}".`;
}

function formatUncertainEmote(emote, language) {
  if (!emote) return null;

  if (language === "en") {
    return `🤔 I think you mean ${emote.name} (#${emote.number}). If that's the one, send ${emote.number} to play it.`;
  }

  return `🤔 غالبًا تقصد ${emote.name} (#${emote.number}). لو هي دي، ابعت ${emote.number} عشان تشغلها.`;
}

function formatEmoteNotFound(query, language = "ar") {
  if (language === "en") {
    return `🎭 I couldn't find a matching dance for "${query}". Try another dance name or describe the dance you want.`;
  }
  return `🎭 مش لاقي رقصة مطابقة لـ "${query}".\nجرّب اسم رقصة تانية أو اوصفلي الرقصة اللي عايزها وأنا هحاول أرشحلك واحدة.`;
}

async function sendDirect(bot, userId, text) {
  const data = users[userId];
  if (!data || !data.conversationId) return false;

  try {
    const result = await bot.direct.send(data.conversationId, text);
    if (result && !result.ok) {
      log.warn("Direct", result.error || "Failed to send direct message.");
      return false;
    }
    return true;
  } catch (error) {
    log.error("Direct", error.message);
    return false;
  }
}

async function notifyEmoteStart(bot, user, emote, options = {}) {
  if (!hasConversation(user.id)) return;
  const language = getBotLanguage() || "ar";

  if (language === "en") {
    await sendDirect(
      bot,
      user.id,
      `🎭 Playing ${emote.name} (#${emote.number}).\nSend "stop" to stop it.`
    );
  } else {
    await sendDirect(
      bot,
      user.id,
      `🎭 شغلت \n${emote.name} \n#${emote.number}\nابعت \n"stop"\n أو "توقف" عشان توقفها.`
    );
  }
}

async function notifyEmoteStop(bot, user) {
  if (!hasConversation(user.id)) return;
  const language = getBotLanguage() || "ar";

  if (language === "en") {
    await sendDirect(bot, user.id, "🛑 Emote stopped.");
  } else {
    await sendDirect(bot, user.id, "🛑 وقفت الرقصة.");
  }
}

async function startEmote(bot, user, emote, options = {}) {
  if (!emote) return false;

  try {
    const result = await bot.looper.start(user, emote.id);
    if (result === false) {
      await bot.whisper.send(user.id, getBotLanguage() === "en" ? "Could not start that emote." : "❌ مقدرتش أشغل الرقصة دي.");
      return false;
    }

    setLastEmote(user.id, emote);
    setLastReferencedEmote(user.id, emote);

    const xpResult = awardEmoteXp(user.id);
    if (xpResult.leveledUp) {
      const levelUp = formatLevelUp(user, getBotLanguage() || "ar", xpResult);
      if (options.publicLevelUp) await bot.message.send(levelUp);
      else if (options.conversationId) await sendDirectConversation(bot, options.conversationId, levelUp);
      else await bot.whisper.send(user.id, levelUp);
    }

    await notifyEmoteStart(bot, user, emote);
    return true;
  } catch (error) {
    log.error("Emote", error.stack || error.message);
    await bot.whisper.send(user.id, getBotLanguage() === "en" ? "❌ Could not start the emote." : "❌ مقدرتش أشغل الرقصة.");
    return false;
  }
}

async function stopEmote(bot, user) {
  try {
    const stopped = bot.looper.stop(user.id);

    await notifyEmoteStop(bot, user);

    if (!hasConversation(user.id)) {
      await bot.whisper.send(
        user.id,
        stopped
          ? (getBotLanguage() === "en" ? "🛑 Emote stopped." : "🛑 وقفت الرقصة.")
          : (getBotLanguage() === "en" ? "🛑 No active emote." : "🛑 مفيش رقصة شغالة.")
      );
    }

    return true;
  } catch (error) {
    log.error("Emote", error.message);
    return false;
  }
}

async function sendDirectConversation(bot, conversationId, text) {
  if (!conversationId) return false;
  try {
    const result = await bot.direct.send(conversationId, text);
    if (result && !result.ok) {
      log.warn("Direct", result.error || "Failed to send message.");
      return false;
    }
    return true;
  } catch (error) {
    log.error("Direct", error.message);
    return false;
  }
}

async function handleNaturalEmoteRequest(
  bot,
  user,
  content,
  language,
  conversation,
  options = {}
) {
  // Natural-language matching may call the AI selector. It is a Direct-only
  // feature, so a room-chat caller must stop before any matching or reply is
  // attempted. Public commands continue to use their deterministic handlers.
  if (!conversation?.id || options.public) {
    log.warn(
      "EmoteAI",
      "Blocked natural emote handling outside a Direct conversation."
    );
    return false;
  }

  const intent = detectEmoteIntent(content);

  if (intent === "suggest") {
    const suggested = await suggestEmote(content, language);

    if (!suggested) {
      const response =
        language === "en"
          ? "🎭 I couldn't find an available dance to recommend right now."
          : "🎭 مش قادر أطلعلك رقصة متاحة دلوقتي.";

      if (options.public) {
        await bot.whisper.send(user.id, response);
      } else if (conversation) {
        await sendDirectConversation(bot, conversation.id, response);
      }
      return true;
    }

    setLastReferencedEmote(user.id, suggested);
    const response = formatEmoteSuggestion(suggested, language);

    if (options.public) {
      await bot.whisper.send(user.id, response);
    } else if (conversation) {
      await sendDirectConversation(bot, conversation.id, response);
    }
    return true;
  }

  if (
    intent === "play" &&
    (content.includes("شغلها") ||
      content.includes("شغله") ||
      content.includes("اشغلها") ||
      content.includes("طب شغلهالي"))
  ) {
    const contextual = getContextualEmote(user.id);
    if (contextual) {
      await startEmote(bot, user, contextual);
      return true;
    }
  }

  const directMatch = findLocalEmoteFromQuery(content);
  if (directMatch) {
    if (intent === "play" || intent === "both") {
      await startEmote(bot, user, directMatch);
      if (intent === "both") {
        const info = formatEmoteInfo(directMatch, language, "lookup");
        if (options.public) {
          await bot.whisper.send(user.id, info);
        } else if (conversation) {
          await sendDirectConversation(bot, conversation.id, info);
        }
      }
    } else {
      setLastReferencedEmote(user.id, directMatch);
      const info = formatEmoteInfo(directMatch, language, intent);
      if (options.public) {
        await bot.whisper.send(user.id, info);
      } else if (conversation) {
        await sendDirectConversation(bot, conversation.id, info);
      }
    }
    return true;
  }

  const guessed = await guessEmoteWithAI(content, language);
  if (guessed) {
    if (guessed.confidence === "high") {
      if (intent === "play" || intent === "both") {
        await startEmote(bot, user, guessed);
      } else {
        setLastReferencedEmote(user.id, guessed);
        const info = formatEmoteInfo(guessed, language, intent);
        if (options.public) {
          await bot.whisper.send(user.id, info);
        } else if (conversation) {
          await sendDirectConversation(bot, conversation.id, info);
        }
      }
      return true;
    }

    setLastReferencedEmote(user.id, guessed);
    const uncertain = formatUncertainEmote(guessed, language);
    if (options.public) {
      await bot.whisper.send(user.id, uncertain);
    } else if (conversation) {
      await sendDirectConversation(bot, conversation.id, uncertain);
    }
    return true;
  }

  const notFound = formatEmoteNotFound(content, language);
  if (options.public) {
    await bot.whisper.send(user.id, notFound);
  } else if (conversation) {
    await sendDirectConversation(bot, conversation.id, notFound);
  }
  return true;
}

module.exports = {
  emotes,
  loadEmotes,
  emoteByNumber,
  emoteByName,
  emoteById,
  emoteAliases,
  addEmoteAlias,
  buildEmoteAliases,
  resolveEmoteDirectOnly,
  resolveEmote,
  levenshtein,
  similarityScore,
  emoteSearchEntries,
  rebuildEmoteSearchEntries,
  searchEmotesLocally,
  calculateLocalMatchScore,
  extractKnownEmoteFromText,
  getStrongLocalEmote,
  cleanEmoteQuery,
  findLocalEmoteFromQuery,
  getRandomEmoteCandidates,
  guessEmoteWithAI,
  suggestEmote,
  formatEmoteInfo,
  formatEmoteSuggestion,
  formatUncertainEmote,
  formatEmoteNotFound,
  notifyEmoteStart,
  notifyEmoteStop,
  startEmote,
  stopEmote,
  handleNaturalEmoteRequest,
  setLastEmote,
  getLastEmote,
  setLastReferencedEmote,
  getLastReferencedEmote,
  getContextualEmote,
  isRepeatRequest,
  looksLikeEmoteRequest,
  detectEmoteIntent
};
