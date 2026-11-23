# ClearDay live-data integration (work in progress)

Next.js API routes:
- GET /api/air?lat=28.6692&lon=77.4538 — Open-Meteo CAMS model-estimated US EPA AQI, pollutants and hourly history.
- GET /api/locations?q=Delhi — Open-Meteo geocoding.
- POST /api/ai — hosted LLM chat (Groq first, OpenRouter fallback by configuration).

Set `GROQ_API_KEY` and optionally `AI_MODEL=openai/gpt-oss-20b` in Vercel project environment variables. Alternatively set `OPENROUTER_API_KEY` and `AI_MODEL=openrouter/free`. Never use NEXT_PUBLIC_ for keys.

This branch connects dashboard current AQI, pollutant breakdown, neighbourhood point values and chat. Remaining demo elements to replace before release: hardcoded trend graph, fixed routine timing, hardcoded page city, plant AQI animation, fixed example AQI labels, and map centering. The AI endpoint currently accepts client-supplied AQI context: for production, fetch and validate context server-side and add rate limiting to prevent abuse. Do not present as complete or medically validated.

Open-Meteo free access is subject to non-commercial conditions and usage limits. Verify licensing for any ads or monetization. Map points are model estimates, not ground monitoring stations. The displayed scale is US EPA AQI, not India's CPCB AQI.
