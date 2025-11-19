"""
AI Video Interviewer Service
Integrates with Hugging Face AI interviewer model
Handles speech recognition, text-to-speech, and interview conversations
"""

import flask
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from gradio_client import Client
from gtts import gTTS
import os
import datetime
import speech_recognition as sr
from pydub import AudioSegment
import sys
import logging
import json
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==============================================================================
# FFMPEG CONFIGURATION
# ==============================================================================
def setup_ffmpeg():
    """Setup FFmpeg paths for audio processing"""
    try:
        # Try to detect FFmpeg automatically first
        import shutil
        ffmpeg_path = shutil.which("ffmpeg")
        ffprobe_path = shutil.which("ffprobe")
        
        if ffmpeg_path and ffprobe_path:
            logger.info(f"✅ FFmpeg found at: {ffmpeg_path}")
            return True
        
        # Fallback to common Windows paths
        windows_paths = [
            (r"C:\ffmpeg\bin\ffmpeg.exe", r"C:\ffmpeg\bin\ffprobe.exe"),
            (r"C:\Program Files\ffmpeg\bin\ffmpeg.exe", r"C:\Program Files\ffmpeg\bin\ffprobe.exe"),
        ]
        
        for ffmpeg, ffprobe in windows_paths:
            if os.path.exists(ffmpeg) and os.path.exists(ffprobe):
                AudioSegment.converter = ffmpeg
                AudioSegment.ffprobe = ffprobe
                logger.info(f"✅ FFmpeg paths successfully set: {ffmpeg}")
                return True
        
        logger.warning("⚠️ FFmpeg not found in standard paths. Audio processing may fail.")
        return False
        
    except Exception as e:
        logger.warning(f"⚠️ Warning: Could not set FFmpeg paths. Error: {e}")
        return False

# ==============================================================================
# INITIALIZE FLASK APP
# ==============================================================================
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, resources={r"/*": {"origins": "*"}})

# Setup FFmpeg
setup_ffmpeg()

# ==============================================================================
# INITIALIZE HUGGING FACE CLIENT
# ==============================================================================
client = None

def initialize_hf_client():
    """Initialize connection to Hugging Face AI model"""
    global client
    try:
        logger.info("Attempting to connect to Hugging Face AI model...")
        client = Client("ahmedatk/ai_interviewer")
        logger.info("✅ Connection to Hugging Face successful!")
        return True
    except Exception as e:
        logger.error(f"❌ FATAL ERROR: Could not connect to Hugging Face API")
        logger.error(f"   Error details: {e}")
        logger.error("   The application will try to reconnect on first interview request")
        return False

# Try to initialize on startup
initialize_hf_client()

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

def text_to_speech(text, filename_prefix="response"):
    """
    Converts text to MP3 file and returns its URL
    
    Args:
        text (str): Text to convert to speech
        filename_prefix (str): Prefix for the audio filename
        
    Returns:
        str: URL to the generated audio file
    """
    try:
        audio_folder = os.path.join(app.static_folder, 'audio')
        os.makedirs(audio_folder, exist_ok=True)
        
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = f"{filename_prefix}_{timestamp}.mp3"
        filepath = os.path.join(audio_folder, filename)
        
        # Clean text
        cleaned_text = text.replace('**', '').strip()
        if not cleaned_text:
            cleaned_text = "I did not get a response. Please try again."
        
        # Generate speech
        logger.info(f"Generating speech for: {cleaned_text[:50]}...")
        tts = gTTS(text=cleaned_text, lang='en', slow=False)
        tts.save(filepath)
        
        logger.info(f"✅ Audio saved: {filename}")
        return f"/static/audio/{filename}?v={timestamp}"
        
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        return None

def transcribe_audio(audio_file_path):
    """
    Transcribes audio file to text using Google Speech Recognition
    
    Args:
        audio_file_path (str): Path to audio file
        
    Returns:
        str: Transcribed text
    """
    try:
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_file_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            logger.info(f"✅ Transcribed: {text[:50]}...")
            return text
    except sr.UnknownValueError:
        logger.warning("Could not understand audio")
        return "(Could not understand - please speak clearly)"
    except sr.RequestError as e:
        logger.error(f"Google Speech Recognition error: {e}")
        return f"(Error: {e})"
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        return "(Error during transcription)"

def convert_audio_to_wav(input_file_path):
    """
    Converts audio file to WAV format
    
    Args:
        input_file_path (str): Path to input audio file
        
    Returns:
        str: Path to converted WAV file
    """
    try:
        output_file_path = input_file_path.replace(os.path.splitext(input_file_path)[1], ".wav")
        audio = AudioSegment.from_file(input_file_path)
        audio.export(output_file_path, format="wav")
        logger.info(f"✅ Audio converted to WAV: {output_file_path}")
        return output_file_path
    except Exception as e:
        logger.error(f"Audio conversion error: {e}")
        return None

# ==============================================================================
# API ENDPOINTS
# ==============================================================================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    hf_status = "connected" if client else "disconnected"
    return jsonify({
        "status": "healthy",
        "huggingface": hf_status,
        "service": "AI Interview Service"
    })

@app.route('/', methods=['GET'])
def index():
    """Serves the main HTML page"""
    return render_template('index.html')

@app.route('/api/start-interview', methods=['POST'])
def start_interview():
    """
    Starts a new interview session
    
    Expected request data:
        - resume (file): PDF resume file
        - job_description (str): Job description text
        - interview_id (str): Optional interview session ID for database
        
    Returns:
        - conversation (str): Initial conversation text
        - audio_url (str): URL to first question audio
        - first_question (str): First question text
    """
    global client
    
    logger.info("Starting new interview session...")
    
    # Check if client is connected
    if not client:
        logger.info("Reconnecting to Hugging Face...")
        if not initialize_hf_client():
            return jsonify({
                "error": "Cannot connect to AI service. Please check internet connection."
            }), 503
    
    # Validate request
    if 'resume' not in request.files or 'job_description' not in request.form:
        return jsonify({"error": "Missing resume or job description"}), 400
    
    resume_file = request.files['resume']
    job_description = request.form['job_description']
    
    if not resume_file.filename or not job_description.strip():
        return jsonify({"error": "Resume and job description required"}), 400
    
    try:
        # Save temporary resume file
        temp_resume_path = f"temp_resume_{datetime.datetime.now().timestamp()}.pdf"
        resume_file.save(temp_resume_path)
        
        logger.info(f"Resume saved: {temp_resume_path}")
        
        # Call Hugging Face API
        logger.info("Calling Hugging Face AI model...")
        result = client.predict(
            resume=temp_resume_path,
            job_desc=job_description,
            api_name="/gradio_start_interview"
        )
        
        conversation_text = result[0]
        logger.info(f"AI response received. Length: {len(conversation_text)}")
        
        # Extract first question
        lines = conversation_text.strip().split('\n')
        first_question = lines[-1] if lines else "Tell me about yourself."
        
        # Generate speech for first question
        audio_url = text_to_speech(first_question, "question_0")
        
        # Cleanup
        os.remove(temp_resume_path)
        
        return jsonify({
            "success": True,
            "conversation": conversation_text,
            "audio_url": audio_url,
            "first_question": first_question
        })
        
    except Exception as e:
        logger.error(f"Error starting interview: {e}")
        return jsonify({
            "error": f"Failed to start interview: {str(e)}"
        }), 500
    finally:
        if os.path.exists(temp_resume_path):
            os.remove(temp_resume_path)

@app.route('/api/process-response', methods=['POST'])
def process_response():
    """
    Processes user's spoken response and gets AI's next response
    
    Expected request data:
        - audio (file): WAV or WebM audio file of user's response
        - conversation_history (str): Full conversation so far
        
    Returns:
        - success (bool): Whether processing was successful
        - transcription (str): Transcribed user response
        - ai_response (str): AI's next response
        - audio_url (str): URL to AI's response audio
        - conversation (str): Updated conversation
    """
    global client
    
    logger.info("Processing user response...")
    
    # Check if client is connected
    if not client:
        logger.info("Reconnecting to Hugging Face...")
        if not initialize_hf_client():
            return jsonify({
                "error": "Cannot connect to AI service"
            }), 503
    
    # Validate request
    if 'audio' not in request.files or 'conversation_history' not in request.form:
        return jsonify({"error": "Missing audio or conversation history"}), 400
    
    audio_file = request.files['audio']
    conversation_history = request.form['conversation_history']
    
    temp_audio_path = None
    wav_audio_path = None
    
    try:
        # Save temporary audio file
        timestamp = datetime.datetime.now().timestamp()
        temp_audio_path = f"temp_audio_{timestamp}.webm"
        audio_file.save(temp_audio_path)
        
        logger.info(f"Audio file saved: {temp_audio_path}")
        
        # Convert to WAV for speech recognition
        wav_audio_path = convert_audio_to_wav(temp_audio_path)
        
        if not wav_audio_path:
            return jsonify({
                "error": "Could not process audio file. Check FFmpeg installation."
            }), 500
        
        # Transcribe audio
        user_response_text = transcribe_audio(wav_audio_path)
        logger.info(f"User said: {user_response_text}")
        
        # Get AI response
        logger.info("Getting AI response...")
        result = client.predict(
            response=user_response_text,
            api_name="/gradio_handle_response"
        )
        
        ai_full_response = result[0]
        logger.info(f"AI response received. Length: {len(ai_full_response)}")
        
        # Extract new AI response (after user's response)
        new_ai_part = ai_full_response.split(user_response_text, 1)[-1].strip()
        if not new_ai_part:
            new_ai_part = "Thank you for your response."
        
        # Generate speech for new response
        audio_url = text_to_speech(new_ai_part, "question")
        
        # Update conversation
        updated_conversation = conversation_history + f"\n\n**You:** {user_response_text}\n\n**AI:** {new_ai_part}"
        
        return jsonify({
            "success": True,
            "transcription": user_response_text,
            "ai_response": new_ai_part,
            "audio_url": audio_url,
            "conversation": updated_conversation
        })
        
    except Exception as e:
        logger.error(f"Error processing response: {e}")
        return jsonify({
            "error": f"Failed to process response: {str(e)}"
        }), 500
        
    finally:
        # Cleanup temporary files
        for path in [temp_audio_path, wav_audio_path]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except:
                    pass

@app.route('/api/end-interview', methods=['POST'])
def end_interview():
    """
    Ends interview session and returns summary
    
    Expected request data:
        - interview_data (dict): Full interview data
        
    Returns:
        - success (bool)
        - summary (str): Interview summary
    """
    try:
        data = request.json
        logger.info(f"Interview ended. Session data received.")
        
        # You can save to database here if needed
        
        return jsonify({
            "success": True,
            "message": "Interview session saved successfully"
        })
        
    except Exception as e:
        logger.error(f"Error ending interview: {e}")
        return jsonify({
            "error": f"Failed to end interview: {str(e)}"
        }), 500

# ==============================================================================
# ERROR HANDLERS
# ==============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

# ==============================================================================
# MAIN
# ==============================================================================

if __name__ == '__main__':
    logger.info("="*70)
    logger.info("Starting AI Video Interviewer Service")
    logger.info("="*70)
    logger.info(f"FFmpeg Status: {'✅ Available' if os.system('ffmpeg -version > nul 2>&1') == 0 else '⚠️ Not found in PATH'}")
    logger.info("Visit http://localhost:5001 to start interviews")
    logger.info("="*70)
    
    app.run(debug=False, port=5001, host='0.0.0.0')
