from flask import Flask, request, jsonify, send_file
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

def get_image_from_url(url):
    """Extract the image URL from a webpage using OpenGraph tags or the first <img> tag."""
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an error for HTTP failures

        soup = BeautifulSoup(response.text, "html.parser")

        # Look for OpenGraph image
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            return og_image["content"]

        # Fallback: Get first <img> tag
        img_tag = soup.find("img")
        return img_tag["src"] if img_tag else None

    except requests.RequestException as e:
        print(f"Error fetching webpage: {e}")
        return None

def fetch_image_data(image_url):
    """Fetch the image file from the extracted URL."""
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(image_url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.content, response.headers["Content-Type"]
    
    except requests.RequestException as e:
        print(f"Error fetching image: {e}")
        return None, None

@app.route("/extract-image", methods=["POST"])
def extract_image():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # Step 1: Extract the image URL
    image_url = get_image_from_url(url)
    
    if not image_url:
        return jsonify({"error": "No image found"}), 404

    # Step 2: Fetch the image file
    image_data, mime_type = fetch_image_data(image_url)

    if not image_data:
        return jsonify({"error": "Failed to retrieve image"}), 404

    # Step 3: Return the actual image file
    return send_file(io.BytesIO(image_data), mimetype=mime_type)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
