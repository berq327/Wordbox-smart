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

const COMMON_WORDS = `
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
عامل عمال عمالة عملت عملنا
رمال رمان مران مرام
عمران عنوان عناوين
منار منارة منير منيرة
نوران نوراني نورنا
تنور تنورت تنوير
نورت نيران ناري
توتة توتيا
ترانيم ترنيم ترنم
رتبت ترتيب رتبنا
مررت مرور مرارة
امور امارة امارات
تمرين تمرينك
تمرنا تمرين
رنتي رنات
مروان مريم
لامع لامعة
لماع لمعت
عالم عالمية
اعلام اعلامي
معلوم معلومة
نعمة نعيم
مناعة مانع
`.trim().split(/\s+/u);

const COMMON = new Map();

for (const word of COMMON_WORDS) {
  const key = normalize(word);

  if (key.length >= 4 && key.length <= 6) {
    if (!COMMON.has(key)) {
      COMMON.set(key, word);
    }
  }
}

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
      'بعض الحروف غير واضحة. حاول رفع صورة أوضح.'
    );
  }

  return { grid, rows, cols };
}

function buildNeighbors(rows, cols) {
  const neighbors = [];

  for (let i = 0; i < rows * cols; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const list = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;

        const nr = row + dr;
        const nc = col + dc;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols
        ) {
          list.push(nr * cols + nc);
        }
      }
    }

    neighbors.push(list);
  }

  return neighbors;
}

function findPath(word, cells, neighbors) {
  const target = normalize(word);

  if (target.length < 4 || target.length > 6) {
    return null;
  }

  function walk(index, offset, used, path) {
    const cell = cells[index];

    if (!target.startsWith(cell, offset)) {
      return null;
    }

    const nextOffset = offset + cell.length;
    const nextPath = [...path, index];

    if (nextOffset === target.length) {
      return nextPath;
    }

    for (const next of neighbors[index]) {
      const bit = 1n << BigInt(next);

      if ((used & bit) !== 0n) {
        continue;
      }

      const result = walk(
        next,
        nextOffset,
        used | bit,
        nextPath
      );

      if (result) return result;
    }

    return null;
  }

  for (let i = 0; i < cells.length; i++) {
    const result = walk(
      i,
      0,
      1n << BigInt(i),
      []
    );

    if (result) return result;
  }

  return null;
}

function getCommonCandidates(grid, rows, cols) {
  const cells = grid.map(normalize);
  const neighbors = buildNeighbors(rows, cols);
  const found = [];

  for (const word of COMMON.values()) {
    const path = findPath(word, cells, neighbors);

    if (path) {
      found.push({ word, path, source: 'common' });
    }
  }

  return found;
}

function validateCandidates(
  candidates,
  grid,
  rows,
  cols
) {
  const cells = grid.map(normalize);
  const neighbors = buildNeighbors(rows, cols);
  const seen = new Set();
  const valid = [];

  for (const item of candidates) {
    const word = String(
      typeof item === 'string'
        ? item
        : item?.word || ''
    ).trim();

    const key = normalize(word);

    if (
      !/^[\u0621-\u064A]{4,6}$/u.test(word) ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    const path = findPath(
      word,
      cells,
      neighbors
    );

    if (!path) continue;

    valid.push({
      word,
      path,
      source: COMMON.has(key)
        ? 'common'
        : 'ai'
    });
  }

  return valid;
}

async function askOpenAI(messages, signal, maxTokens) {
  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      signal,
      headers: {
        Authorization:
          `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        temperature: 0,
        max_tokens: maxTokens,
        response_format: {
          type: 'json_object'
        },
        messages
      })
    }
  );

  const raw = await response.text();

  let api;

  try {
    api = JSON.parse(raw);
  } catch (_) {
    throw new Error('رد خدمة الذكاء الاصطناعي غير مكتمل');
  }

  if (!response.ok) {
    throw new Error(
      api.error?.message ||
      'تعذر الاتصال بخدمة التحليل'
    );
  }

  const choice = api.choices?.[0];

  if (choice?.finish_reason === 'length') {
    throw new Error(
      'نتيجة التحليل طويلة ولم تكتمل. حاول مرة أخرى.'
    );
  }

  const content = choice?.message?.content;

  if (!content) {
    throw new Error('لم تصل نتيجة التحليل');
  }

  try {
    return JSON.parse(content);
  } catch (_) {
    throw new Error('تعذر قراءة نتيجة التحليل');
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
      25000
    );

    const visionPrompt = `
أنت متخصص في قراءة لعبة Wordbox العربية.

اقرأ شبكة الحروف من الصورة بدقة شديدة.

الشبكة قد تكون:
4×4
5×5
4×6
6×4
أو أي شبكة مستطيلة أخرى.

لا تفترض حجم الشبكة مسبقًا.

عد الصفوف والأعمدة من الصورة.

اقرأ كل صف من يسار الصورة إلى يمينها،
ثم انتقل للصف التالي من الأعلى للأسفل.

كل دائرة تمثل خانة واحدة.

بعض الخانات تحتوي حرفين مثل:
"نم" أو "لا".

احفظ الحرفين معًا وبترتيبهما الصحيح.

تجاهل:
أسماء اللاعبين،
الوقت،
النتائج،
عنوان الجولة،
وأزرار اللعبة.

لا تخترع أي حرف.

إذا كان حرف غير واضح، استخدم "?".

أرجع JSON فقط بالشكل التالي:

{
  "grid": [
    ["ل","ق","ر","م","ل"],
    ["ا","ا","د","ا","ر"],
    ["ك","نم","ص","ي","ا"],
    ["ة","ل","ل","ف","م"],
    ["ث","ا","ن","ا","ض"]
  ]
}

هذا مثال لشكل البيانات فقط.
لا تنسخ حروفه إلا إذا طابقت الصورة.

لا تقترح كلمات الآن.
`;

    const parsed = await askOpenAI(
      [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: visionPrompt
          },
          {
            type: 'image_url',
            image_url: {
              url: image,
              detail: 'high'
            }
          }
        ]
      }],
      controller.signal,
      850
    );

    const { grid, rows, cols } = prepareGrid(parsed);

    const commonCandidates = getCommonCandidates(
      grid,
      rows,
      cols
    );

    const discoveryPrompt = `
أنت خبير في الكلمات العربية ولعبة Wordbox.

هذه شبكة الحروف الفعلية:

${JSON.stringify(grid)}

عدد الصفوف: ${rows}
عدد الأعمدة: ${cols}

مهم:
الصفوف مرتبة من أعلى إلى أسفل.
والأعمدة مرتبة من يسار الصورة إلى يمينها.

كل خانة يمكن استخدامها مرة واحدة فقط
في الكلمة الواحدة.

يسمح بالانتقال بين الخانات المتجاورة:
أفقيًا أو عموديًا أو قطريًا.

إذا احتوت الخانة حرفين مثل "نم"،
يجب استخدامهما معًا وبنفس الترتيب.

ابحث عن أكبر عدد ممكن من الكلمات
العربية الحقيقية والمفهومة.

الأطوال المسموحة:
4 أو 5 أو 6 حروف فقط.

ابحث عن:
الأسماء الشائعة،
الأفعال الصحيحة،
الصفات،
جموع الكلمات،
والكلمات المستخدمة في العربية.

لا تستخدم أسماء أشخاص نادرة.
لا تخترع كلمات.
لا تستخدم حروفًا غير موجودة.

اقترح حتى 60 كلمة محتملة.

لا تقلق بشأن التحقق النهائي من المسار،
لأن البرنامج سيفحص كل كلمة بنفسه.

أرجع JSON فقط:

{
  "words": ["كلمة", "كلمة"]
}
`;

    let aiCandidates = [];

    try {
      const discovery = await askOpenAI(
        [{
          role: 'user',
          content: discoveryPrompt
        }],
        controller.signal,
        1700
      );

      if (Array.isArray(discovery.words)) {
        aiCandidates = discovery.words;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
    }

    const allCandidates = [
      ...commonCandidates,
      ...aiCandidates
    ];

    const valid = validateCandidates(
      allCandidates,
      grid,
      rows,
      cols
    );

    const common = valid.filter(
      item => item.source === 'common'
    );

    const aiOnly = valid.filter(
      item => item.source === 'ai'
    );

    let approvedAI = [];

    if (aiOnly.length) {
      try {
        const reviewPrompt = `
أنت مدقق لغوي عربي صارم.

افحص الكلمات التالية:

${JSON.stringify(aiOnly.map(x => x.word))}

المسارات تم التحقق منها برمجيًا،
لذلك لا تحتاج إلى فحص اتصال الحروف.

مهمتك هي التحقق من صحة الكلمات لغويًا.

اقبل فقط الكلمات العربية الحقيقية
الواضحة والمستخدمة.

اقبل الأسماء والأفعال والصفات
والجموع والتصريفات العربية الصحيحة.

ارفض:
الكلمات المخترعة،
الحروف المركبة بلا معنى،
الأخطاء الإملائية،
والكلمات المشكوك فيها.

إذا لم تكن متأكدًا من كلمة، ارفضها.

أرجع JSON فقط:

{
  "approved": ["كلمة"]
}
`;

        const reviewed = await askOpenAI(
          [{
            role: 'user',
            content: reviewPrompt
          }],
          controller.signal,
          1000
        );

        const approvedSet = new Set(
          (Array.isArray(reviewed.approved)
            ? reviewed.approved
            : []
          ).map(normalize)
        );

        approvedAI = aiOnly.filter(
          item => approvedSet.has(
            normalize(item.word)
          )
        );
      } catch (error) {
        if (error.name === 'AbortError') {
          throw error;
        }
      }
    }

    const combined = [
      ...common,
      ...approvedAI
    ];

    const unique = new Map();

    for (const item of combined) {
      const key = normalize(item.word);

      if (!unique.has(key)) {
        unique.set(key, item);
      }
    }

    const sorted = [...unique.values()].sort(
      (a, b) => {
        const sourceA = a.source === 'common' ? 1 : 0;
        const sourceB = b.source === 'common' ? 1 : 0;

        return (
          sourceB - sourceA ||
          b.word.length - a.word.length ||
          a.word.localeCompare(b.word, 'ar')
        );
      }
    );

    const words = sorted
      .slice(0, 10)
      .map(item => ({
        word: item.word,
        path: item.path
      }));

    return reply(200, {
      rows,
      cols,
      grid,
      words,
      note:
        'تم فحص مسارات الكلمات ومراجعة الكلمات الجديدة لغويًا'
    });

  } catch (error) {
    return reply(
      error.name === 'AbortError' ? 504 : 422,
      {
        error:
          error.name === 'AbortError'
            ? 'انتهت مهلة التحليل. جرّب صورة أوضح أو أصغر.'
            : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
