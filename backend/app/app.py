from app.login import Login
from flask import Flask,render_template, redirect, url_for, request

app = Flask(__name__)

@app.route("/")
def start():
    return redirect(url_for("login"))

@app.route('/login',methods=['POST','GET'])
def login():
    return Login.do_login()
        
@app.route('/main')
def main():
    return render_template('main.html')
        
if __name__ == '__main__':
    app.run(debug=True)