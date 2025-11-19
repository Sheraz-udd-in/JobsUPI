"""
Test Hugging Face AI Model - Check if it works before integration
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from gradio_client import Client, handle_file
import tempfile
from pathlib import Path

def test_hf_connection():
    """Test if we can connect to Hugging Face AI Interviewer model"""
    print("=" * 70)
    print("Testing Hugging Face AI Interviewer Model Connection")
    print("=" * 70)
    
    try:
        print("\n1️⃣  Connecting to Hugging Face...")
        client = Client("ahmedatk/ai_interviewer")
        print("✅ Connection successful!")
        return client
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("   Check: Internet connection, firewall, model availability")
        return None

def test_start_interview(client):
    """Test starting an interview"""
    print("\n2️⃣  Testing interview start...")
    
    try:
        # Create a temporary PDF file using reportlab
        try:
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
                temp_resume_path = f.name
            
            c = canvas.Canvas(temp_resume_path, pagesize=letter)
            c.drawString(100, 750, "RESUME - John Doe")
            c.drawString(100, 730, "Senior Software Engineer")
            c.drawString(100, 700, "Experience:")
            c.drawString(120, 680, "- 6+ years Python, JavaScript, React")
            c.drawString(120, 660, "- Full stack development")
            c.drawString(120, 640, "- AWS and microservices")
            c.drawString(120, 620, "- Docker and Kubernetes")
            c.drawString(120, 600, "- PostgreSQL and MongoDB")
            c.save()
        except ImportError:
            # Fallback: if reportlab not installed, create a minimal PDF
            print("   (reportlab not installed, using basic PDF)")
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False, mode='wb') as f:
                # Minimal PDF content
                pdf_content = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 88 >>
stream
BT
/F1 12 Tf
100 700 Td
(RESUME: Senior Software Engineer, 6 years experience) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000380 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
452
%%EOF"""
                f.write(pdf_content)
                temp_resume_path = f.name
        
        job_desc = """
        Senior Backend Engineer
        - 5+ years Python/Node.js experience
        - Microservices architecture
        - AWS/Cloud experience
        - Database design (PostgreSQL, MongoDB)
        - Leadership experience
        """
        
        print(f"   Resume file: {temp_resume_path}")
        print(f"   Job: Senior Backend Engineer")
        
        print("\n   Calling Hugging Face /gradio_start_interview...")
        result = client.predict(
            resume=handle_file(temp_resume_path),
            job_desc=job_desc,
            api_name="/gradio_start_interview"
        )
        
        conversation_text = result[0]
        print("\n✅ Interview started successfully!")
        print(f"\n   Response length: {len(conversation_text)} characters")
        print(f"\n   First 500 characters of response:")
        print("   " + "-" * 60)
        print("   " + conversation_text[:500])
        print("   " + "-" * 60)
        
        # Clean up
        os.unlink(temp_resume_path)
        
        return conversation_text, job_desc
        
    except Exception as e:
        print(f"❌ Interview start failed: {e}")
        return None, None

def test_handle_response(client, conversation_history):
    """Test handling a user response"""
    print("\n3️⃣  Testing response handling...")
    
    try:
        user_response = "I have 6 years of backend development experience with Python and Node.js. I've built microservices using containerization and orchestration tools."
        
        print(f"   User response: '{user_response}'")
        print("\n   Calling Hugging Face /gradio_handle_response...")
        
        result = client.predict(
            response=user_response,
            api_name="/gradio_handle_response"
        )
        
        ai_response = result[0]
        print("\n✅ Response handled successfully!")
        print(f"\n   Response length: {len(ai_response)} characters")
        print(f"\n   AI response (first 500 chars):")
        print("   " + "-" * 60)
        print("   " + ai_response[:500])
        print("   " + "-" * 60)
        
        return ai_response
        
    except Exception as e:
        print(f"❌ Response handling failed: {e}")
        return None

def main():
    """Run all tests"""
    print("\n")
    
    # Test 1: Connection
    client = test_hf_connection()
    if not client:
        print("\n❌ Cannot proceed without HuggingFace connection")
        return False
    
    # Test 2: Start interview
    conversation, job_desc = test_start_interview(client)
    if not conversation:
        print("\n❌ Cannot proceed without successful interview start")
        return False
    
    # Test 3: Handle response
    ai_response = test_handle_response(client, conversation)
    if not ai_response:
        print("\n❌ Cannot proceed without successful response handling")
        return False
    
    # Success!
    print("\n" + "=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    print("\nThe Hugging Face AI Interviewer model is working correctly!")
    print("Ready to integrate into the main website.")
    print("\nNext steps:")
    print("1. Start Flask AI service: cd backend/ai_service && python app.py")
    print("2. Start Express backend: cd backend && npm run dev")
    print("3. Start React frontend: cd frontend && npm start")
    print("4. Go to: http://localhost:3000/interview")
    print("\n")
    
    return True

if __name__ == '__main__':
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️ Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
