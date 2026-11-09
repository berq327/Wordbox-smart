
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

function normalize(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي');
}

// القاموس المساعد
const DICTIONARY = `
سلام كلام كتاب كاتب مكتب مكتبة كلمة كلمات
ملك ملكة ملكي ملوك مالك ملكات
بلاد بلدي بلاط طالب طلبت طلاب
بطل بطلة طبلة طبول طيبة طبخة طباخ مطبخ
اكلت اكلة شربت شراب شارب
لبنة لباس لابس لحمة نهار بحار جبال جمال
جميل جميلة جملة نجمة نجوم
نبهت تنبه منبه نبذل نبات
ذهبت ذهبي بذرة ذنوب
خبير خبرة خمنت خدمت خادم خدمة خرجت خروج
دخلت دخول داخل مدخل خليط خلطة خلاص خالة
شتمت شتمه شامل شمال شمعة شموع شجرة
شاعر شعور شعاع شكرت شاكر شكور شرحت
شارع شرطة شريط
صبرت صابر صبور صامت سكتت ساكت سكوت صوتي
صورة صيام صائم صلاة صادق صديق صاحب صحبة
صدمة صنعت صانع صنعة
صغير صغيرة قصير قصيرة قصور
قمري قلبي قلبك قلوب قالت قائل مقال مقالة
قرار قرية قريب قريبة كريم كريمة
كبيرة كبرت كسرت كاسب كسبت
كلام كتابي كاتب كتبت مكاتب
كلبة كلاب كرات كرسي ليلة ليالي لوني لونك
لعبة لعبت لاعب ملعب ملابس
علوم علامة معلم معلمة تعلم تعلمت تعليم
عملي عامل عمال عميل عمري عمارة
عنبة عيني عينك عيوب عائلة عادل عدالة
عادي عادة عادت عودة عداد
عذاب علاج عظيم عظام
غالي غالية غريب غريبة غربة
غزال غابة غيمة غياب غائب غناء غسلت
فازت فائز فكرة فتحت فاتح فتاة
فقير فقيرة فرحت فرحة فرصة فرص فرض فصول
فعلت فهمت فاهم فائدة مفيد فضاء
اقلام قدمت قديم قديمة قدرت قادر
قيمة قوية قامت قائم قصص قصة
قطعت قطعة طعام مطعم طائر طائرة طارت طيور
طريق طارق طينة طفلة طاقة طبقة
حبال حبيب حبيبة حبات حياة حيوان حديقة
حدود حديث حديد جديد جديدة حلوة حلمت احلام
حملت حامل حمار حماس حارس حروب حروف
حساب حسبت حصان
ربحت رابح ربيع رياح رمال رميت رامي
رئيس رسمت رسام رسوم رسمي رسالة رصيد
رضيت رجال رجلي ركضت ركبت ركوب
رقمي رقبة روضة رائع رائعة وردة ورود
ورقة وزير وزارة وصلت وعدت وجدت وجهة
ولدي ولادة والد والدة وقفت يومي
سنين شهور اسبوع ساعة ساعات مساء صباح
بداية بدأت بديل بعيد قريبة منزل منازل
مدينة مكان مساحة مسحت سكنت ساكن
سيارة سافر سفينة درست دروس دراسة
مدرس مدرسة مدارس نجاح نجحت خسارة خسرت
تجارة تاجر تجار متجر اسعار رخيص شراء
باعت بائع مالي نقود نقشت
هاتف جهاز شاشة شبكة صندوق صحيفة ابواب
بيتي بيتك بيوت بناء بنات ابناء ابني
اهلي انسان نساء نسمة نسيم نسيت
ذكرت ذاكر ذكرى زمان حاضر حضور ماضي
سابق لاحق جديد قديم ثاني ثانية ثالث رابع
خامس سادس سابع ثامن تاسع
واحد واحدة ثلاثة اربع خمسة سبعة ثمانية
تسعة عشرة شمال جنوب يمين يسار
جانب داخل خارج طويل طويلة قصير قصيرة
كبير كبيرة صغير صغيرة سريع سريعة بطيئة
قوية ضعيف ضعيفة صعبة سهلة
جميل جميلة نظيف نظيفة نظرت ناظر
واضح واضحة صحيح صحيحة
ممكن قادر اكيد افضل احسن
اكثر كثيرة قليل قليلة حقيقي حقيقة صادق
صالح صالحة فرحة سعيد سعيدة حزين حزينة
خافت امين امينة احلام محبوب حبيب
محبة ناجح نجاح
مريم مرمر مرير مرارة رمان رمانة مرام
قرار قليل قليلة قرارك مقرر تقرير تقارير
قلمك قلمنا مقال مقالة مرقم مرقمة
منزل منازل نملة نملية ارقام رقمية
ملامح ملامسة
`.trim().split(/\s+/u);

// كل خانة قد تحتوي حرفًا أو حرفين
function prepareGrid(parsed) {
  let grid = parsed.grid;
  let rows = Number(parsed.rows);
  let cols = Number(parsed.cols);

  if (!Array.isArray(grid)) {
    throw new Error('لم يتم التعرف على الشبكة');
  }

  if (Array.isArray(grid[0])) {
    rows = grid.length;
    cols = grid[0].length;

    if (
      grid.some(row =>
        !Array.isArray(row) ||
        row.length !== cols
      )
    ) {
      throw new Error('صفوف الشبكة غير متساوية');
    }

    grid = grid.flat();
  }

  if (!rows || !cols) {
    const size = Math.sqrt(grid.length);

    if (Number.isInteger(size)) {
      rows = size;
      cols = size;
    }
  }

  if (
    !Number.isInteger(rows) ||
    !Number.isInteger(cols) ||
    rows < 3 ||
    cols < 3 ||
    rows > 7 ||
    cols > 7 ||
    rows * cols !== grid.length
  ) {
    throw new Error('تعذر تحديد حجم الشبكة');
  }

  grid = grid.map(value =>
    String(value || '').trim()
  );

  if (
    grid.some(cell =>
      [...cell].length < 1 ||
      [...cell].length > 2 ||
      !/^[\u0621-\u064A]{1,2}$/u.test(cell)
    )
  ) {
    throw new Error(
      'بعض الخانات غير واضحة. جرّب صورة أقرب.'
    );
  }

  return {grid, rows, cols};
}

// التحقق من المسار الحقيقي
// الخانة المكونة من حرفين تُستخدم كوحدة واحدة
function pathExists(word, grid, rows, cols) {
  const target = normalize(word);

  if (
    [...target].length < 4 ||
    [...target].length > 6
  ) {
    return false;
  }

  const cells = grid.map(normalize);
  const used = new Set();

  function walk(position, offset) {
    if (offset === target.length) {
      return true;
    }

    for (let next = 0; next < cells.length; next++) {
      if (used.has(next)) continue;

      const cell = cells[next];

      if (!target.startsWith(cell, offset)) {
        continue;
      }

      if (position !== -1) {
        const row1 = Math.floor(position / cols);
        const col1 = position % cols;
        const row2 = Math.floor(next / cols);
        const col2 = next % cols;

        const dr = Math.abs(row1 - row2);
        const dc = Math.abs(col1 - col2);

        if (dr > 1 || dc > 1) {
          continue;
        }
      }

      used.add(next);

      if (
        walk(
          next,
          offset + cell.length
        )
      ) {
        return true;
      }

      used.delete(next);
    }

    return false;
  }

  return walk(-1, 0);
}

function parseAI(content) {
  try {
    return JSON.parse(content);
  } catch (_) {
    throw new Error(
      'لم تكتمل قراءة الصورة. حاول بصورة أوضح.'
    );
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
    const body = JSON.parse(event.body || '{}');
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
أنت متخصص في قراءة لعبة Wordbox العربية.

اقرأ شبكة الدوائر من الصورة بدقة.

قد تكون الشبكة:
4×4 أو 5×5 أو 4×6 أو 6×4
أو أي حجم مستطيل واضح.

عد الصفوف والأعمدة من الصورة نفسها.

انتبه جدًا:
بعض الدوائر تحتوي حرفين عربيين
مثل "نم" أو "لا".

هذه دائرة واحدة وليست دائرتين.

احفظ الحرفين بالترتيب الظاهر
داخل الخانة نفسها.

تجاهل أسماء اللاعبين والنصوص
والنتائج خارج الشبكة.

اقرأ كل صف من يسار الصورة
إلى يمينها، ثم انتقل للصف التالي.

أعد JSON فقط بهذه البنية:

{
  "rows": 5,
  "cols": 5,
  "grid": [
    ["ل","ق","ر","م","ل"],
    ["ا","ا","د","ا","ر"],
    ["ك","نم","ص","ي","ا"],
    ["ة","ل","ل","ف","م"],
    ["ث","ا","ن","ا","ض"]
  ],
  "words": ["كلمة"]
}

هذا المثال يوضح شكل البيانات فقط.
اقرأ الحروف الحقيقية من الصورة،
ولا تنسخ المثال إلا إذا كان مطابقًا لها.

بعد قراءة الشبكة:
اقترح حتى 30 كلمة عربية حقيقية
من 4 أو 5 أو 6 حروف فقط.

يجب أن تكون كل خانة متصلة
بالخانة التالية أفقيًا أو عموديًا
أو قطريًا.

إذا احتوت الخانة حرفين،
يجب استخدام الحرفين معًا
وبنفس الترتيب.

لا تستخدم الخانة مرتين في الكلمة.

لا تكتب مسارات ولا شرحًا.

أرجع JSON صالحًا فقط.
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
          max_tokens: 1500,
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
        'خدمة الصور أرجعت ردًا غير مكتمل'
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
    const {grid, rows, cols} = prepareGrid(parsed);

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
        !/^[\u0621-\u064A]{4,6}$/u.test(word) ||
        seen.has(key)
      ) {
        continue;
      }

      seen.add(key);

      if (
        pathExists(word, grid, rows, cols)
      ) {
        words.push({word});
      }
    }

    words.sort(
      (a, b) =>
        [...b.word].length -
        [...a.word].length ||
        a.word.localeCompare(b.word, 'ar')
    );

    return reply(200, {
      rows,
      cols,
      grid,
      words: words.slice(0, 10),
      note: 'تم التحقق من اتصال الخانات'
    });

  } catch (error) {
    return reply(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة التحليل. جرّب صورة أصغر.'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
