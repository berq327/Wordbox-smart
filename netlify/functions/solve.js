
'use strict';

const H = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

const send = (statusCode, data) => ({
  statusCode,
  headers: H,
  body: JSON.stringify(data)
});

// قاموس إضافي للمراحل الصعبة
const DICTIONARY = `
نبذل نبهت نبهه نبهنا تنبه تنبيه منبه منهل نهمل تمهل تهمل مهمل
شوهت شوهه شتمه شتمهن خمنت خمنه خمنوا نبتت ينبت تنبت منبت
نبيل نبيه نبل نذل بذل بذلة بذور ذهب ذهبي هبة هبات هبط هبوط
خجل خجول خجلة خجلت جبل جبال جبلي جبهة جبين بهجة بهيج
نجم نجمة نجمك جمل جمال جملة جملها جميل جميلة مجمل
عنب عنبة عنبك نبع منبع ينبع ينابيع نبت نبات نباتي نباتات
لبن لبنة لبني لبنك لحم لحمة لحوم ملح مالح ملحة ملاحة
همل مهملة مهملات خبل خبال خبير خبرة خبرك خبري اخبار
شمل شامل شمال شمول مشمول شمعة شموع شمسي شمسك
منجم منجمة منجمك منهج مناهج نهج نهجة ناهج
بلوغ بالغ بالغة مبلغ مبالغ بلغنا بلغه بلغوا
نمو نموه نموك نموها نموت نموا منوم
هجوم هاجم هاجمت مهاجم مهاجمة هجمة هجمات
ميلاد لباس سلام كلام كلامي كتاب كتابي كاتب مكتب مكاتب مكتبة
مدرس مدرسة مدارس دراسة دارس دروس طالب طلاب طلبات طالبات
رسالة رسائل رسام طريق طرقات شارع شوارع سيارة سيارات
سماع سحاب سحابة سلاح سليم سعيد سعيدة صباح مساء
نهار نهاية بداية بعيد بعيدة قريب قريبة غريب غريبة غياب
حياة حيوان حديقة حدائق حدود حديث حديد جديد جديدة قديم قديمة
قيمة قلوب قلبي عالم عالمي علوم علماء علامة علامات
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
ليالي ليلي ليلتي امطار مطري رياح
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
نظرة نظرات نظري نظارة نظارات نظيف نظيفة نظافة تنظيف نظام
حروف حروفي حرفي كلمة كلمات كلمتي
هاتف هاتفي هواتف جهاز جهازي اجهزة
شاشة شاشات شبكات شبكة صندوق صناديق
صحون صحنك صحبة صحاب صحفي صحيفة
مدينة مدني مكان مكاني مكانك اماكن
منزل منازل منزلي منزلك منارة
امانة امين امينة ايمان امنية امنيات
زمان زماني قمره قمري قمرك نجوم نجمة
نجاة ناجح ناجحة نجاح ملكية مملكة ممالك
مالك مالي قانون قوانين قانوني
قواعد قاعدة قيادة قائد قادم قادمة
شباب شبابي رجال رجالي رجلين رجولة
نساء نسائي نسمة نسمات نسيم نسيان
حلمي حلمك احلام حالم حاملة حامل
محبة محبوب حبيب حبيبة حبيبي حبوب
وردك وردي ورود وردة وردية ورقة اوراق
نهره نهري انهار بحري بحرية
سافر مسافر سفره سفرات سفري سفينة
ضحكة ضحكات ضاحك سؤال اسئلة سائل
جواب جوابي جوابك اقارب قرابة قرية قراءة
تعليم معلم معلمة معالم معلوم معلومات علمي فكرة افكار
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
شمال جنوب شرقي غربي يمين يسار وسطى
خالد خليل خيال ملاح ملاحة مالح ملحك لحام لحظة لحظات
حليب حلوى حلوة حلوين حلاوة حلويات
غزال غزالة غالي غالية غناء اغاني
صباح صبحي صباحي مصباح مصابيح
`.trim().split(/\s+/u);

const norm = value => String(value)
  .normalize('NFC')
  .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا')
  .replace(/ى/g, 'ي');

function findPath(word, grid) {
  const chars = [...norm(word)];
  const cells = grid.map(norm);

  if (chars.length < 4 || chars.length > 5) {
    return null;
  }

  function visit(path, used) {
    if (path.length === chars.length) return path;

    for (let i = 0; i < 16; i++) {
      if ((used & (1 << i)) ||
          cells[i] !== chars[path.length]) continue;

      if (path.length) {
        const j = path[path.length - 1];

        if (
          Math.abs(Math.floor(i / 4) - Math.floor(j / 4)) > 1 ||
          Math.abs((i % 4) - (j % 4)) > 1
        ) continue;
      }

      const result = visit(
        [...path, i],
        used | (1 << i)
      );

      if (result) return result;
    }

    return null;
  }

  return visit([], 0);
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return send(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return send(405, {error: 'POST only'});
  }

  if (!process.env.OPENAI_API_KEY) {
    return send(503, {error: 'مفتاح OpenAI غير موجود'});
  }

  let timer;

  try {
    const {image} = JSON.parse(event.body || '{}');

    if (
      typeof image !== 'string' ||
      !/^data:image\/(png|jpeg|webp);base64,/.test(image) ||
      image.length > 7500000
    ) {
      return send(400, {
        error: 'الصورة غير صالحة أو كبيرة جدًا'
      });
    }

    const controller = new AbortController();

    // 8.8 ثوانٍ للطلب، والباقي لمعالجة النتيجة
    timer = setTimeout(
      () => controller.abort(),
      8800
    );

    const prompt = `
أنت محلل لعبة Wordbox العربية للمراحل الصعبة.

اقرأ شبكة الدوائر 4×4 في الصورة،
حتى لو كانت داخل لقطة شاشة لهاتف.

أرجع JSON فقط بالمفاتيح:
grid وbounds وcandidates.

grid:
مصفوفة 16 حرفًا بالضبط، من يسار الصورة
إلى يمينها صفًا صفًا من الأعلى للأسفل.
لا تخلط بين النص خارج الدوائر والحروف.

bounds:
كائن مثل
{"left":0.1,"right":0.9,"top":0.3,"bottom":0.8}
لكن استبدل الأرقام بمراكز دوائر العمود
الأول والأخير والصف الأول والأخير
كنسب من عرض وارتفاع الصورة الكاملة.
لا تستخدم قيم المثال.

candidates:
حتى 75 كلمة عربية من 4 أو 5 أحرف فقط.
ابحث عن الأفعال بصيغها والأسماء والصفات
والكلمات غير الشائعة.
لا تكتف بالكلمات السهلة.

يجب أن يكون لكل كلمة مسار عبر خانات
متجاورة أفقيًا أو رأسيًا أو قطريًا،
دون تكرار خانة.

لا تخترع حروفًا ولا تكتب شرحًا.
`;

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization:
            'Bearer ' + process.env.OPENAI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          temperature: 0,
          max_tokens: 1700,
          response_format: {
            type: 'json_object'
          },
          messages: [{
            role: 'user',
            content: [
              {type: 'text', text: prompt},
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
      throw new Error(
        raw.error?.message || 'فشل التحليل'
      );
    }

    const parsed = JSON.parse(
      raw.choices?.[0]?.message?.content || '{}'
    );

    if (
      !Array.isArray(parsed.grid) ||
      parsed.grid.length !== 16
    ) {
      throw new Error(
        'لم أتمكن من قراءة شبكة 4×4'
      );
    }

    const grid = parsed.grid.map(
      x => [...String(x || '?').trim()][0] || '?'
    );

    if (grid.some(
      x => !/^[\u0621-\u064A]$/u.test(x)
    )) {
      throw new Error(
        'بعض الحروف غير واضحة، ارفع صورة أوضح'
      );
    }

    const b = parsed.bounds || {};

    const bounds = {
      left: Number(b.left),
      right: Number(b.right),
      top: Number(b.top),
      bottom: Number(b.bottom)
    };

    const goodBounds =
      Object.values(bounds).every(
        n => Number.isFinite(n) &&
             n >= 0 && n <= 1
      ) &&
      bounds.left < bounds.right &&
      bounds.top < bounds.bottom;

    const words = [];
    const seen = new Set();

    const candidates = [
      ...(Array.isArray(parsed.candidates)
        ? parsed.candidates : []),
      ...DICTIONARY
    ];

    for (const candidate of candidates) {
      const word = String(candidate)
        .trim()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '');

      const key = norm(word);

      if (
        seen.has(key) ||
        !/^[\u0621-\u064A]{4,5}$/u.test(word)
      ) continue;

      seen.add(key);

      const path = findPath(word, grid);

      if (path) {
        words.push({word, path});
      }
    }

    words.sort(
      (a, b) =>
        b.word.length - a.word.length ||
        a.word.localeCompare(b.word, 'ar')
    );

    return send(200, {
      grid,
      bounds: goodBounds ? bounds : null,
      words: words.slice(0, 30),
      note: words.length < 10
        ? 'وجدنا أقل من 10 كلمات بمسارات متصلة.'
        : 'المسارات متصلة، لكن قبول اللعبة غير مضمون.'
    });

  } catch (error) {
    return send(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة 9 ثوانٍ، حاول بصورة أوضح أو أصغر.'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
