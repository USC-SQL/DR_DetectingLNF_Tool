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
    #reading data from form-data

    # Get multiple files (plural)
    image_files = request.files.getlist("image_files[]")
    # If none found, try single file (singular)
    if not image_files:
        single = request.files.get("image_file")
        if single:
            image_files = [single] 

    prompt_file = request.files.get("prompt_file")
    subject_name = request.form.get("subject_name", "")

    if not image_files:
        return jsonify({"error": "image files are required"}), 400
    if not prompt_file:
        return jsonify({"error": "prompt file is required"}), 400
    
    #process form inputs
    prompt_text = prompt_file.read().decode("utf-8")



    full_prompt = f"""
Subject name: {subject_name}

{prompt_text}
""".strip()
    
    # Build content list: add images first, then add text prompt
    content = []
    for image_file in image_files:
        encoded = encode_image(image_file)
        media_type = get_image_media_type(image_file.filename)
        content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:{media_type};base64,{encoded}"
            }
        })

    content.append({
        "type": "text",
        "text": full_prompt
    })

    try:
        response = client.chat.completions.create(
            model="gpt-5.4",
            messages=[
                {
                    "role": "system",
                    "content": "You are an accessibility auditor evaluating WCAG 2.4.3 (Focus Order). Return only valid JSON. Provide structured, consistent, and thorough reasoning. Analyze keyboard navigation in a logical, step-by-step manner, following the full sequence of focus transitions from browser entry to exit. Be systematic and do not omit relevant transitions, even if they are not failures."
                },
                {
                    "role": "user",
                    "content": content
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