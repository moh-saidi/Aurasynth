from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from mido import MidiFile

app = Flask(__name__)
CORS(app)

# Configuration
SAMPLE_MIDI_PATH = os.path.join(os.path.dirname(__file__), './sample.mid')

@app.route('/api/generate', methods=['POST'])
def generate_music():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Check if sample.mid exists
        if not os.path.exists(SAMPLE_MIDI_PATH):
            return jsonify({"error": "Sample MIDI file not found"}), 404

        # Read the sample.mid file
        with open(SAMPLE_MIDI_PATH, 'rb') as midi_file:
            midi_base64 = base64.b64encode(midi_file.read()).decode('utf-8')

        # Generate a unique filename based on the prompt
        sanitized_prompt = ''.join(c for c in prompt if c.isalnum())[:20]
        timestamp = str(int(os.times().elapsed * 1000))
        midi_filename = f"{timestamp}-{sanitized_prompt}.mid"

        return jsonify({
            "midi": {
                "filename": midi_filename,
                "data": midi_base64,
                "mimetype": "audio/midi"
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)