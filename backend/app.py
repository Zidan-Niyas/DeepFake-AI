import os
import numpy as np
import librosa
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import joblib

app = Flask(__name__)
CORS(app)

# Load the model and scaler
model = load_model('deepfake_audio_model.h5')
scaler = joblib.load('scaler.joblib')

def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    zcr = librosa.feature.zero_crossing_rate(y)
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    rms = librosa.feature.rms(y=y)
    features = np.concatenate([
        np.mean(mfcc, axis=1),
        np.mean(zcr, axis=1),
        np.mean(spectral_contrast, axis=1),
        np.mean(chroma, axis=1),
        np.mean(rms, axis=1)
    ])
    return features

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        file_path = os.path.join('/tmp', file.filename)
        file.save(file_path)
        
        features = extract_features(file_path)
        features = scaler.transform([features])
        features = features.reshape(1, features.shape[1], 1)
        
        prediction = model.predict(features)[0][0]
        
        os.remove(file_path)
        
        return jsonify({
            'prediction': float(prediction),
            'is_bonafide': bool(prediction > 0.5)
        })

if __name__ == '__main__':
    app.run(debug=True)

print("Flask server is running. Use 'flask run' to start the server.")