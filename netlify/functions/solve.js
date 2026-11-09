
'use strict';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function reply(statusCode, data) {
  return {
    statusCode,
    headers: HEADERS,
    body: JSON.stringify(data)
  };
}

// قاموس مساعد، والذكاء الاصطناعي
// يستطيع اقتراح كلمات من خارجه.
const DICTIONARY = `
سلام كلام كتاب كاتب كتب مكتب مكتبة كلمة كلمات
ملك ملكة ملكي ملوك مالك ملكات
بلد بلاد بلدي بلاط طلب طالب طلبت طلاب
بطل بطلة طبل طبلة طبول
طيب طيبة طبخ طبخة طباخ مطبخ
اكل اكلت اكلة شرب شربت شراب شارب
لبن لبنة لبس لباس لابس لحم لحمة ملح
نهر نهار بحر بحار جبل جبال جمل جمال
جميل جميلة جملة نجم نجمة نجوم
نبه نبهت تنبه منبه نبذ نبذل نبت نبات
هبط ذهب ذهبت ذهبي بذل بذرة ذنب ذنوب
خجل خبير خبر خبرة خمن خمنت
خدم خدمت خادم خدمة خرج خرجت خروج
دخل دخلت دخول داخل مدخل
خلط خليط خلطة خلص خلاص خال خالة
شتم شتمت شتمه شمل شامل شمال
شمس شمعة شموع شجر شجرة
شعر شاعر شعور شعاع شوق
شكر شكرت شاكر شكور شرح شرحت
شارع شرع شرط شرطة شريط
شرب شربت شارب شراب
صبر صبرت صابر صبور صمت صامت
سكت سكتت ساكت سكوت صوت صوتي
صورة صور صيام صائم صلاة
صدق صادق صديق صاحب صحبة صحة
صحن صدمة صنع صنعت صانع صنعة
صغير صغيرة قصير قصيرة قصر قصور
قمر قمري قلب قلبي قلبك قلوب
قول قال قالت قائل مقال مقالة
قرار قرية قريب قريبة كريم كريمة
كرم كبير كبيرة كبر كبرت
كسر كسرت كاسب كسب كسبت
كلم كلمة كلام كتاب كتابي كاتب
كتب كتبت مكتب مكاتب
كلب كلبة كلاب كرة كرات كرسي
ليل ليلة ليالي لون لوني لونك
لعب لعبة لعبت لاعب ملعب
لبن لبنة لبس لباس لابس ملابس
علم علوم علامة معلم معلمة
تعلم تعلمت تعليم عمل عملي عامل
عمال عميل عمر عمري عمارة
عنب عنبة عين عيني عينك عيب عيوب
عيش عائلة عادل عدالة عادي عادة
عاد عادت عودة عدد عداد
عذاب عذب علاج عظيم عظم عظام
غالي غالية غريب غريبة غربة غرب
غزال غابة غيم غيمة غياب غائب
غناء غسل غسلت غنم
فاز فازت فوز فائز فكر فكرة
فتح فتحت فاتح فتى فتاة
فقير فقيرة فرح فرحت فرحة
فرصة فرص فرد فرض فصل فصول
فعل فعلت فهم فهمت فاهم
فائدة مفيد فضل فضاء فضة فيل
قفل قلق قلم اقلام قدم قدمت
قديم قديمة قدر قدرت قادر
قيمة قيم قوي قوية قوة
قام قامت قائم قصص قصة
قطع قطعت قطعة طعام طعم مطعم
طائر طائرة طار طارت طيور
طريق طرق طارق طين طينة
طفل طفلة طاقة طبقة طبع
حبر حبل حبال حب حبيب حبيبة
حبة حبات حياة حيوان حديقة
حدود حديث حديد جديد جديدة
حلو حلوة حلم حلمت احلام
حمل حملت حامل حمار حماس
حارس حرس حرب حروب حرف حروف
حساب حسب حسبت حسن حصان
ربح ربحت رابح ربيع ريح رياح
رمل رمال رمي رميت رامي
راس رأس رئيس رسم رسمت رسام
رسوم رسمي رسالة رصيد
رضا رضيت رجل رجال رجلي
ركض ركضت ركب ركبت ركوب
رقم رقمي رقبة روضة
رائع رائعة ورد وردة ورود
ورق ورقة وزن وزير وزارة
وسط وصل وصلت وعد وعدت
وجد وجدت وجه وجهة
ولد ولدي ولادة والد والدة
وقت وقف وقفت يوم يومي
سنة سنين شهر شهور اسبوع
ساعة ساعات مساء صباح
بداية بدأ بدأت بديل بعيد
قرب قريب قريبة بعد عودة
نزل نزلت منزل منازل
مدينة مدن مكان مساحة
مسح مسحت سكن سكنت ساكن
سيارة سير سافر سفر سفينة
درس درست دروس دراسة
مدرس مدرسة مدارس نجاح نجح
نجحت خسارة خسر خسرت
تجارة تاجر تجار متجر
سعر اسعار رخيص شراء
بيع باع باعت بائع مال مالي
نقد نقود نقش نقشت
هاتف جهاز شاشة شبكة
صندوق صحيفة باب ابواب
بيت بيتي بيتك بيوت بنا بناء
بنت بنات ابناء ابن ابني
ابي امي امك اخ اخي اخت اختي
اهل اهلي ناس انسان نساء
نسمة نسيم نسي نسيت
ذكر ذكرت ذاكر ذكرى
زمن زمان حاضر حضور ماضي
سابق لاحق جديد قديم
اول اولى ثاني ثانية ثالث رابع
خامس سادس سابع ثامن تاسع
واحد واحدة ثلاثة اربع خمسة
ستة سبعة ثمانية تسعة عشرة
شمال جنوب شرق غرب يمين يسار
وسط فوق تحت خلف امام
جانب حول داخل خارج
طويل طويلة قصير قصيرة
كبير كبيرة صغير صغيرة
سريع سريعة بطيء بطيئة
قوي قوية ضعيف ضعيفة
صعب صعبة سهل سهلة
جميل جميلة نظيف نظيفة
نظر نظرت ناظر واضح واضحة
صحيح صحيحة خطأ غلط
ممكن قادر اكيد افضل احسن
اكثر اقل كثير كثيرة قليل قليلة
حقيقي حقيقة صدق صادق
صالح صالحة فرح فرحة
سعيد سعيدة حزين حزينة
حزن خوف خاف خافت
امن امان امين امينة
حلم احلام شوق قلب
محبة محبوب حبيب ورد
نجاة ناجح نجاح نجا
`.trim().split(/\s+/u);

function normalize(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي');
}

// التأكد أن الكلمة من 3 إلى 5 حروف
// وأن كل حرف متصل بالحرف الذي قبله.
function pathExists(word, grid) {
  const chars = [...normalize(word)];

  if (chars.length < 3 || chars.length > 5) {
    return false;
  }

  const cells = grid.map(normalize);

  function walk(position, index, used) {
    if (index === chars.length) {
      return true;
    }

    for (let next = 0; next < 16; next++) {
      if (used & (1 << next)) continue;

      if (cells[next] !== chars[index]) {
        continue;
      }

      if (position !== -1) {
        const rowDistance = Math.abs(
          Math.floor(next / 4) -
          Math.floor(position / 4)
        );

        const colDistance = Math.abs(
          (next % 4) - (position % 4)
        );

        if (
          rowDistance > 1 ||
          colDistance > 1
        ) {
          continue;
        }
      }

      if (
        walk(
          next,
          index + 1,
          used | (1 << next)
        )
      ) {
        return true;
      }
    }

    return false;
  }

  return walk(-1, 0, 0);
}

function parseAI(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(
      /"grid"\s*:\s*(\[[^\]]*\])/
    );

    if (!match) {
      throw new Error(
        'لم تكتمل قراءة الحروف. حاول مرة أخرى.'
      );
    }

    const grid = JSON.parse(match[1]);

    const wordSection = text.match(
      /"words"\s*:\s*\[([\s\S]*)/
    );

    const words = wordSection
      ? [...wordSection[1].matchAll(
          /"([\u0621-\u064A]{3,5})"/gu
        )].map(x => x[1])
      : [];

    return {grid, words};
  }
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return reply(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return reply(405, {
      error: 'POST only'
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return reply(503, {
      error: 'مفتاح OpenAI غير موجود'
    });
  }

  let timer;

  try {
    const body = JSON.parse(
      event.body || '{}'
    );

    const image = body.image;

    if (
      typeof image !== 'string' ||
      !/^data:image\/(png|jpeg|webp);base64,/i.test(image) ||
      image.length > 7500000
    ) {
      return reply(400, {
        error: 'الصورة غير صالحة أو كبيرة'
      });
    }

    const controller = new AbortController();

    timer = setTimeout(
      () => controller.abort(),
      10000
    );

    const prompt = `
اقرأ صورة لعبة Wordbox العربية.

حدد شبكة 4×4 المكونة من 16 حرفًا.

تجاهل أسماء اللاعبين والنصوص
خارج شبكة اللعبة.

أعد JSON فقط بالشكل:

{
 "grid": ["16 حرفًا منفصلًا"],
 "words": ["كلمات عربية"]
}

رتب الحروف من يسار الصورة إلى يمينها
صفًا صفًا، من الأعلى إلى الأسفل.

اقترح حتى 30 كلمة عربية حقيقية
من 3 أو 4 أو 5 حروف فقط.

اكتشف كلمات متنوعة:
أسماء، أفعال، صفات وتصريفات.

يمكن اقتراح كلمات غير شائعة،
لكن لا تخترع كلمات بلا معنى.

كل حرف في الكلمة يجب أن يكون
مجاورًا للحرف السابق أفقيًا
أو رأسيًا أو قطريًا.

لا تستخدم نفس الخانة مرتين.

لا تكتب مسارات ولا شروحات.

أهم شيء قراءة grid بدقة.
`;

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization:
            `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          temperature: 0,
          max_tokens: 850,
          response_format: {
            type: 'json_object'
          },
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
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

    const rawText = await response.text();

    let api;

    try {
      api = JSON.parse(rawText);
    } catch (_) {
      throw new Error(
        'رد خدمة الصور غير مكتمل'
      );
    }

    if (!response.ok) {
      throw new Error(
        api.error?.message ||
        'فشل تحليل الصورة'
      );
    }

    const content =
      api.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        'لم تصل نتيجة من الذكاء الاصطناعي'
      );
    }

    const parsed = parseAI(content);

    if (
      !Array.isArray(parsed.grid) ||
      parsed.grid.length !== 16
    ) {
      throw new Error(
        'لم يتم التعرف على الحروف الـ16'
      );
    }

    const grid = parsed.grid.map(
      x => String(x || '').trim()
    );

    if (
      grid.some(
        x =>
          [...x].length !== 1 ||
          !/^[\u0621-\u064A]$/u.test(x)
      )
    ) {
      throw new Error(
        'بعض الحروف غير واضحة'
      );
    }

    const aiWords = Array.isArray(parsed.words)
      ? parsed.words
      : [];

    const candidates = [
      ...aiWords,
      ...DICTIONARY
    ];

    const seen = new Set();
    const words = [];

    for (const item of candidates) {
      const word = String(item || '')
        .trim()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '');

      const key = normalize(word);

      if (
        !/^[\u0621-\u064A]{3,5}$/u.test(word) ||
        seen.has(key)
      ) {
        continue;
      }

      seen.add(key);

      if (pathExists(word, grid)) {
        words.push({word});
      }
    }

    // عرض الكلمات الأطول أولًا
    words.sort(
      (a, b) =>
        [...b.word].length -
        [...a.word].length ||
        a.word.localeCompare(b.word, 'ar')
    );

    return reply(200, {
      grid,
      words: words.slice(0, 10),
      note: 'تم التحقق من اتصال الحروف'
    });

  } catch (error) {
    return reply(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة التحليل (10 ثوانٍ). حاول بصورة أصغر.'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
