const config = require("../config");
const { users } = require("./users");
const adminNames = new Set((Array.isArray(config.admins)?config.admins:[]).filter(Boolean).map(x=>String(x).trim().toLowerCase()));
if (config.owner) adminNames.add(String(config.owner).trim().toLowerCase());
let actualOwnerId=null;
async function resolveOwnerId(bot){
  if(actualOwnerId)return actualOwnerId;
  const metadataOwnerId=bot?.metadata?.room?.ownerId;
  if(metadataOwnerId){actualOwnerId=metadataOwnerId;return actualOwnerId;}
  try{const response=await bot.room.users.get();const list=Array.isArray(response)?response:(response&&Array.isArray(response.users)?response.users:[]);const found=list.find(x=>x?.user?.username&&x.user.username.toLowerCase()===String(config.owner).trim().toLowerCase());if(found){actualOwnerId=found.user.id;return actualOwnerId;}}catch(e){}
  try{const result=await bot.webapi?.users?.get(config.owner);if(result?.ok&&result.user){actualOwnerId=result.user.id;return actualOwnerId;}}catch(e){}
  return null;
}
function isAdmin(user){return !!user&&adminNames.has(String(user.username||"").trim().toLowerCase());}
function isOwner(user){return !!user&&((actualOwnerId&&user.id===actualOwnerId)||String(user.username||"").trim().toLowerCase()===String(config.owner).trim().toLowerCase());}
async function getBotStaffIds(bot){
  const ids=new Set();
  if(actualOwnerId) ids.add(actualOwnerId);
  const names=new Set(adminNames);
  for(const [id,data] of Object.entries(users||{})){if(data?.username&&names.has(String(data.username).toLowerCase()))ids.add(id);}
  try{const room=await bot.room.users.get();const list=Array.isArray(room)?room:(room&&Array.isArray(room.users)?room.users:[]);for(const item of list){const u=item?.user||item;if(!u?.id)continue; if(names.has(String(u.username||"").toLowerCase()))ids.add(u.id); try{if(bot.roles?.hasRole?.(u.id,"mod"))ids.add(u.id);}catch(e){}}}catch(e){}
  for(const name of names){try{const r=await bot.webapi?.users?.get(name);if(r?.ok&&r.user?.id)ids.add(r.user.id);}catch(e){}}
  return [...ids];
}
module.exports={adminNames,isAdmin,isOwner,resolveOwnerId,getBotStaffIds};
