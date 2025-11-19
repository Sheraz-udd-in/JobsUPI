"""
Compatibility shim for aifc module (removed in Python 3.13)
This provides minimal functionality needed by SpeechRecognition
"""

# This is a minimal stub to prevent import errors
# SpeechRecognition uses aifc but we're using WAV format which doesn't need it

class Error(Exception):
    pass

def open(*args, **kwargs):
    raise Error("AIFC format not supported. Please use WAV format.")
