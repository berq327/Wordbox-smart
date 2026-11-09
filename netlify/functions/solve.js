
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
    .replace(/[\u064B-\u065F\u0670\u0640\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي');
}

const DICTIONARY_TEXT = `
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
عمران عنوان عناوين
منار منارة منير منيرة
نوران نوراني نورنا
تنور تنورت تنوير نورت نيران
ترانيم ترنيم ترنم
رتبت ترتيب رتبنا
مررت مرور
امور امارة امارات
تمرين تمرنا
مروان لامع لامعة لمعت
عالم عالمية اعلام اعلامي
معلوم معلومة نعمة نعيم
مناعة مانع
لعبة لعبنا لعبوا
قمر قمار قمرية
رمان رمانة
رمال رملية
قليل قليلة
نور نوران نوري
عمر عمري عمرنا
تمر تمرة تمور
ثمن ثمنه ثمرة ثمار
ثمار ثمارها
تاجر تجارة تجار
تنمر تنمرت
توبة تائب تابت
تونا نونة
ولدت ولادة
اولاد والد والدة
رجل رجال رجولة
امرأة امراة
انسان انسانة
نائم نائمة نومي
نملة نملة
عاقل عاقلة
عالم علامة
الوان لوان
`.trim().split(/\s+/u);

const DICTIONARY = new Map();

for (const word of DICTIONARY_TEXT) {
  const key = normalize(word);

  if (key.length >= 4 && key.length <= 6) {
    if (!DICTIONARY.has(key)) {
      DICTIONARY.set(key, word);
    }
  }
}

const PREFIXES = new Set();

for (const word of DICTIONARY.keys()) {
  for (let i = 1; i <= word.length; i++) {
    PREFIXES.add(word.slice(0, i));
  }
}

function prepareGrid(input) {
  let grid = input.grid;
  let rows = Number(input.rows);
  let cols = Number(input.cols);

  if (!Array.isArray(grid) || !grid.length) {
    throw new Error('لم يتم التعرف على الحروف');
  }

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
    throw new Error('حجم الشبكة غير صحيح');
  }

  grid = grid.map(
    value => String(value || '').trim()
  );

  if (
    grid.some(
      cell =>
        [...cell].length < 1 ||
        [...cell].length > 2 ||
        !/^[\u0621-\u064A]{1,2}$/u.test(cell)
    )
  ) {
    throw new Error(
      'بعض الحروف غير واضحة. جرّب صورة أقرب.'
    );
  }

  return {grid, rows, cols};
}

function buildNeighbors(rows, cols) {
  return Array.from(
    {length: rows * cols},
    (_, index) => {
      const r = Math.floor(index / cols);
      const c = index % cols;
      const list = [];

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;

          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 && nr < rows &&
            nc >= 0 && nc < cols
          ) {
            list.push(nr * cols + nc);
          }
        }
      }

      return list;
    }
  );
}

function findPath(word, cells, neighbors) {
  const target = normalize(word);

  if (target.length < 4 || target.length > 6) {
    return null;
  }

  const path = [];
  const used = new Set();

  function walk(index, offset) {
    const cell = cells[index];

    if (!target.startsWith(cell, offset)) {
      return false;
    }

    used.add(index);
    path.push(index);

    const nextOffset = offset + cell.length;

    if (nextOffset === target.length) {
      return true;
    }

    for (const next of neighbors[index]) {
      if (used.has(next)) continue;

      if (walk(next, nextOffset)) {
        return true;
      }
    }

    used.delete(index);
    path.pop();
    return false;
  }

  for (let i = 0; i < cells.length; i++) {
    used.clear();
    path.length = 0;

    if (walk(i, 0)) {
      return [...path];
    }
  }

  return null;
}

function getDictionaryWords(grid, rows, cols) {
  const cells = grid.map(normalize);
  const neighbors = buildNeighbors(rows, cols);
  const found = new Map();

  function walk(index, text, used, path) {
    const current = text + cells[index];

    if (current.length > 6) return;
    if (!PREFIXES.has(current)) return;

    const word = DICTIONARY.get(current);

    if (word && !found.has(current)) {
      found.set(current, {
        word,
        path: [...path, index],
        source: 'dictionary'
      });
    }

    for (const next of neighbors[index]) {
      if (used.has(next)) continue;

      used.add(next);
      walk(
        next,
        current,
        used,
        [...path, index]
      );
      used.delete(next);
    }
  }

  for (let i = 0; i < cells.length; i++) {
    walk(i, '', new Set([i]), []);
  }

  return [...found.values()];
}

function validateAIWords(words, grid, rows, cols) {
  const cells = grid.map(normalize);
  const neighbors = buildNeighbors(rows, cols);
  const found = new Map();

  for (const item of words) {
    const word = String(
      typeof item === 'string'
        ? item
        : item?.word || ''
    ).trim();

    const key = normalize(word);

    if (!/^[\u0621-\u064A]{4,6}$/u.test(word)) {
      continue;
    }

    if (found.has(key)) continue;

    const path = findPath(
      word,
      cells,
      neighbors
    );

    if (!path) continue;

    found.set(key, {
      word,
      path,
      source: 'ai'
    });
  }

  return [...found.values()];
}

async function askAI(messages, signal, maxTokens) {
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
    throw new Error('رد خدمة التحليل غير مكتمل');
  }

  if (!response.ok) {
    throw new Error(
      api.error?.message ||
      'فشل الاتصال بخدمة التحليل'
    );
  }

  const choice = api.choices?.[0];

  if (choice?.finish_reason === 'length') {
    throw new Error(
      'نتيجة التحليل لم تكتمل. جرّب مرة أخرى.'
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
    const hasGrid = Array.isArray(body.grid);

    if (!hasGrid) {
      if (
        typeof image !== 'string' ||
        !/^data:image\/(png|jpeg|webp);base64,/i.test(image) ||
        image.length > 7500000
      ) {
        return reply(400, {
          error: 'ارفع صورة صالحة أولًا'
        });
      }
    }

    const controller = new AbortController();

    timer = setTimeout(
      () => controller.abort(),
      25000
    );

    let parsed;

    if (hasGrid) {
      // زر كلمات جديدة لا يحتاج إعادة قراءة الصورة
      parsed = body;
    } else {
      const visionPrompt = `
اقرأ شبكة لعبة Wordbox العربية من الصورة.

حدد عدد الصفوف والأعمدة الحقيقي.

قد تكون الشبكة:
4×4 أو 5×5 أو 4×6 أو 6×4
أو أي شبكة مستطيلة واضحة.

كل دائرة تمثل خانة واحدة.

بعض الخانات تحتوي حرفين مثل:
"نم" أو "لا".

احتفظ بمحتوى الخانة كاملًا
وبالترتيب الصحيح.

تجاهل أسماء اللاعبين والنتائج
والوقت والنصوص خارج الشبكة.

اقرأ كل صف من يسار الصورة
إلى يمينها، ثم من أعلى إلى أسفل.

لا تخمن الحروف غير الواضحة.

أرجع JSON فقط بهذه البنية:

{
  "grid": [
    ["ل","ق","ر","م","ل"],
    ["ا","ا","د","ا","ر"],
    ["ك","نم","ص","ي","ا"],
    ["ة","ل","ل","ف","م"],
    ["ث","ا","ن","ا","ض"]
  ]
}

هذا مثال لشكل البيانات وليس إجابة.
استخدم الحروف الموجودة في الصورة فقط.
`;

      parsed = await askAI(
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
        900
      );
    }

    const {grid, rows, cols} = prepareGrid(parsed);

    // الكلمات التي ظهرت سابقًا
    const excluded = new Set(
      (Array.isArray(body.exclude)
        ? body.exclude.slice(0, 500)
        : []
      ).map(normalize)
    );

    // البحث المحلي عن الكلمات ذات المسار الصحيح
    const dictionaryWords = getDictionaryWords(
      grid,
      rows,
      cols
    );

    const availableDictionary = dictionaryWords
      .filter(
        item => !excluded.has(normalize(item.word))
      );

    let aiWords = [];

    // إذا القاموس ما يكفي، نطلب كلمات إضافية
    if (availableDictionary.length < 10) {
      const discoveryPrompt = `
أنت متخصص في المفردات العربية.

هذه شبكة لعبة Wordbox:

${JSON.stringify(grid)}

الصفوف: ${rows}
الأعمدة: ${cols}

الصفوف مرتبة من أعلى إلى أسفل،
والأعمدة من يسار الصورة إلى يمينها.

ابحث عن كلمات عربية حقيقية
من 4 أو 5 أو 6 حروف فقط.

يمكن الانتقال إلى الخانة المجاورة
أفقيًا أو رأسيًا أو قطريًا.

لا يمكن استعمال الخانة مرتين.

الخانة التي تحتوي حرفين
يجب استخدامهما معًا وبترتيبهما.

هذه كلمات سبق عرضها:
${JSON.stringify([...excluded])}

وهذه كلمات معروفة وجدناها بالفعل:
${JSON.stringify(
  dictionaryWords.map(x => x.word)
)}

لا تكرر الكلمات السابقة.

اقترح كلمات إضافية مختلفة
من الأسماء والأفعال والصفات
والجمع والتصريفات الشائعة.

ارفض الكلمات المخترعة
والأسماء النادرة والمشكوك فيها.

لا تضع كلمة إلا إذا كنت واثقًا
أنها كلمة عربية صحيحة.

حاول اقتراح حتى 40 كلمة.

سيتم فحص المسارات برمجيًا،
لذلك لا تخترع حروفًا.

أرجع JSON فقط:

{
  "words": ["كلمة"]
}
`;

      try {
        const discovery = await askAI(
          [{
            role: 'user',
            content: discoveryPrompt
          }],
          controller.signal,
          1400
        );

        if (Array.isArray(discovery.words)) {
          aiWords = validateAIWords(
            discovery.words,
            grid,
            rows,
            cols
          );
        }
      } catch (error) {
        // إذا فشل اكتشاف الكلمات الإضافية
        // نعرض الكلمات الموثوقة من القاموس
        if (error.name === 'AbortError') {
          throw error;
        }
      }
    }

    // مراجعة لغوية إضافية للكلمات غير الموجودة بالقاموس
    const unverified = aiWords.filter(
      item => !DICTIONARY.has(normalize(item.word))
    );

    let approvedAI = [];

    if (unverified.length) {
      try {
        const review = await askAI(
          [{
            role: 'user',
            content: `
أنت مدقق لغوي عربي صارم.

افحص الكلمات التالية:

${JSON.stringify(
  unverified.map(x => x.word)
)}

اقبل الكلمات العربية الحقيقية
والواضحة والمستخدمة فقط.

ارفض الكلمات المختلقة
والأخطاء الإملائية
والأسماء الغريبة والمشكوك فيها.

إذا لم تكن متأكدًا، ارفض الكلمة.

أرجع JSON فقط:

{"approved":[]}
`
          }],
          controller.signal,
          650
        );

        const approved = new Set(
          (Array.isArray(review.approved)
            ? review.approved
            : []
          ).map(normalize)
        );

        approvedAI = unverified.filter(
          item => approved.has(normalize(item.word))
        );
      } catch (error) {
        if (error.name === 'AbortError') {
          throw error;
        }
      }
    }

    const combined = [
      ...availableDictionary,
      ...approvedAI
    ];

    const unique = new Map();

    for (const item of combined) {
      const key = normalize(item.word);

      if (excluded.has(key)) continue;
      if (unique.has(key)) continue;

      unique.set(key, item);
    }

    const sorted = [...unique.values()].sort(
      (a, b) =>
        b.word.length - a.word.length ||
        a.word.localeCompare(b.word, 'ar')
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
      exhausted: words.length === 0,
      note: 'تم استبعاد الكلمات السابقة وفحص مسارات الكلمات الجديدة'
    });

  } catch (error) {
    return reply(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة البحث. جرّب مرة ثانية.'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
