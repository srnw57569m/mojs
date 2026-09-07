const log=require("../utils/logger");
const { getBotStaffIds }=require("../services/permissions");
const { getBotLanguage }=require("../services/language");
const { t }=require("../services/i18n");
const moderationLog=new Map();
function actionName(type,lang){return t("actions",lang)?.[type]||type;}
function durationText(duration){if(duration===undefined||duration===null||duration==="")return "";const n=Number(duration);if(!Number.isFinite(n))return String(duration);return `${n} seconds`;}
async function resolveName(bot,u){if(u?.username)return u.username;try{const found=await bot.room.users.find(u?.id);if(found?.user?.username)return found.user.username;}catch(e){}return u?.id||"Unknown";}
function registerModerationHandler(bot){bot.on("Moderation",async(moderator,target,action)=>{try{const lang=getBotLanguage()||"ar";const modName=await resolveName(bot,moderator);const targetName=await resolveName(bot,target);const type=String(action?.type||"moderation").toLowerCase();const duration=durationText(action?.duration);const history=moderationLog.get(target.id)||[];history.push({type,duration:action?.duration,moderatorId:moderator?.id,timestamp:Date.now()});moderationLog.set(target.id,history);log.info("Moderation",`${modName} ${type} ${targetName}${duration?` for ${duration}`:""}`);const ids=await getBotStaffIds(bot);if(!ids.length)return;const msg=t("moderation",lang,modName,actionName(type,lang),targetName,duration);for(let i=0;i<ids.length;i+=100){try{await bot.direct.broadcast(ids.slice(i,i+100),msg);}catch(e){log.error("ModerationNotify",e.message);}}}catch(err){log.error("ModerationHandler",err.stack||err.message);}});}
module.exports=registerModerationHandler;
