from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_image_from_url(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    # Look for OpenGraph image
    og_image = soup.find("meta", property="og:image")
    if og_image and og_image["content"]:
        return og_image["content"]

    # Fallback: Get first <img> tag
    img_tag = soup.find("img")
    return img_tag["src"] if img_tag else None

@app.route("/extract-image", methods=["POST"])
def extract_image():
    data = request.json
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    image_url = get_image_from_url(url)
    if image_url:
        return jsonify({"image": image_url})
    
    return jsonify({"error": "Image not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
