
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

// نفس القاموس المساعد للكلمات
const DICTIONARY = `
سلام كلام كتاب كاتب مكتب مكتبة كلمة كلمات
ملك ملكة ملكي ملوك مالك ملكات
بلاد بلدي بلاط طالب طلبت طلاب
بطل بطلة طبلة طبول
طيبة طبخة طباخ مطبخ
اكلت اكلة شربت شراب شارب
لبنة لباس لابس لحمة
نهار بحار جبال جمال
جميل جميلة جملة نجمة نجوم
نبهت تنبه منبه نبذل نبات
ذهبت ذهبي بذرة ذنوب
خبير خبرة خمنت
خدمت خادم خدمة خرجت خروج
دخلت دخول داخل مدخل
خليط خلطة خلاص خالة
شتمت شتمه شامل شمال
شمعة شموع شجرة
شاعر شعور شعاع
شكرت شاكر شكور شرحت
شارع شرطة شريط
صبرت صابر صبور صامت
سكتت ساكت سكوت صوتي
صورة صيام صائم صلاة
صادق صديق صاحب صحبة
صدمة صنعت صانع صنعة
صغير صغيرة قصير قصيرة قصور
قمري قلبي قلبك قلوب
قالت قائل مقال مقالة
قرار قرية قريب قريبة كريم كريمة
كبيرة كبرت كسرت كاسب كسبت
كلام كتابي كاتب كتبت مكاتب
كلبة كلاب كرات كرسي
ليلة ليالي لوني لونك
لعبة لعبت لاعب ملعب
ملابس علوم علامة معلم معلمة
تعلم تعلمت تعليم عملي عامل
عمال عميل عمري عمارة
عنبة عيني عينك عيوب
عائلة عادل عدالة عادي عادة
عادت عودة عداد
عذاب علاج عظيم عظام
غالي غالية غريب غريبة غربة
غزال غابة غيمة غياب غائب
غناء غسلت
فازت فائز فكرة
فتحت فاتح فتاة
فقير فقيرة فرحت فرحة
فرصة فرص فرض فصول
فعلت فهمت فاهم
فائدة مفيد فضاء
اقلام قدمت قديم قديمة قدرت قادر
قيمة قوية قامت قائم قصص قصة
قطعت قطعة طعام مطعم
طائر طائرة طارت طيور
طريق طارق طينة
طفلة طاقة طبقة
حبال حبيب حبيبة
حبات حياة حيوان حديقة
حدود حديث حديد جديد جديدة
حلوة حلمت احلام
حملت حامل حمار حماس
حارس حروب حروف
حساب حسبت حصان
ربحت رابح ربيع رياح
رمال رميت رامي
رئيس رسمت رسام
رسوم رسمي رسالة رصيد
رضيت رجال رجلي
ركضت ركبت ركوب
رقمي رقبة روضة
رائع رائعة وردة ورود
ورقة وزير وزارة
وصلت وعدت وجدت وجهة
ولدي ولادة والد والدة
وقفت يومي
سنين شهور اسبوع
ساعة ساعات مساء صباح
بداية بدأت بديل بعيد
قريبة منزل منازل
مدينة مكان مساحة
مسحت سكنت ساكن
سيارة سافر سفينة
درست دروس دراسة
مدرس مدرسة مدارس نجاح نجحت
خسارة خسرت
تجارة تاجر تجار متجر
اسعار رخيص شراء
باعت بائع مالي
نقود نقشت
هاتف جهاز شاشة شبكة
صندوق صحيفة ابواب
بيتي بيتك بيوت بناء
بنات ابناء ابني
اهلي انسان نساء
نسمة نسيم نسيت
ذكرت ذاكر ذكرى
زمان حاضر حضور ماضي
سابق لاحق جديد قديم
ثاني ثانية ثالث رابع
خامس سادس سابع ثامن تاسع
واحد واحدة ثلاثة اربع خمسة
سبعة ثمانية تسعة عشرة
شمال جنوب يمين يسار
جانب داخل خارج
طويل طويلة قصير قصيرة
كبير كبيرة صغير صغيرة
سريع سريعة بطيئة
قوية ضعيف ضعيفة
صعبة سهلة
جميل جميلة نظيف نظيفة
نظرت ناظر واضح واضحة
صحيح صحيحة
ممكن قادر اكيد افضل احسن
اكثر كثيرة قليل قليلة
حقيقي حقيقة صادق
صالح صالحة فرحة
سعيد سعيدة حزين حزينة
خافت امين امينة
احلام محبوب حبيب
محبة ناجح نجاح
مريم مرمر مرير مرارة
رمان رمانة مرام قرار
قليل قليلة قرارك
مقرر تقرير تقارير
قلمك قلمنا
مقال مقالة
مرقم مرقمة
منزل منازل
نملة نملية
قرمل قرملة
ارقام رقمية
ملامح ملامسة
`.trim().split(/\s+/u);

// فحص أي شبكة مستطيلة
// 4×4 أو 5×5 أو 4×6 أو 6×4
function pathExists(word, grid, rows, cols) {
  const chars = [...normalize(word)];

  if (chars.length < 4 || chars.length > 6) {
    return false;
  }

  const cells = grid.map(normalize);

  function walk(position, index, used) {
    if (index === chars.length) {
      return true;
    }

    for (let next = 0; next < cells.length; next++) {
      if (used.has(next)) continue;
      if (cells[next] !== chars[index]) continue;

      if (position !== -1) {
        const row1 = Math.floor(position / cols);
        const col1 = position % cols;
        const row2 = Math.floor(next / cols);
        const col2 = next % cols;

        if (
          Math.abs(row1 - row2) > 1 ||
          Math.abs(col1 - col2) > 1
        ) {
          continue;
        }
      }

      used.add(next);

      if (walk(next, index + 1, used)) {
        return true;
      }

      used.delete(next);
    }

    return false;
  }

  return walk(-1, 0, new Set());
}

// استخراج JSON حتى لو كان الرد ناقصًا
function parseAI(content) {
  try {
    return JSON.parse(content);
  } catch (_) {
    const gridMatch = content.match(
      /"grid"\s*:\s*(\[[\s\S]*?\])\s*,?\s*"/
    );

    if (!gridMatch) {
      throw new Error(
        'لم تكتمل قراءة الشبكة. جرّب صورة أوضح.'
      );
    }

    const grid = JSON.parse(gridMatch[1]);

    const rowsMatch = content.match(
      /"rows"\s*:\s*(\d+)/
    );

    const colsMatch = content.match(
      /"cols"\s*:\s*(\d+)/
    );

    const wordSection = content.match(
      /"words"\s*:\s*\[([\s\S]*)/
    );

    const words = wordSection
      ? [...wordSection[1].matchAll(
          /"([\u0621-\u064A]{4,6})"/gu
        )].map(match => match[1])
      : [];

    return {
      grid,
      rows: rowsMatch ? Number(rowsMatch[1]) : null,
      cols: colsMatch ? Number(colsMatch[1]) : null,
      words
    };
  }
}

// تحويل صفوف الحروف إلى شبكة واحدة
function prepareGrid(parsed) {
  let rows = Number(parsed.rows);
  let cols = Number(parsed.cols);
  let grid = parsed.grid;

  if (!Array.isArray(grid)) {
    throw new Error('لم أتمكن من قراءة شبكة الحروف');
  }

  // يدعم grid كصفوف متداخلة
  if (Array.isArray(grid[0])) {
    rows = grid.length;
    cols = grid[0].length;

    if (
      grid.some(
        row =>
          !Array.isArray(row) ||
          row.length !== cols
      )
    ) {
      throw new Error('صفوف الشبكة غير متساوية');
    }

    grid = grid.flat();
  }

  // استنتاج الحجم للشبكات المربعة
  if (
    (!rows || !cols) &&
    Number.isInteger(Math.sqrt(grid.length))
  ) {
    rows = Math.sqrt(grid.length);
    cols = rows;
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
    throw new Error(
      'تعذر تحديد حجم الشبكة. جرّب صورة أقرب.'
    );
  }

  grid = grid.map(
    value => String(value || '').trim()
  );

  if (
    grid.some(
      letter =>
        [...letter].length !== 1 ||
        !/^[\u0621-\u064A]$/u.test(letter)
    )
  ) {
    throw new Error(
      'بعض الحروف غير واضحة. حاول تصوير الشبكة مباشرة.'
    );
  }

  return {grid, rows, cols};
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
        error: 'الصورة غير صالحة أو حجمها كبير'
      });
    }

    const controller = new AbortController();

    timer = setTimeout(
      () => controller.abort(),
      10000
    );

    const prompt = `
أنت محلل صور متخصص في لعبة Wordbox العربية.

اقرأ الصورة جيدًا، حتى لو كانت:
- لقطة شاشة مباشرة
- صورة لشاشة هاتف آخر
- مائلة أو تحتوي على انعكاسات
- شبكة سهلة أو صعبة

ابحث عن شبكة الدوائر البيضاء المتصلة بخطوط.

مهم جدًا:
لا تفترض أن الشبكة 4×4 دائمًا.

قد تكون:
4 صفوف × 4 أعمدة = 16 حرفًا
5 صفوف × 5 أعمدة = 25 حرفًا
4 صفوف × 6 أعمدة = 24 حرفًا
6 صفوف × 4 أعمدة = 24 حرفًا

أو حجمًا مستطيلًا آخر واضحًا.

عد الصفوف والأعمدة من الصورة نفسها.

كل دائرة تمثل حرفًا واحدًا.

تجاهل:
أسماء اللاعبين، النتائج، المؤقت،
عنوان الجولة، وأزرار اللعبة.

اقرأ الصفوف من أعلى إلى أسفل،
وكل صف من يسار الصورة إلى يمينها.

أرجع JSON فقط بهذه البنية:

{
  "rows": 5,
  "cols": 5,
  "grid": [
    ["ح","ر","ف","ح","ر"],
    ["ح","ر","ف","ح","ر"],
    ["ح","ر","ف","ح","ر"],
    ["ح","ر","ف","ح","ر"],
    ["ح","ر","ف","ح","ر"]
  ],
  "words": ["كلمة"]
}

الأحرف والكلمات في المثال توضيحية فقط.
استخدم الحروف الفعلية التي تراها بالصورة.

بعد استخراج الشبكة:
اقترح حتى 30 كلمة عربية حقيقية
من 4 أو 5 أو 6 حروف فقط.

يجب أن تكون الحروف متجاورة
أفقيًا أو رأسيًا أو قطريًا.

لا تستخدم نفس الدائرة مرتين
داخل الكلمة الواحدة.

اقترح أسماء وأفعالًا وصفات.
لا تكتب كلمات عشوائية بلا معنى.

أهم شيء:
عدد الصفوف والأعمدة ودقة الحروف.

لا تكتب شرحًا، فقط JSON.
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
          max_tokens: 1400,
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

      if (pathExists(word, grid, rows, cols)) {
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
      note: 'تم التحقق من اتصال حروف الكلمات'
    });

  } catch (error) {
    return reply(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة التحليل. حاول بصورة أوضح أو أصغر.'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
