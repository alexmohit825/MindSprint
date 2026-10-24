export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Route: /api/synthesize
    if (url.pathname === '/api/synthesize' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { title, author } = body;

        if (!title) {
          return new Response(JSON.stringify({ error: 'Title is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const apiKey = env.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
        
        const systemPrompt = `You are MindSprint's Principal Analytical Synthesizer. You produce executive-tier, deeply rigorous, non-naive book summaries that outclass Blinkist and Shortform.
Format output as strictly valid JSON matching this schema:
{
  "id": "kebab-case-title",
  "title": "${title}",
  "subtitle": "Clear, compelling, high-level thesis subtitle",
  "author": "${author || 'Unknown'}",
  "year": 2024,
  "category": "Strategy & Leadership",
  "rating": 4.9,
  "readTime": { "spark": "1 min", "core": "12 min", "masterclass": "35 min" },
  "cover": {
    "bgGradient": "from-[#1A1829] via-[#0E1018] to-[#08090D]",
    "accentColor": "#818CF8",
    "motif": "Geometric Metaphor",
    "tagline": "A single profound philosophical tagline"
  },
  "spark": {
    "executiveThesis": "Deep, comprehensive 3-sentence thesis",
    "bottomLine": "Direct, actionable 1-sentence bottom line",
    "threeGoldenRules": ["Rule 1", "Rule 2", "Rule 3"],
    "coreMentalModel": {
      "name": "Primary Mental Model Name",
      "description": "Detailed description of the model",
      "diagramType": "matrix"
    }
  },
  "core": {
    "chapters": [
      {
        "number": 1,
        "title": "Chapter 1 Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "The single high-leverage insight",
        "anecdote": "Specific historical or corporate anecdote"
      },
      {
        "number": 2,
        "title": "Chapter 2 Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "The single high-leverage insight",
        "anecdote": "Specific historical or corporate anecdote"
      },
      {
        "number": 3,
        "title": "Chapter 3 Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "The single high-leverage insight",
        "anecdote": "Specific historical or corporate anecdote"
      }
    ]
  },
  "masterclass": {
    "dialecticCritique": {
      "authorBlindspots": "What the author got wrong or overlooked",
      "counterArguments": [
        { "opposingThinker": "Opposing Thinker Name", "counterpoint": "Their substantive rebuttal" }
      ],
      "validityNotes": "Empirical replication notes or limitations"
    },
    "authorBiases": ["Bias 1", "Bias 2"],
    "caseStudies": [
      { "entity": "Company or Historical Entity", "scenario": "The challenge", "outcome": "The result" }
    ],
    "actionPlaybook": [
      { "step": 1, "action": "Actionable directive", "executionDetail": "Step-by-step implementation protocol" },
      { "step": 2, "action": "Actionable directive", "executionDetail": "Step-by-step implementation protocol" }
    ],
    "socraticReflection": [
      "Challenging introspective question 1",
      "Challenging introspective question 2"
    ]
  },
  "keyQuotes": [
    { "quote": "Profound quote from the book", "context": "Context or lesson" },
    { "quote": "Second memorable quote", "context": "Context or lesson" }
  ]
}`;

        const prompt = `Synthesize the book "${title}" by author "${author || ''}". Output ONLY the raw JSON object with zero markdown backticks.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2
            }
          })
        });

        const geminiData = await geminiRes.json();
        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!rawText) {
          throw new Error('No content returned from Gemini');
        }

        const parsed = JSON.parse(rawText);
        parsed.isCustomSynthesized = true;

        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Synthesis failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Default: serve static assets via Cloudflare Pages
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not found', { status: 404 });
  }
};
