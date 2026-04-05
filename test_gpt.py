from openai import OpenAI
#import openai
import requests
import base64
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
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

IMAGE_PATH = "disneyworld.png"
TASK = "provided to you is a screenshot of subject website disneyworld, each keyboard navigable element is numerically labeled within the screenshots in the order in which a keyboard based user would navigate throughout the webpage, can you provide me a numbered list of the implemented keyboard navigation path within disneyworld?"
LOG_FILE = "chat_log.txt"
def log(text):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(text + "\n")


def main():

    if not os.path.exists(IMAGE_PATH):
        raise FileNotFoundError(f"Image not found: {IMAGE_PATH}")
    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    #insert iamge and task as the first user message
    base64_image = encode_image(IMAGE_PATH)
    media_type = get_image_media_type(IMAGE_PATH)

    messages.append({
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{media_type};base64,{base64_image}"
                }
            },
            {
                "type": "text",
                "text": TASK
            }
        ]
    })

    #get gpt's response to the image+task
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    reply = response.choices[0].message.content
    print(f"Assistant (on image): {reply}\n")
    log(reply)
    messages.append({"role": "assistant", "content": reply})

    #continue with normal chat loop
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break

        messages.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )

        reply = response.choices[0].message.content
        print(f"Assistant: {reply}\n")

        # assistant reply to history so it remembers context
        messages.append({"role": "assistant", "content": reply})

if __name__ == "__main__":
    main()