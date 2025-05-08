from flask import Flask, request, jsonify, send_file
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import cv2
import io
from  io import BytesIO
from gradio_client import Client, file
import time
import os
from PIL import Image
from inference_sdk import InferenceHTTPClient
import roboflow
app = Flask(__name__)
CORS(app)

HUGGING_FACE_MODELS = {
    "IMAGDressing": {
        "repo_id": "anushriiyer/IMAGDressing-v1",
        "api_name": "/IMAGDressing-v1",
        "params": {
            "cloth_guidance_scale": 0.85,
            "caption_guidance_scale": 6.5,
            "face_guidance_scale": 0.9,
            "self_guidance_scale": 0.2,
            "cross_guidance_scale": 0.2,
            "if_ipa": False,
            "if_control": False,
            "denoise_steps": 30,
            "seed": 20240508
        }
    },
    "Leffa": {
        "repo_id": "franciszzj/Leffa",
        "api_name": "/leffa_predict_vt",
        "params": {
            "ref_acceleration": False,
            "step": 30,
            "scale": 2.5,
            "seed": 42,
            "vt_model_type": "viton_hd",
            "vt_garment_type": "upper_body",
            "vt_repaint": False
        }
    }
}


def get_image_from_url(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an error for HTTP failures

        soup = BeautifulSoup(response.text, "html.parser")

        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            return og_image["content"]

        # Fallback: Get first <img> tag
        img_tag = soup.find("img")
        return img_tag["src"] if img_tag else None

    except requests.RequestException as e:
        print(f"Error fetching webpage: {e}")
        return None

def take_screenshot(url):
    """Use Selenium to take a screenshot of the webpage."""
    chrome_options = Options()

    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.178 Safari/537.36"
    )
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")


    service = Service("/Users/anushriiyer/Downloads/chromedriver-mac-arm64/chromedriver")  # Update with your ChromeDriver path
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.get(url)
        time.sleep(3)  # Give time for elements to load

        screenshot_path = "screenshot.png"
        driver.save_screenshot(screenshot_path)
        
        return screenshot_path
    finally:
        driver.quit()

import json
import base64

def detect_edges_and_crop(image_path):
    client = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key="tg3YE1MO6a9jF7kViZY5"
    )

    try:
        with open(image_path, "rb") as image_file:
            result = client.run_workflow(
                workspace_name="mdp-kwrbk",
                workflow_id="detect-and-classify",
                images={"image": image_path},
                use_cache=True
            )

        if isinstance(result, str):
            result = json.loads(result)

        classes = []
        cropped_image_paths = []

        predictions = result[0].get("predictions", [])
        for prediction in predictions:
            crops = prediction.get("crops", None)
            if isinstance(crops, str):  # It's a base64 string
                base64_image = crops
                cropped_image_path = f"cropped_image_{len(cropped_image_paths)}.png"
                with open(cropped_image_path, "wb") as f:
                    f.write(base64.b64decode(base64_image))
                cropped_image_paths.append(cropped_image_path)

            prediction_data = prediction.get("predictions", {}).get("predictions", [])
            for pred in prediction_data:
                class_name = pred.get("class", "unknown")
                classes.append(class_name)

        return classes, cropped_image_paths

    except Exception as e:
        print(f"Error during inference: {e}")
        return [], []


def fetch_image_data(image_url):
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

    # Step 1: Extract the image URL using OpenGraph or <img> tag
    image_url = get_image_from_url(url)
    
    if image_url:
        image_data, mime_type = fetch_image_data(image_url)
        if image_data:
            return send_file(io.BytesIO(image_data), mimetype=mime_type)

    print("Falling back to Selenium...")
    screenshot_path = take_screenshot(url)

    # Use the updated detect_edges_and_crop function
    classes, cropped_image_paths = detect_edges_and_crop(screenshot_path)
    print("Classes:", classes)
    print("Cropped Images:", cropped_image_paths)

    # Step 4: If cropped image exists, return it; otherwise, return full screenshot
    final_image_path = cropped_image_paths[0] if cropped_image_paths else screenshot_path

    # Read the image and send it
    if os.path.exists(final_image_path):
        return send_file(final_image_path, mimetype="image/png")

    return jsonify({"error": "Could not extract an image"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)