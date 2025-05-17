from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging
import time

app = Flask(__name__)
CORS(app)

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Kaggle API endpoint (replace with your ngrok URL)
KAGGLE_API_URL = "https://d865-34-29-99-232.ngrok-free.app/generate-midi"  # Update after running Kaggle notebook

@app.route('/api/generate', methods=['POST'])
def generate_music():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Send prompt to Kaggle API
        response = requests.post(KAGGLE_API_URL, json={"prompt": prompt}, timeout=60)
        response.raise_for_status()  # Raise exception for bad status codes

        result = response.json()
        if "error" in result:
            return jsonify({"error": result["error"]}), 500

        midi_data = result["midi"]["data"]
        mimetype = result["midi"]["mimetype"]

        # Generate filename
        sanitized_prompt = ''.join(c for c in prompt if c.isalnum())[:20]
        timestamp = str(int(time.time() * 1000))
        midi_filename = f"{timestamp}-{sanitized_prompt}.mid"

        return jsonify({
            "midi": {
                "filename": midi_filename,
                "data": midi_data,
                "mimetype": mimetype
            }
        }), 200

    except requests.RequestException as e:
        logger.error(f"Error contacting Kaggle API: {str(e)}")
        return jsonify({"error": "Failed to generate MIDI due to server error"}), 500
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)