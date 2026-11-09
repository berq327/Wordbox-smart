
'use strict';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const send = (statusCode, data) => ({
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

// فحص اتصال الحروف دون عرض المسارات
function isConnectedWord(word, grid) {
  const chars = [...normalize(word)];

  if (chars.length < 3 || chars.length > 16) {
    return false;
  }

  const cells = grid.map(normalize);
  const failed = new Set();

  function search(index, at, used) {
    if (at === chars.length) return true;

    const state = `${index},${at},${used}`;
    if (failed.has(state)) return false;

    for (let next = 0; next < 16; next++) {
      if (used & (1 << next)) continue;
      if (cells[next] !== chars[at]) continue;

      if (index !== -1) {
        const dr = Math.abs(
          Math.floor(next / 4) -
          Math.floor(index / 4)
        );

        const dc = Math.abs(
          (next % 4) - (index % 4)
        );

        if (dr > 1 || dc > 1) continue;
      }

      if (
        search(
          next,
          at + 1,
          used | (1 << next)
        )
      ) {
        return true;
      }
    }

    failed.add(state);
    return false;
  }

  return search(-1, 0, 0);
}

// التعامل مع رد الذكاء الاصطناعي
function parseModelOutput(content) {
  try {
    return JSON.parse(content);
  } catch (_) {
    const gridMatch = content.match(
      /"grid"\s*:\s*(\[[^\]]*\])/
    );

    if (!gridMatch) {
      throw new Error(
        'قراءة الحروف لم تكتمل. جرّب صورة أصغر.'
      );
    }

    let grid;

    try {
      grid = JSON.parse(gridMatch[1]);
    } catch (_) {
      throw new Error(
        'قراءة الحروف لم تكتمل. أعد المحاولة.'
      );
    }

    const wordsSection = content.match(
      /"words"\s*:\s*\[([\s\S]*)/
    );

    const words = wordsSection
      ? [
          ...wordsSection[1].matchAll(
            /"([\u0621-\u064A]{3,16})"/gu
          )
        ].map(x => x[1])
      : [];

    return {grid, words};
  }
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return send(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return send(405, {
      error: 'POST only'
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return send(503, {
      error: 'مفتاح OPENAI_API_KEY غير موجود'
    });
  }

  let timer;

  try {
    let body;

    try {
      body = JSON.parse(event.body || '{}');
    } catch (_) {
      return send(400, {
        error: 'بيانات الصورة غير صحيحة'
      });
    }

    const image = body.image;

    if (
      typeof image !== 'string' ||
      !/^data:image\/(png|jpeg|webp);base64,/i.test(image) ||
      image.length > 7500000
    ) {
      return send(400, {
        error: 'ارفع صورة واضحة وأصغر حجمًا'
      });
    }

    const controller = new AbortController();

    // مهلة التحليل 10 ثوانٍ
    timer = setTimeout(
      () => controller.abort(),
      10000
    );

    // تحليل الصورة والكلمات دون قاموس ثابت
    const prompt = `
أنت خبير بحل لعبة Wordbox العربية.

انظر للصورة واقرأ شبكة الحروف 4×4 فقط.

لا تقرأ كلمة الجولة أو أسماء اللاعبين
أو النصوص خارج الدوائر.

أرجع JSON فقط بمفتاحين بالترتيب:

"grid":
مصفوفة 16 حرفًا، صفوفًا من الأعلى
للأسفل، وكل صف من يسار الصورة
إلى يمينها.

"words":
مصفوفة من 30 إلى 35 كلمة عربية
حقيقية محتملة من حروف الشبكة نفسها.

فكّر في كلمات قصيرة وطويلة:
3 و4 و5 و6 و7 أحرف،
وأطول إن وجدت.

الحروف متجاورة أفقيًا أو عموديًا
أو قطريًا، ولا تستخدم الخانة نفسها
مرتين في الكلمة.

نوّع بين الأسماء والأفعال والصفات،
ولا تكرر الكلمات.

أعطِ الأولوية للكلمات الشائعة،
ولا تضف أي حروف من خارج الشبكة.

لا تكتب مسارات ولا إحداثيات
ولا شرحًا، فقط JSON.
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
          max_tokens: 1050,
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

    const apiText = await response.text();

    let api;

    try {
      api = JSON.parse(apiText);
    } catch (_) {
      throw new Error(
        'خدمة التحليل أرجعت ردًا غير مكتمل'
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

    if (
      typeof content !== 'string' ||
      !content.trim()
    ) {
      throw new Error(
        'لم تصل نتيجة تحليل الصورة'
      );
    }

    const parsed = parseModelOutput(content);

    if (
      !Array.isArray(parsed.grid) ||
      parsed.grid.length !== 16
    ) {
      throw new Error(
        'لم أتمكن من قراءة الحروف الـ16'
      );
    }

    const grid = parsed.grid.map(
      value => String(value || '').trim()
    );

    if (
      grid.some(
        value =>
          [...value].length !== 1 ||
          !/^[\u0621-\u064A]$/u.test(value)
      )
    ) {
      throw new Error(
        'بعض الحروف غير واضحة. جرّب لقطة شاشة مباشرة.'
      );
    }

    const seen = new Set();
    const words = [];

    const candidates = Array.isArray(parsed.words)
      ? parsed.words
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
        !/^[\u0621-\u064A]{3,16}$/u.test(word) ||
        seen.has(key)
      ) {
        continue;
      }

      seen.add(key);

      if (isConnectedWord(word, grid)) {
        words.push({word});
      }

      // عرض 15 كلمة فقط
      if (words.length === 15) break;
    }

    return send(200, {
      grid,
      words,
      note: words.length < 15
        ? 'عُرضت الكلمات التي أمكن التحقق من اتصال حروفها فقط.'
        : 'تم العثور على 15 كلمة متصلة الحروف.'
    });

  } catch (error) {
    return send(
      error.name === 'AbortError' ? 504 : 422,
      {
        error: error.name === 'AbortError'
          ? 'انتهت مهلة قراءة الصورة (10 ثوانٍ). جرّب صورة أصغر.'
          : error.message
      }
    );
  } finally {
    clearTimeout(timer);
  }
};
