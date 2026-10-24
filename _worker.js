export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.host;
    const path = url.pathname.toLowerCase().replace(/\/$/, '') || '/';

    // CORS Headers for API calls
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. API: Search Books by Author or Title (via Open Library Grounding)
    if (path === '/api/search' && request.method === 'GET') {
      const q = url.searchParams.get('q') || '';
      const author = url.searchParams.get('author') || '';

      if (!q && !author) {
        return new Response(JSON.stringify({ error: 'Query or author parameter required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      try {
        let olUrl = 'https://openlibrary.org/search.json?limit=15&fields=title,author_name,first_publish_year,cover_i,key';
        if (author) {
          olUrl += `&author=${encodeURIComponent(author)}`;
        }
        if (q) {
          olUrl += `&q=${encodeURIComponent(q)}`;
        }

        const olRes = await fetch(olUrl, {
          headers: { 'User-Agent': 'MindSprint/1.0 (contact: mohalex@gmail.com)' }
        });

        if (!olRes.ok) {
          throw new Error(`Open Library returned ${olRes.status}`);
        }

        const data = await olRes.json();
        const results = (data.docs || []).map(doc => ({
          title: doc.title,
          author: (doc.author_name && doc.author_name[0]) || 'Unknown',
          year: doc.first_publish_year ? String(doc.first_publish_year) : '',
          coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : '',
          key: doc.key
        }));

        return new Response(JSON.stringify({ results }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: `Search failed: ${err.message}` }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 2. API: Real Gemini Synthesis Engine (Zero Mad-Libs, Strict Grounding)
    if (path === '/api/synthesize' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { title, author, category = 'General', targetLanguage = 'English' } = body;

        if (!title || !title.trim()) {
          return new Response(JSON.stringify({ error: 'Title is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'GEMINI_API_KEY secret is not configured on Cloudflare worker.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        let coverUrl = '';
        let pubYear = '2024';

        // Prompt Gemini with strict academic & biographical integrity
        const systemPrompt = `You are MindSprint's Executive Analytical Synthesizer. You synthesize books, biographies, ancient texts, and academic papers with uncompromising intellectual rigor.
RULES:
1. Ground strictly in the authentic facts, actual chapters, true arguments, and real historical records of the specific work requested.
2. If this is a biography or personal work (e.g. by or about Eleanor Roosevelt, Marcus Aurelius, etc.), focus on the real historical life, actual published ideas, and verifiable philosophy—NEVER invent corporate business-speak or Silicon Valley jargon.
3. If you are not familiar with the specific work, state your uncertainty in the thesis rather than fabricating details.
4. Return strictly valid JSON matching the exact schema below, with no markdown code fences.`;

        const userPrompt = `Synthesize the book "${title}" by author "${author || 'Unknown'}".
Genre/Category: ${category}.
Target Language: ${targetLanguage}.
Known Publication Year: ${pubYear}.

Return strictly this JSON schema:
{
  "id": "${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}",
  "title": "${title}",
  "subtitle": "Accurate, substantive subtitle reflecting the work's authentic thesis",
  "author": "${author || 'Author'}",
  "year": "${pubYear}",
  "category": "${category}",
  "rating": 4.90,
  "readTime": { "spark": "1 min", "core": "14 min", "masterclass": "38 min" },
  "cover": {
    "coverUrl": "${coverUrl}",
    "bgGradient": "from-[#1A1829] via-[#0E1018] to-[#08090D]",
    "accentColor": "#E5C17D",
    "motif": "Philosophical or Historical Theme",
    "tagline": "Profound authentic theme"
  },
  "spark": {
    "executiveThesis": "Deep, comprehensive 3-sentence thesis grounded in the actual book.",
    "bottomLine": "Direct, actionable 1-sentence bottom line.",
    "threeGoldenRules": ["Rule 1", "Rule 2", "Rule 3"],
    "coreMentalModel": {
      "name": "Core Mental Model or Philosophical Principle",
      "description": "Substantive explanation of the principle",
      "diagramType": "framework"
    }
  },
  "core": {
    "chapters": [
      {
        "number": 1,
        "title": "Actual Chapter or Core Theme Title",
        "breakdown": "Substantive analytical breakdown of the authentic text",
        "keyInsight": "High-leverage takeaway",
        "anecdote": "Specific historical or real-life anecdote from the book"
      },
      {
        "number": 2,
        "title": "Second Theme Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "High-leverage takeaway",
        "anecdote": "Specific historical anecdote"
      },
      {
        "number": 3,
        "title": "Third Theme Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "High-leverage takeaway",
        "anecdote": "Specific historical anecdote"
      }
    ]
  },
  "masterclass": {
    "dialecticCritique": {
      "authorBlindspots": "Legitimate critique or historical context of what the author overlooked",
      "counterArguments": [
        { "opposingThinker": "Opposing Thinker or Historian", "counterpoint": "Their substantive philosophical or empirical rebuttal" }
      ],
      "validityNotes": "Historical context and enduring relevance"
    },
    "actionPlaybook": [
      { "step": 1, "action": "Actionable directive based on the book", "executionDetail": "Practical implementation" },
      { "step": 2, "action": "Actionable directive", "executionDetail": "Practical implementation" }
    ],
    "socraticReflection": [
      "Deep introspective question raised by this work"
    ]
  },
  "keyQuotes": [
    {
      "quote": "Authentic quote attributed to the author/work",
      "context": "Context or lesson of the quote"
    }
  ]
}`;

        const geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';
        const geminiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        });

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          return new Response(JSON.stringify({ error: `Gemini API returned ${geminiRes.status}: ${errText}` }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const geminiData = await geminiRes.json();
        const rawContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawContent) {
          return new Response(JSON.stringify({ error: 'Gemini returned empty candidate content' }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const parsed = JSON.parse(rawContent);
        if (coverUrl && (!parsed.cover || !parsed.cover.coverUrl)) {
          parsed.cover = parsed.cover || {};
          parsed.cover.coverUrl = coverUrl;
        }
        parsed.isCustomSynthesized = true;

        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: `Synthesis failed: ${err.message}` }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 3. Fallback: Cloudflare Pages serves static assets from /dist
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('MindSprint API active. Assets served by Pages.', { status: 200 });
  }
};
