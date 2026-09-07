function normalizeArabicDigits(text) {
  return String(text || "")
    .replace(/[٠-٩]/g, (char) => String("٠١٢٣٤٥٦٧٨٩".indexOf(char)))
    .replace(/[۰-۹]/g, (char) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(char)));
}

function normalizeText(text) {
  return normalizeArabicDigits(String(text || ""))
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/[؟?!.,،؛:()[\]{}"“”`]/g, " ")
    .replace(/\s+/g, " ");
}

const arabicTransliterationMap = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "a", "ب": "b", "ت": "t", "ث": "th",
  "ج": "g", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a",
  "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "و": "w", "ي": "y", "ى": "a", "ة": "a", "ء": "", "ؤ": "w",
  "ئ": "y", "ـ": "", "َ": "", "ُ": "", "ِ": "", "ّ": "", "ْ": "", "ً": "",
  "ٌ": "", "ٍ": ""
};

function transliterateArabic(text) {
  let value = normalizeArabicDigits(String(text || "")).toLowerCase();
  for (const [arabic, latin] of Object.entries(arabicTransliterationMap)) {
    value = value.split(arabic).join(latin);
  }
  return value.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeLatinPhonetic(text) {
  return normalizeText(text)
    .replace(/ph/g, "f")
    .replace(/ck/g, "k")
    .replace(/qu/g, "q")
    .replace(/oo/g, "u")
    .replace(/ee/g, "i")
    .replace(/aa/g, "a")
    .replace(/ii/g, "i")
    .replace(/uu/g, "u")
    .replace(/yy/g, "y");
}

function normalizeLatinFuzzy(text) {
  return normalizeLatinPhonetic(text)
    .replace(/[eiy]/g, "i")
    .replace(/c/g, "k")
    .replace(/ph/g, "f")
    .replace(/x/g, "ks")
    .replace(/(.)\1+/g, "$1");
}

function getSearchForms(text) {
  const original = normalizeText(text);
  if (!original) return [];

  const forms = new Set();
  forms.add(original);

  const transliterated = transliterateArabic(original);
  if (transliterated) forms.add(transliterated);

  const phonetic = normalizeLatinPhonetic(original);
  if (phonetic) forms.add(phonetic);

  if (transliterated) {
    const transliteratedPhonetic = normalizeLatinPhonetic(transliterated);
    if (transliteratedPhonetic) forms.add(transliteratedPhonetic);
    const fuzzy = normalizeLatinFuzzy(transliterated);
    if (fuzzy) forms.add(fuzzy);
  }

  const fuzzyOriginal = normalizeLatinFuzzy(original);
  if (fuzzyOriginal) forms.add(fuzzyOriginal);

  return Array.from(forms);
}

function detectArabic(text) {
  return /[\u0600-\u06FF]/.test(String(text || ""));
}

module.exports = {
  normalizeArabicDigits,
  normalizeText,
  transliterateArabic,
  normalizeLatinPhonetic,
  normalizeLatinFuzzy,
  getSearchForms,
  detectArabic
};
