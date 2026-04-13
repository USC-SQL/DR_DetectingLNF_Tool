import json
from openai import OpenAI
#import openai
import requests
import base64
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image(file):
    image_bytes = file.read()
    encoded_string = base64.b64encode(image_bytes).decode("utf-8")
    return encoded_string

def get_image_media_type(image_path):
    ext = os.path.splitext(image_path)[1].lower()
    media_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    return media_types.get(ext, "image/jpeg")

@app.route("/api/analyze", methods=["POST"])
def analyze():
    #reading data from frontend keys
    image_file = request.files.get("image_file")
    prompt_file = request.files.get("prompt_file")
    subject_name = request.form.get("subject_name", "")

    if not image_file:
        return jsonify({"error": "image file is required"}), 400
    if not prompt_file:
        return jsonify({"error": "prompt file is required"}), 400
    
    prompt_text = prompt_file.read().decode("utf-8")
    image = encode_image(image_file)
    media_type = get_image_media_type(image_file.filename)


    full_prompt = f"""
Subject name: {subject_name}

{prompt_text}
""".strip()

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an accessibility auditor evaluating WCAG 2.4.3 (Focus Order). Return only valid JSON. Provide structured, consistent, and thorough reasoning. Analyze keyboard navigation in a logical, step-by-step manner, following the full sequence of focus transitions from browser entry to exit. Be systematic and do not omit relevant transitions, even if they are not failures."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{media_type};base64,{image}"
                            }
                        },
                        {
                            "type": "text",
                            "text": full_prompt
                        }
                    ]
                }
            ],
            response_format={"type": "json_object"}
        )

        result_text = response.choices[0].message.content
        result_json = json.loads(result_text)

        with open("chatgpt.json", "w", encoding="utf-8") as f:
            json.dump(result_json, f, indent=2, ensure_ascii=False)

        return jsonify(result_json), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)