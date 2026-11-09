
'use strict';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
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

// فحص مسار الكلمة داخل شبكة 4×4
function findPath(word, grid) {
  const letters = [...normalize(word)];

  if (letters.length < 4 || letters.length > 5) {
    return null;
  }

  const cells = grid.map(normalize);

  function walk(position, used, path) {
    if (path.length === letters.length) {
      return path;
    }

    for (let i = 0; i < 16; i++) {
      if (
        (used & (1 << i)) ||
        cells[i] !== letters[path.length]
      ) {
        continue;
      }

      if (position !== -1) {
        const rowGap = Math.abs(
          Math.floor(i / 4) -
          Math.floor(position / 4)
        );

        const colGap = Math.abs(
          (i % 4) - (position % 4)
        );

        if (rowGap > 1 || colGap > 1) {
          continue;
        }
      }

      const result = walk(
        i,
        used | (1 << i),
        [...path, i]
      );

      if (result) return result;
    }

    return null;
  }

  return walk(-1, 0, []);
}

exports.handler = async (event) => {
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
      error: 'OPENAI_API_KEY غير موجود في Netlify'
    });
  }

  let timeout;

  try {
    let body;

    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return reply(400, {
        error: 'طلب الصورة غير صالح'
      });
    }

    const image = body.image;

    if (
      typeof image !== 'string' ||
      !/^data:image\/(png|jpeg|webp);base64,/i.test(image) ||
      image.length > 7500000
    ) {
      return reply(400, {
        error: 'ارفع صورة واضحة وحجمها أصغر'
      });
    }

    const controller = new AbortController();

    // مهلة 10 ثوانٍ
    timeout = setTimeout(
      () => controller.abort(),
      10000
    );

    // الذكاء الاصطناعي يحلل الصورة بنفسه
    // بدون قاموس أو كلمات محددة مسبقًا
    const prompt = `
أنت تحل لعبة Wordbox العربية من صورة.

انظر إلى شبكة الدوائر 4×4 بنفسك.

أولًا:
اقرأ الحروف الـ16 الموجودة داخل الدوائر
بدقة، صفًا صفًا من يسار الصورة إلى
يمينها، ومن الأعلى إلى الأسفل.

تجاهل أسماء اللاعبين والنصوص
الموجودة خارج شبكة الحروف.

ثانيًا:
انطلاقًا من الحروف التي قرأتها فقط،
فكّر بنفسك في 15 إلى 22 كلمة عربية
حقيقية مختلفة من 4 أو 5 حروف.

لا تستخدم أي قائمة كلمات مقدمة مسبقًا.

افحص اتصال الحروف:
أفقي أو رأسي أو قطري.

لا تستخدم الخانة نفسها مرتين
داخل الكلمة الواحدة.

حاول إيجاد الكلمات الصعبة أيضًا،
ولا تخترع حروفًا غير موجودة.

ثالثًا:
حدد مراكز دوائر أقصى اليسار واليمين
والأعلى والأسفل كنسب من 0 إلى 1
من أبعاد الصورة الكاملة.

أرجع JSON فقط، دون شرح،
بالمفاتيح التالية:

grid:
مصفوفة 16 حرفًا منفصلًا.

bounds:
كائن يحتوي على
left وright وtop وbottom.

candidates:
مصفوفة الكلمات التي وجدتها.

استخرج جميع القيم من الصورة نفسها.
لا تستخدم أمثلة ثابتة.

إذا لم تتمكن من قراءة الشبكة بدقة،
أرجع grid فارغة.
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
          max_tokens: 950,
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

    const text = await response.text();

    let api;

    try {
      api = JSON.parse(text);
    } catch {
      throw new Error(
        'خدمة قراءة الصورة أرجعت ردًا ناقصًا'
      );
    }

    if (!response.ok) {
      throw new Error(
        api.error?.message ||
        'تعذّر تحليل الصورة'
      );
    }

    const content =
      api.choices?.[0]?.message?.content;

    let parsed;

    try {
      parsed = JSON.parse(content || '');
    } catch {
      throw new Error(
        'التحليل لم يكتمل؛ جرّب لقطة شاشة أصغر'
      );
    }

    if (
      !Array.isArray(parsed.grid) ||
      parsed.grid.length !== 16
    ) {
      throw new Error(
        'تعذّرت قراءة حروف الشبكة الـ16'
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
        'بعض الحروف غير واضحة؛ ارفع لقطة شاشة مباشرة'
      );
    }

    // فحص كلمات الذكاء الاصطناعي
    const words = [];
    const seen = new Set();

    const candidates =
      Array.isArray(parsed.candidates)
        ? parsed.candidates
        : [];

    for (const item of candidates) {
      const word = String(item || '')
        .trim()
        .replace(
          /[\u064B-\u065F\u0670\u0640]/g,
          ''
        );

      const key = normalize(word);

      if (
        seen.has(key) ||
        !/^[\u0621-\u064A]{4,5}$/u.test(word)
      ) {
        continue;
      }

      seen.add(key);

      const path = findPath(word, grid);

      if (path) {
        words.push({
          word,
          path
        });
      }
    }

    // تحديد مواقع الدوائر على الصورة
    const b = parsed.bounds || {};

    const bounds = {
      left: Number(b.left),
      right: Number(b.right),
      top: Number(b.top),
      bottom: Number(b.bottom)
    };

    const validBounds =
      ['left', 'right', 'top', 'bottom'].every(
        k =>
          b[k] !== undefined &&
          b[k] !== null &&
          Number.isFinite(bounds[k]) &&
          bounds[k] >= 0 &&
          bounds[k] <= 1
      ) &&
      bounds.left < bounds.right &&
      bounds.top < bounds.bottom;

    words.sort(
      (a, b) =>
        b.word.length - a.word.length ||
        a.word.localeCompare(b.word, 'ar')
    );

    return reply(200, {
      grid,
      bounds: validBounds ? bounds : null,

      // عرض 15 كلمة كحد أقصى
      words: words.slice(0, 15),

      note:
        'الكلمات من تحليل الصورة مباشرة، ' +
        'وتم فحص اتصال الحروف. ' +
        'قبولها داخل اللعبة غير مضمون.'
    });

  } catch (error) {
    return reply(
      error.name === 'AbortError' ? 504 : 422,
      {
        error:
          error.name === 'AbortError'
            ? 'انتهت مهلة تحليل الصورة (10 ثوانٍ). جرّب صورة أصغر.'
            : error.message
      }
    );
  } finally {
    clearTimeout(timeout);
  }
};
