const headers = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'};
const reply = (statusCode, data) => ({statusCode,headers,body:JSON.stringify(data)});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405,{error:'POST only'});
  if (!process.env.OPENAI_API_KEY) return reply(503,{error:'مفتاح OPENAI_API_KEY غير موجود'});
  let timeout;
  try {
    const {image} = JSON.parse(event.body || '{}');
    if (typeof image !== 'string' || !/^data:image\/(png|jpeg|webp);base64,/.test(image) || image.length > 7500000)
      return reply(400,{error:'الصورة غير صالحة أو كبيرة جدًا'});

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 7000);
    const prompt = `اقرأ صورة لعبة Wordbox العربية. أرجع JSON فقط بصيغة {"grid":[16 حرفًا],"candidates":["كلمة"]}. ترتيب grid من يسار الصورة إلى يمينها في كل صف، من أعلى إلى أسفل، 4 صفوف × 4 أعمدة. كل عنصر حرف واحد، وضع ? إذا لم يتضح. أعط حتى 35 كلمة عربية شائعة من 4 حروف فأكثر يمكن رسمها بوصل الخانات المتجاورة أفقيًا أو رأسيًا أو قطريًا دون تكرار خانة. لا تشرح.`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST', signal:controller.signal,
      headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({model:'gpt-4.1-mini',temperature:0,max_tokens:1600,response_format:{type:'json_object'},messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:image,detail:'high'}}]}]})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'فشل طلب التحليل');
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    if (!Array.isArray(parsed.grid) || parsed.grid.length !== 16) throw new Error('لم يتم التعرف على 16 حرفًا');
    const grid = parsed.grid.map(x => String(x || '?').trim().slice(0,1));
    const normalize = x => String(x).replace(/[\u064B-\u065F\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');
    function findPath(word) {
      const letters = [...normalize(word)], cells = grid.map(normalize);
      function walk(path, used) {
        if (path.length === letters.length) return path;
        for (let i=0;i<16;i++) {
          if (used.has(i) || cells[i] !== letters[path.length]) continue;
          if (path.length) {
            const last=path[path.length-1];
            if (Math.abs(Math.floor(i/4)-Math.floor(last/4))>1 || Math.abs(i%4-last%4)>1) continue;
          }
          used.add(i);
          const found=walk([...path,i],used);
          if (found) return found;
          used.delete(i);
        }
        return null;
      }
      return walk([],new Set());
    }
    const words=[],seen=new Set();
    for (const candidate of parsed.candidates || []) {
      const word=String(candidate).trim().replace(/[\u064B-\u065F\u0670]/g,'');
      if ([...word].length<4 || seen.has(word)) continue;
      seen.add(word);
      const path=findPath(word);
      if (path) words.push({word,path});
    }
    words.sort((a,b)=>[...b.word].length-[...a.word].length);
    return reply(200,{grid,bounds:null,words,note:'المسارات متحققة، لكن قبول الكلمات داخل اللعبة غير مضمون'});
  } catch (err) {
    return reply(err.name==='AbortError'?504:422,{error:err.name==='AbortError'?'انتهت مهلة التحليل (7 ثوانٍ). جرّب مجددًا.':err.message});
  } finally { clearTimeout(timeout); }
};
