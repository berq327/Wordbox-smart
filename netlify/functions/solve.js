exports.handler=async(event)=>{
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':'*'};
 if(event.httpMethod!=='POST')return {statusCode:405,headers,body:JSON.stringify({error:'POST only'})};
 if(!process.env.OPENAI_API_KEY)return {statusCode:503,headers,body:JSON.stringify({error:'يلزم إعداد OPENAI_API_KEY في Netlify → Environment variables. هذه النسخة لا تستطيع تحليل الصورة بدون مفتاح API.'})};
 try{
  const {image}=JSON.parse(event.body||'{}');if(!/^data:image\/(jpeg|png|webp);base64,/.test(image||'')||image.length>7500000)throw Error('الصورة غير صالحة أو كبيرة جدًا');
  const prompt=`حل شبكة Wordbox العربية من الصورة. استخرج فقط شبكة اللعبة ذات 4 صفوف و4 أعمدة. أرجع JSON فقط بالشكل {"grid":["س","ب",... 16 حرفا بترتيب صفوف من اليسار إلى اليمين من أعلى لأسفل],"bounds":{"left":0.1,"top":0.2,"right":0.9,"bottom":0.8},"candidates":["كلمة",...]}. bounds إحداثيات نسبية داخل الصورة الأصلية لأقصى يسار ويمين وأعلى وأسفل مراكز الحروف. احذر: اتجاه العرض عربي لكن ترتيب grid المطلوب من يسار الصورة إلى يمينها. لا تخمن حرفًا غير واضح؛ استخدم ? للحرف غير الواضح. ابحث عن أكبر عدد ممكن من الكلمات العربية الفصيحة الشائعة بطول 4 أحرف أو أكثر، من دون تكرار الحرف المكاني وبالتنقل إلى المربعات الثمانية المجاورة فقط. حاول اقتراح 100-200 كلمة إن أمكن، ولا تختلق كلمات. لا تضف أي كلام خارج JSON.`;
  const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4.1-mini',temperature:0,response_format:{type:'json_object'},messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:image,detail:'high'}}]}],max_tokens:6000})});
  const raw=await r.json();if(!r.ok)throw Error(raw.error?.message||'تعذر الاتصال بخدمة التحليل');
  const parsed=JSON.parse(raw.choices[0].message.content);let grid=parsed.grid||[];if(grid.length!==16)throw Error('لم يتم التعرف على 16 حرفًا');
  grid=grid.map(x=>String(x).trim().slice(0,1));
  function route(word){let chars=[...word];function rec(k,path,used){if(k===chars.length)return path;let opts=path.length?Array.from({length:16},(_,i)=>i).filter(i=>{let p=path.at(-1);return Math.abs(Math.floor(i/4)-Math.floor(p/4))<=1&&Math.abs(i%4-p%4)<=1}):Array.from({length:16},(_,i)=>i);for(let i of opts){if(!used.has(i)&&grid[i]===chars[k]){let v=rec(k+1,[...path,i],new Set([...used,i]));if(v)return v}}return null}return rec(0,[],new Set())}
  let words=[];for(let w of new Set((parsed.candidates||[]).map(x=>String(x).trim().replace(/[\u064B-\u065F\u0670]/g,'')))){if([...w].length<4||!/^[ء-ي]+$/.test(w))continue;let path=route(w);if(path)words.push({word:w,path})}words.sort((a,b)=>b.word.length-a.word.length||a.word.localeCompare(b.word,'ar'));
  return {statusCode:200,headers,body:JSON.stringify({grid,bounds:parsed.bounds||null,words,note:'الكلمات مرشحة من نموذج لغوي ومتحقق من مساراتها هندسيًا؛ قبولها في Plato غير مضمون.'})};
 }catch(e){return {statusCode:422,headers,body:JSON.stringify({error:e.message||'خطأ غير معروف'})}}
};
