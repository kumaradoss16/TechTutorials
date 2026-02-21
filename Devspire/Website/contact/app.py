from flask import Flask, request, jsonify
import smtplib, ssl
import requests

app = Flask(__name__)

YOUR_EMAIL = "techtutorials.website@gmail.com"
YOUR_APP_PASSWORD = "Pyg@me2020"

@app.route("index.html", methods=['POST'])

def contact():
    data = request.get_json()

    name = data.get("name", "")
    email = data.get("email", "")
    message = data.get("message", "")

    if not all([name, email, message]):
        return jsonify({'success': False, 'error': 'All fields required.'})
    
    subject = f"Message from {name} <{email}>"
    email_message = f"Subject: {subject}\n\n{message}"

    try: 
        contect = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(YOUR_EMAIL, YOUR_APP_PASSWORD)
            server.sendmail(YOUR_EMAIL, YOUR_EMAIL, email_message)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Mail error: {str(e)}'})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)



