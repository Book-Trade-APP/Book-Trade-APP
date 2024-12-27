# from flask import Blueprint, current_app,request, jsonify
# from flask_mail import Message

# test_bp = Blueprint("test", __name__)

# @test_bp.route("/sendEmail", methods=["POST"])
# def send_email():
#     try:
#         data = request.json
#         mail = current_app.extensions.get('mail')
#         subject = data.get("subject")
#         recipients = data.get("recipients")
#         body = data.get("body")
#         if not(mail and subject and recipients and body):
#             return jsonify({
#             "code":400,
#             "message":"bad request",
#             "body":{}
#         }),400
#         message = Message(
#             subject=subject,
#             recipients=recipients,
#             body=body        
#         )
#         mail.send(message)
#         return jsonify({
#             "code":200,
#             "message":"send email successfully",
#             "body":{}
#         }),200
#     except Exception as e:
#         return jsonify({
#             "code":500,
#             "message":f"Fail to send email: {e}",
#             "body":{}
#         }),500    

# from flask import Flask
# from flask_mail import Mail, Message
# import os

# app = Flask(__name__)

# # 配置郵件伺服器
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = "tkuimbooktrade@gmail.com"
# app.config['MAIL_PASSWORD'] = "mynxjwchemlziauu"
# # app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER")

# mail = Mail(app)

# @app.route('/send_email', methods=['POST'])
# def send_email():
#     try:
#         msg = Message(
#             subject="Hello from Flask-Mail",
#             sender="tkuimbooktrade@gmail.com",
#             recipients=["kenny0909362798@gmail.com"],
#             body="This is a test email sent from Flask-Mail."
#         )
#         mail.send(msg)
#         return "Email sent successfully!"
#     except Exception as e:
#         return f"Failed to send email: {e}"

# if __name__ == '__main__':
#     app.run(debug=True)
