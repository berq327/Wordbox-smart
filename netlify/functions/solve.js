
'use strict';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

const send = (statusCode, body) => ({
  statusCode,
  headers: HEADERS,
  body: JSON.stringify(body)
});

const DICTIONARY = `
ميلاد لباس سلام كلام كلامي كتاب كتابي كاتب مكتب مكتبة
مدرس مدرسة مدارس دراسة دارس دروس طالب طلاب طلبات
رسالة رسائل رسام طريق شارع شوارع سيارة سيارات
سماع سحاب سحابة سلاح سليم سعيدة سعيد صباح مساء
نهار نهائي نهاية بداية بعيد بعيدة قريب قريبة
غريب غريبة غياب حياة حيوان حديقة حدائق حدود
حديث حديد جديد جديدة قديم قديمة قيمة قلوب
قلبي عالم عالمي علوم علماء علامة علامات
عمال عملي عامل عاملة اعمال صناعة صانع مصانع
صديق صديقة صاحب صاحبة صادق صدقة صدمة صامت
صورة تصوير صيام صائم صلاة صلوات صوتي اصوات
لعبة العاب لاعب لاعبة ملاعب ملعب ملاك ملابس
ملامح ملوك ملكة ملكي طعام طيور طائر طائرة
طيران مطار مطعم مطاعم بحار بحرية بحيرة
بيوت بيتي بيتك بيتها بابك ابواب بوابة
بنات بنتي بناتي بناء بنيان بيان بياض
بيضاء ابيض اسود سوداء احمر حمراء اخضر
ازرق زرقاء اصفر صفراء الوان لونك لوني
نهار ليالي ليلي ليلتي امطار مطري رياح
ريحان رائحة روائح ربيع رمال رملة شمسك
شمسي شموع شمعة شعاع شعور شاعر شعراء
شجرة اشجار شجاع شجاعة ثمار ثمرة ثلوج
ثلجة ثياب ثانية ثواني ثلاثة ثلاثي
صغير صغيرة كبيرة كبير قصير قصيرة طويل
طويلة سرعة سريع سريعة بطيئة بطولة بطلها
ابطال افضل احسن حسنة حسنات حساب حسابي
حسابك حاسب حاسوب محاسب حسابات تجارة
تاجر تجار تجاري سوقك سوقي اسواق اسعار
سعره سعري رخيص رخيصة غالي غالية شراء
شاري مشتري بيعك بيعي بائع بائعة
مفتاح مفاتيح فاتح فاتحة مفتوح فتحات
مغلق دخول داخل خارج خارجي خروج مخرج
مخارج مداخل مدخل خيال خيالي خيمة خيام
خبير خبراء خبرة نظرة نظرات نظري نظارة
نظارات نظيف نظيفة نظافة تنظيف نظام
حروف حروفي حرفي كلمة كلمات كلمتي
هاتف هاتفي هواتف جهاز جهازي اجهزة
شاشة شاشات شبكات شبكة صندوق صناديق
صحون صحنك صحبة صحاب صحفي صحيفة
مدينة مدني مكان مكاني مكانك اماكن
منزل منازل منزلي منزلك منارة
امانة امين امينة ايمان امنية امنيات
زمان زماني قمره قمري قمرك نجوم نجمة
نجاة ناجح ناجحة نجاح ملكية مملكة ممالك
ملوك مالك مالي قانون قوانين قانوني
قواعد قاعدة قيادة قائد قادم قادمة
شباب شبابي رجال رجالي رجلين رجولة
نساء نسائي نسمة نسمات نسيم نسيان
حلمي حلمك احلام حالم حاملة حامل
محبة محبوب حبيب حبيبة حبيبي حبوب
وردك وردي ورود وردة وردية ورقة اوراق
نهره نهري انهار بحري بحرية
سافر مسافر سفره سفرات سفري سفينة
ضحكة ضحكات ضاحك سؤال اسئلة سائل
جواب جوابي جوابك قريب قريبة اقارب
قرابة قرية قراءة تعليم معلم معلمة
معالم معلوم معلومات علمي فكرة افكار
فكري مفكر مفكرة تفكير كريم كريمة
كرامة اكرام مريض مريضة مرضى امراض
علاج علاجي معالج جميل جميلة جمال
جمالي جملة مفيد مفيدة فائدة فوائد
منطق منطقي ناطق ناطقة تاريخ تاريخي
حاضر حاضرة حضور قرار قراري قرارك
قرارات مقرر فرصة فرصتي فوزك فوزي
فائز فائزة موسم مواسم موسمي يومك
يومي ايام يومية يومين اسبوع اسابيع
شهور شهرية شهري سنين سنة سنوات
`.trim().split(/\s+/u);

const norm = value => String(value)
  .normalize('NFC')
  .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا')
  .replace(/ى/g, 'ي');

function trace(word, grid) {
  const letters = [...norm(word)];
  if (letters.length < 4 || letters.length > 5) return null;

  const cells = grid.map(norm);

  function search(path, used) {
    if (path.length === letters.length) return path;

    for (let i = 0; i < 16; i++) {
      if (used.has(i)) continue;
      if (cells[i] !== letters[path.length]) continue;

      if (path.length) {
        const last = path[path.length - 1];
        const rowDistance = Math.abs(
          Math.floor(i / 4) - Math.floor(last / 4)
        );
        const colDistance = Math.abs(
          (i % 4) - (last % 4)
        );

        if (rowDistance > 1 || colDistance > 1) continue;
      }

      used.add(i);
      const result = search([...path, i], used);
      if (result) return result;
      used.delete(i);
    }

    return null;
  }

  return search([], new Set());
}

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return send(405, { error: 'POST only' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return send(503, { error: 'مفتاح OpenAI غير موجود' });
  }

  let timeout;

  try {
    const { image } = JSON.parse(event.body || '{}');

    if (
      typeof image !== 'string' ||
      !/^data:image\/(png|jpeg|webp);base64,/.test(image) ||
      image.length > 7500000
    ) {
      return send(400, { error: 'الصورة غير صالحة أو كبيرة جدًا' });
    }

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 7500);

    const prompt = `
حلل لقطة شاشة لعبة Wordbox العربية، شبكة 4×4.

أرجع JSON فقط:
{
 "grid":["س","ب","ط","ب","ا","خ","ل","ا","ل","ا","م","ي","د","ه","ص","ج"],
 "bounds":{"left":0.1,"right":0.9,"top":0.4,"bottom":0.8},
 "candidates":["كلمة"]
}

هذه الحروف مجرد مثال للشكل المطلوب، وليست الحل.
اقرأ الحروف الحقيقية من الصورة.

القواعد:
1. grid يحتوي بالضبط 16 حرفًا.
2. رتب الحروف من يسار الصورة إلى يمينها،
   صفًا بعد صف من الأعلى للأسفل.
3. bounds تحدد مراكز دوائر الحروف:
   left مركز العمود الأيسر،
   right مركز العمود الأيمن،
   top مركز الصف الأعلى،
   bottom مركز الصف الأسفل.
4. الإحداثيات نسب بين 0 و1 من أبعاد الصورة الكاملة.
5. اقترح أكبر عدد ممكن من الكلمات العربية
   الحقيقية من 4 أو 5 حروف.
6. لا يجوز الانتقال إلا لخانة مجاورة،
   أفقيًا أو عموديًا أو قطريًا.
7. لا تستخدم نفس الخانة مرتين في الكلمة.
8. إذا لم تستطع قراءة حرف فاكتب ?.
9. لا تضف أي شرح خارج JSON.
`;

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          temperature: 0,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                  detail: 'high'
                }
              }
            ]
          }]
        })
      }
    );

    const raw = await response.json();

    if (!response.ok) {
      throw new Error(raw.error?.message || 'فشل التحليل');
    }

    const parsed = JSON.parse(
      raw.choices?.[0]?.message?.content || '{}'
    );

    if (!Array.isArray(parsed.grid) || parsed.grid.length !== 16) {
      throw new Error('لم أتمكن من قراءة شبكة 4×4');
    }

    const grid = parsed.grid.map(
      cell => [...String(cell || '?').trim()][0] || '?'
    );

    if (grid.some(cell => !/^[\u0621-\u064A]$/u.test(cell))) {
      throw new Error('بعض الحروف غير واضحة، ارفع صورة أوضح');
    }

    const b = parsed.bounds;

    const bounds = b ? {
      left: Number(b.left),
      right: Number(b.right),
      top: Number(b.top),
      bottom: Number(b.bottom)
    } : null;

    if (
      !bounds ||
      !Object.values(bounds).every(
        n => Number.isFinite(n) && n >= 0 && n <= 1
      ) ||
      bounds.right <= bounds.left ||
      bounds.bottom <= bounds.top
    ) {
      throw new Error(
        'تعذر تحديد مواقع الحروف، ارفع صورة كاملة'
      );
    }

    const candidates = [
      ...(Array.isArray(parsed.candidates)
        ? parsed.candidates
        : []),
      ...DICTIONARY
    ];

    const words = [];
    const seen = new Set();

    for (const candidate of candidates) {
      const word = String(candidate).trim()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '');

      const key = norm(word);

      if (seen.has(key)) continue;
      if (!/^[\u0621-\u064A]{4,5}$/u.test(word)) continue;

      seen.add(key);

      const path = trace(word, grid);

      if (path) {
        words.push({ word, path });
      }
    }

    words.sort(
      (a, b) =>
        b.word.length - a.word.length ||
        a.word.localeCompare(b.word, 'ar')
    );

    return send(200, {
      grid,
      bounds,
      words,
      note: 'المسارات متحققة على الحروف المقروءة، لكن قراءة الصورة وقبول اللعبة غير مضمونين.'
    });

  } catch (error) {
    return send(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة التحليل، حاول مجددًا'
          : error.message
      }
    );
  } finally {
    clearTimeout(timeout);
  }
};
