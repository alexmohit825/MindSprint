export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.host;
    const path = url.pathname.toLowerCase().replace(/\/$/, '') || '/';

    // 1. Apple Wireless OTA Manifest: /manifest.plist
    if (path === '/manifest.plist') {
      const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>https://${host}/MindSprint.ipa</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>url</key>
                    <string>https://${host}/logo.svg</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>full-size-image</string>
                    <key>url</key>
                    <string>https://${host}/logo.svg</string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>com.AlexMohit.MindSprint</string>
                <key>bundle-version</key>
                <string>1.0.0</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string>MindSprint</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;
      return new Response(manifestXml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // 2. 1-Tap Safari OTA Installer Page: /install, /install/
    if (path === '/install') {
      const itmsUrl = `itms-services://?action=download-manifest&url=https://${encodeURIComponent(host)}/manifest.plist`;
      const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Install MindSprint (Ad-Hoc Wireless OTA)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #08090E;
      color: #F9FAFB;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    .card {
      background: rgba(18, 21, 30, 0.85);
      border: 1px solid rgba(229, 193, 125, 0.3);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      padding: 36px 28px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #1A1C26, #0D0E15);
      border: 1px solid rgba(229, 193, 125, 0.4);
      border-radius: 20px;
      padding: 14px;
      box-shadow: 0 10px 25px -5px rgba(229, 193, 125, 0.2);
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 6px;
    }
    .gold {
      background: linear-gradient(135deg, #FFF5DF 0%, #E5C17D 50%, #B88B42 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #9CA3AF;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34D399;
      font-size: 11px;
      font-weight: 700;
      border-radius: 12px;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .install-btn {
      display: block;
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #E5C17D, #C99C4B);
      color: #090A0F;
      font-weight: 800;
      font-size: 15px;
      text-decoration: none;
      border-radius: 16px;
      box-shadow: 0 12px 30px -5px rgba(229, 193, 125, 0.35);
      transition: transform 0.2s, filter 0.2s;
    }
    .install-btn:active {
      transform: scale(0.97);
    }
    .meta {
      margin-top: 24px;
      font-size: 11px;
      color: #6B7280;
      line-height: 1.6;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 18px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <img src="/logo.svg" alt="MindSprint" style="width: 100%; height: 100%; object-fit: contain;">
    </div>
    <h1>MIND<span class="gold">SPRINT</span></h1>
    <p class="subtitle">Premier Book Synthesis & Cognitive Intelligence</p>
    
    <div class="badge">✓ Alex's iPhone (00008150-001E7C892200401C)</div>
    
    <a href="${itmsUrl}" class="install-btn">
      1-Tap Install on iPhone
    </a>
    
    <div class="meta">
      Direct Apple Wireless OTA Distribution<br>
      Team ID: 523MJL63MC • Valid for 365 Days<br>
      Zero USB Cables • Zero TestFlight Footprint
    </div>
  </div>
</body>
</html>`;
      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 3. Binary IPA Handler: /MindSprint.ipa
    if (path === '/mindsprint.ipa') {
      const githubReleaseUrl = `https://github.com/alexmohit825/MindSprint/releases/download/v1.0.0-adhoc/MindSprint.ipa`;
      return Response.redirect(githubReleaseUrl, 302);
    }

    // 4. API Route: /api/synthesize (Universal Multi-Genre, Ancient & Multilingual Engine)
    if (url.pathname === '/api/synthesize' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { title, author, targetLanguage = 'English', textTypeHint = 'auto' } = body;

        if (!title) {
          return new Response(JSON.stringify({ error: 'Title is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const apiKey = env.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
        
        const systemPrompt = `You are MindSprint's Principal Analytical Synthesizer & Polymath Philologist. You synthesize non-fiction, ancient classical texts (Greek, Latin, Chinese, Sanskrit, Arabic, Hebrew), and dense academic treatises with world-class intellectual rigor, outperforming Blinkist and Shortform.

Target Language for Output: ${targetLanguage}.
If the text is Ancient or Classical:
- Set "textType": "ancient"
- Include "philologicalApparatus" with original script excerpts, historical era, civilizational context, and lineage impact.
- Include original language citations and transliterations in "keyQuotes".

If the text is an Academic or Scientific Treatise:
- Set "textType": "academic"
- Include "academicMethodology" with formal epistemology, mathematical foundations, empirical validity, and limitations.

Format output as strictly valid JSON matching this schema:
{
  "id": "kebab-case-title",
  "title": "${title}",
  "subtitle": "Clear, compelling, high-level thesis subtitle",
  "author": "${author || 'Unknown'}",
  "year": 2024,
  "category": "Ancient Texts & Classics | Academic & Scientific Treatises | Strategy & Leadership",
  "textType": "standard | ancient | academic",
  "originalLanguage": "English | Ancient Greek | Classical Chinese | Latin | Classical Arabic | German | etc.",
  "targetLanguage": "${targetLanguage}",
  "philologicalApparatus": {
    "historicalEra": "Exact historical dynasty, war, or period",
    "civilizationalContext": "Why and where it was written",
    "lineageImpact": "How it influenced 500-2500 years of thought",
    "originalScriptExcerpt": {
      "originalText": "Quote in original script (Greek, Chinese, Arabic, Latin, etc.)",
      "language": "Original language name",
      "transliteration": "Romanized phonetic transliteration",
      "literalMeaning": "Word-for-word translation"
    }
  },
  "academicMethodology": {
    "formalFramework": "Underlying theory or methodology",
    "empiricalValidity": "Replication status, empirical evidence",
    "mathematicalFoundations": ["Key formula or formal definition in LaTeX"],
    "limitations": "Critical academic boundaries"
  },
  "rating": 4.9,
  "readTime": { "spark": "1 min", "core": "14 min", "masterclass": "38 min" },
  "cover": {
    "bgGradient": "from-[#1A1829] via-[#0E1018] to-[#08090D]",
    "accentColor": "#818CF8",
    "motif": "Geometric or Classical Metaphor",
    "tagline": "A single profound philosophical tagline"
  },
  "spark": {
    "executiveThesis": "Deep, comprehensive 3-sentence thesis in ${targetLanguage}",
    "bottomLine": "Direct, actionable 1-sentence bottom line in ${targetLanguage}",
    "threeGoldenRules": ["Rule 1", "Rule 2", "Rule 3"],
    "coreMentalModel": {
      "name": "Primary Mental Model Name",
      "description": "Detailed description of the model",
      "diagramType": "matrix | flywheel | compounding | loop | inversion"
    }
  },
  "core": {
    "chapters": [
      {
        "number": 1,
        "title": "Chapter 1 Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "The single high-leverage insight",
        "anecdote": "Specific historical, experimental, or corporate anecdote",
        "originalCitation": "Book or passage citation"
      },
      {
        "number": 2,
        "title": "Chapter 2 Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "The single high-leverage insight",
        "anecdote": "Specific historical, experimental, or corporate anecdote"
      },
      {
        "number": 3,
        "title": "Chapter 3 Title",
        "breakdown": "Substantive analytical breakdown",
        "keyInsight": "The single high-leverage insight"
      }
    ]
  },
  "masterclass": {
    "dialecticCritique": {
      "authorBlindspots": "What the author got wrong, overlooked, or historical limits",
      "counterArguments": [
        { "opposingThinker": "Opposing Thinker Name", "counterpoint": "Their substantive rebuttal" }
      ],
      "validityNotes": "Empirical replication or historical textual integrity notes"
    },
    "authorBiases": ["Bias 1", "Bias 2"],
    "caseStudies": [
      { "entity": "Company, Empire, or Historical Entity", "scenario": "The challenge", "outcome": "The result" }
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
    {
      "quote": "Translated quote in ${targetLanguage}",
      "originalQuote": "Quote in original script (if ancient or foreign language)",
      "originalLanguage": "Language name",
      "context": "Context or lesson"
    }
  ]
}`;

        const prompt = `Synthesize the book "${title}" by author "${author || ''}". Target language: ${targetLanguage}. Hint: ${textTypeHint}. Output ONLY the raw JSON object with zero markdown backticks.`;

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
