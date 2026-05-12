from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)


# ================= DTO =================
class MessageRequest(BaseModel):
    message: str
    draft: str | None = None
    tone: str


# ================= HOME =================
@app.get("/")
def home():
    return {"message": "AI Service Running"}


# ================= TONE ENGINE =================
def get_tone_instruction(tone: str):
    if tone == "Professional":
        return """
Use a formal and polite tone.
- No slang
- Clear and respectful language
- Slightly structured sentences
"""

    elif tone == "Friendly":
        return """
Use a casual and friendly tone.
- Natural spoken language
- Light emotion allowed
- Can use Hinglish slightly
"""

    elif tone == "Short":
        return """
Keep replies very short.
- Max 2–5 words
- No explanation
- Direct response
"""

    elif tone == "Detailed":
        return """
Give slightly detailed reply.
- Add small context
- Still conversational
- Max 1–2 lines
"""

    return ""


# ================= API =================
@app.post("/suggest")
def suggest_reply(data: MessageRequest):
    try:
        tone_instruction = get_tone_instruction(data.tone)

        # ================= MODE 1: TYPING =================
        if data.draft and data.draft.strip():

            prompt = f"""
User is typing a message in chat:

"{data.draft}"

Rewrite it naturally.

Rules:
- Make it human-like
- No AI tone
- Keep same meaning
- Improve clarity

{tone_instruction}

Return ONLY JSON:
{{
  "easy": "",
  "medium": "",
  "hard": "",
  "smart": ""
}}
"""

        # ================= MODE 2: REPLY =================
        else:

            prompt = f"""
User received this message:

"{data.message}"

Generate replies user can send.

Rules:
- Real chat style (WhatsApp feel)
- Not robotic
- Context-aware
- Natural tone

{tone_instruction}

Return ONLY JSON:
{{
  "easy": "",
  "medium": "",
  "hard": "",
  "smart": ""
}}
"""

        # ================= GROQ CALL =================
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You generate only clean JSON. No explanation. No extra text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.85  # 🔥 more human feel
        )

        text = response.choices[0].message.content.strip()

        # ================= SAFE JSON =================
        try:
            return json.loads(text)
        except:
            start = text.find("{")
            end = text.rfind("}") + 1
            clean = text[start:end]
            return json.loads(clean)

    except Exception as e:
        return {"error": str(e)}
    