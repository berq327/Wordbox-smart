'use strict';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const reply = (statusCode, data) => ({
  statusCode,
  headers: HEADERS,
  body: JSON.stringify(data)
});

function normalize(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي');
}

// قائمة كلمات عربية شائعة وواضحة.
// لا نقبل اقتراحات الذكاء الاصطناعي العشوائية
// إلا إذا كانت موجودة في هذه القائمة.
const WORDS = `
سلام كلام كتاب كاتب مكتب مكتبة كلمة كلمات
ملك ملكة ملكي ملوك مالك ملكات
بلاد بلدي بلاط طالب طلبت طلاب
بطل بطلة طبلة طبول طيبة طبخة طباخ مطبخ
اكلت اكلة شربت شراب شارب
لبنة لباس لابس لحمة نهار بحار جبال جمال
جميل جميلة جملة نجمة نجوم
نبهت تنبه منبه نبات
ذهبت ذهبي بذرة ذنوب
خبير خبرة خدمت خادم خدمة خرجت خروج
دخلت دخول داخل مدخل خليط خلطة خلاص خالة
شامل شمال شمعة شموع شجرة
شاعر شعور شعاع شكرت شاكر شكور شرحت
شارع شرطة شريط
صبرت صابر صبور صامت ساكت سكوت صوتي
صورة صيام صائم صلاة صادق صديق صاحب صحبة
صدمة صنعت صانع صنعة
صغير صغيرة قصير قصيرة قصور
قمري قلبي قلبك قلوب قالت قائل مقال مقالة
قرار قرية قريب قريبة كريم كريمة
كبيرة كبرت كسرت كاسب كسبت
كتابي كتبت مكاتب
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
بداية بدأت بديل بعيد منزل منازل
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
نظيف نظيفة نظرت ناظر واضح واضحة
صحيح صحيحة ممكن قادر اكيد افضل احسن
اكثر كثيرة قليل قليلة حقيقي حقيقة
صالح صالحة فرحة سعيد سعيدة حزين حزينة
امين امينة احلام محبوب حبيب
محبة ناجح نجاح
مريم مرمر مرير مرارة رمان رمانة مرام
مقرر تقرير تقارير
قلمك قلمنا مرقم مرقمة
نملة ارقام رقمية ملامح
`.trim().split(/\s+/u);

const DICTIONARY = new Map();

for (const word of WORDS) {
  const key = normalize(word);

  if (key.length >= 4 && key.length <= 6) {
    if (!DICTIONARY.has(key)) {
      DICTIONARY.set(key, word);
    }
  }
}

// تجهيز الشبكة
function prepareGrid(parsed) {
  let grid = parsed.grid;
  let rows = Number(parsed.rows);
  let cols = Number(parsed.cols);

  if (!Array.isArray(grid) || !grid.length) {
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
      'بعض الحروف غير واضحة. جرّب صورة أقرب.'
    );
  }

  return { grid, rows, cols };
}

// بناء فهرس للكلمات حتى لا نبحث عشوائيًا
const PREFIXES = new Set();

for (const word of DICTIONARY.keys()) {
  for (let i = 1; i <= word.length; i++) {
    PREFIXES.add(word.slice(0, i));
  }
}

// استخراج الكلمات من المسارات الحقيقية فقط
function findWords(grid, rows, cols) {
  const cells = grid.map(normalize);
  const found = new Map();

  const neighbors = cells.map((_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const result = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        const nr = row + dr;
        const nc = col + dc;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols
        ) {
          result.push(nr * cols + nc);
        }
      }
    }

    return result;
  });

  function walk(index, text, used) {
    const current = text + cells[index];

    if (current.length > 6) return;
    if (!PREFIXES.has(current)) return;

    const word = DICTIONARY.get(current);

    if (word && current.length >= 4) {
      found.set(current, word);
    }

    for (const next of neighbors[index]) {
      const bit = 1n << BigInt(next);

      if ((used & bit) !== 0n) continue;

      walk(
        next,
        current,
        used | bit
      );
    }
  }

  for (let i = 0; i < cells.length; i++) {
    walk(
      i,
      '',
      1n << BigInt(i)
    );
  }

  return [...found.values()]
    .sort((a, b) =>
      b.length - a.length ||
      a.localeCompare(b, 'ar')
    )
    .slice(0, 10)
    .map(word => ({ word }));
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
      15000
    );

    const prompt = `
أنت متخصص في قراءة شبكة لعبة Wordbox العربية.

مهمتك الوحيدة هي استخراج الشبكة بدقة.

قد تكون الشبكة:
4×4 أو 5×5 أو 4×6 أو 6×4
أو شبكة مستطيلة أخرى.

اقرأ عدد الصفوف والأعمدة من الصورة.

تجاهل أسماء اللاعبين والنتائج
والوقت والنصوص خارج الشبكة.

اقرأ كل صف من يسار الصورة إلى يمينها.
ثم انتقل إلى الصف التالي.

بعض الدوائر تحتوي حرفين مثل:
"نم" أو "لا".

هذه دائرة واحدة وليست دائرتين.
احفظ محتواها كما يظهر.

لا تخمن الحروف غير الواضحة.
إذا لم تتمكن من قراءة خانة،
ضع علامة ? بدلًا من اختراع حرف.

أرجع JSON فقط بهذا الشكل:

{
  "grid": [
    ["ل","ق","ر","م","ل"],
    ["ا","ا","د","ا","ر"],
    ["ك","نم","ص","ي","ا"],
    ["ة","ل","ل","ف","م"],
    ["ث","ا","ن","ا","ض"]
  ]
}

المثال للتوضيح فقط.
لا تنسخه إذا كانت الصورة مختلفة.

لا تقترح كلمات.
لا تكتب أي شرح.
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
          max_tokens: 700,
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

    const api = await response.json();

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

    const parsed = JSON.parse(content);
    const { grid, rows, cols } = prepareGrid(parsed);

    const words = findWords(grid, rows, cols);

    return reply(200, {
      rows,
      cols,
      grid,
      words,
      note: 'الكلمات مأخوذة من القاموس وتم التحقق من مساراتها'
    });

  } catch (error) {
    return reply(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة التحليل. جرّب صورة أوضح.'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
