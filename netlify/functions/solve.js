
'use strict';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};
const respond = (statusCode, data) => ({
  statusCode,
  headers: HEADERS,
  body: JSON.stringify(data)
});

// كلمات عربية، ولن تظهر إلا إذا كان لها مسار متصل.
const WORDS = `
ميلاد لباس سلام كلام كلامي كتاب كتابي كاتب مكتب مكاتب مكتبة
مدرس مدرسة مدارس دراسة دارس دروس طالب طلاب طلبات
رسالة رسائل رسام طريق طرقات شارع شوارع سيارة سيارات
سماع سحاب سحابة سلاح سليم سعيد صباح مساء
نهار نهاية بداية بعيد بعيدة قريب قريبة
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
شمال جنوب شرقي غربي يمين يسار وسطى
سؤال جواب دخول خروج خالد خليل خيال
ملاح ملاحة مالح ملحك لحام لحظة لحظات
جمال جملة جميل جميلة مجمل مجالي
نبات نباتي نباتات نباتي ثابت ثبات
حليب حلوى حلوة حلوين حلاوة حلويات
غزال غزالة غالي غالية غناء اغاني
صباح صبحي صباحي مصباح مصابيح
اخبار خبرك خبري خبرة خبير
`.trim().split(/\s+/u);

const normalize = value => String(value)
  .normalize('NFC')
  .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا')
  .replace(/ى/g, 'ي');

function findPath(word, grid) {
  const letters = [...normalize(word)];
  const cells = grid.map(normalize);
  if (letters.length < 4 || letters.length > 5) return null;

  function walk(path, mask) {
    if (path.length === letters.length) return path;

    for (let i = 0; i < 16; i++) {
      if ((mask & (1 << i)) ||
          cells[i] !== letters[path.length]) continue;

      if (path.length) {
        const last = path[path.length - 1];
        if (
          Math.abs(Math.floor(i / 4) -
                   Math.floor(last / 4)) > 1 ||
          Math.abs(i % 4 - last % 4) > 1
        ) continue;
      }

      const found = walk([...path, i], mask | (1 << i));
      if (found) return found;
    }
    return null;
  }

  return walk([], 0);
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') return respond(200, {});
  if (event.httpMethod !== 'POST')
    return respond(405, {error: 'POST only'});

  if (!process.env.OPENAI_API_KEY)
    return respond(503, {error: 'OPENAI_API_KEY غير موجود'});

  let timer;

  try {
    const {image} = JSON.parse(event.body || '{}');

    if (
      typeof image !== 'string' ||
      !/^data:image\/(png|jpeg|webp);base64,/.test(image) ||
      image.length > 7500000
    ) {
      return respond(400, {
        error: 'الصورة غير صالحة أو كبيرة جدًا'
      });
    }

    const controller = new AbortController();
    timer = setTimeout(() => controller.abort(), 9000);

    const prompt = `اقرأ شبكة الحروف العربية 4×4 في لقطة لعبة Wordbox. أجب JSON فقط بهذه المفاتيح:
"grid": مصفوفة 16 حرفا بترتيب الصفوف من يسار الصورة إلى يمينها، من الأعلى للأسفل.
"bounds": كائن {"left":0.0,"right":1.0,"top":0.0,"bottom":1.0} لكن استبدل القيم بمواقع مراكز أول وآخر أعمدة وصفوف دوائر الحروف الحقيقية كنسب من عرض وارتفاع الصورة الكاملة. لا تستخدم حدود اللوحة؛ استخدم مراكز الدوائر.
"candidates": حتى 25 كلمة عربية حقيقية من 4 أو 5 حروف قابلة للتوصيل من خانات متجاورة (أفقي/رأسي/قطري)، دون إعادة استخدام الخانة.
لا تخمن حرفا غير واضح، واكتب ? مكانه. لا تكتب أي شرح.`;

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
          max_tokens: 1000,
          response_format: {type: 'json_object'},
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

    if (!response.ok)
      throw new Error(raw.error?.message || 'فشل التحليل');

    const parsed = JSON.parse(
      raw.choices?.[0]?.message?.content || '{}'
    );

    if (!Array.isArray(parsed.grid) ||
        parsed.grid.length !== 16) {
      throw new Error('لم أستطع قراءة شبكة 4×4');
    }

    const grid = parsed.grid.map(
      value => [...String(value || '?').trim()][0] || '?'
    );

    if (grid.some(
      letter => !/^[\u0621-\u064A]$/u.test(letter)
    )) {
      throw new Error(
        'بعض الحروف غير واضحة؛ ارفع صورة أوضح للشبكة كاملة'
      );
    }

    const b = parsed.bounds || {};
    const bounds = {
      left: Number(b.left),
      right: Number(b.right),
      top: Number(b.top),
      bottom: Number(b.bottom)
    };

    if (
      !Object.values(bounds).every(
        n => Number.isFinite(n) && n >= 0 && n <= 1
      ) ||
      bounds.left >= bounds.right ||
      bounds.top >= bounds.bottom
    ) {
      throw new Error(
        'لم أستطع تحديد مواقع الحروف بدقة؛ ارفع صورة كاملة'
      );
    }

    const words = [];
    const seen = new Set();
    const candidates = [
      ...(Array.isArray(parsed.candidates)
        ? parsed.candidates : []),
      ...WORDS
    ];

    for (const value of candidates) {
      const word = String(value).trim()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '');

      const key = normalize(word);

      if (
        seen.has(key) ||
        !/^[\u0621-\u064A]{4,5}$/u.test(word)
      ) continue;

      seen.add(key);
      const path = findPath(word, grid);

      if (path) words.push({word, path});
    }

    words.sort(
      (a, b) =>
        b.word.length - a.word.length ||
        a.word.localeCompare(b.word, 'ar')
    );

    return respond(200, {grid, bounds, words});

  } catch (error) {
    return respond(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة 9 ثوانٍ؛ جرّب صورة أصغر أو أعد المحاولة'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
