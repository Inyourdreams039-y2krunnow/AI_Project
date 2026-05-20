import requests

# Your verified Key
API_KEY = "AIzaSyDXgjK-EyhdAmmYFIrM5ZgEIYw74xdqBOk"

# Using the EXACT name from your 'Secret Menu' list
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={API_KEY}"
headers = {'Content-Type': 'application/json'}

data = {
    "contents": [{
        "parts": [{"text": "If you can hear me, say 'The Slate is Clean!'"}]
    }]
}

print("--- CONNECTING TO GEMINI 3.1 (LATEST STABLE) ---")

try:
    response = requests.post(url, headers=headers, json=data)
    result = response.json()
    
    if 'candidates' in result:
        answer = result['candidates'][0]['content']['parts'][0]['text']
        print("SUCCESS!")
        print("-" * 30)
        print("AI RESPONSE:", answer)
        print("-" * 30)
    else:
        # This will tell us if there's a quota issue
        print("GOOGLE ERROR:")
        print(result.get('error', {}).get('message', result))
        
except Exception as e:
    print("PYTHON ERROR:", e)

print("--- TASK FINISHED ---")
