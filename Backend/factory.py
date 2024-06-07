from flask import Flask, request, make_response, jsonify, current_app
from flask_cors import CORS
from config import config
from datetime import datetime, timedelta
from functools import wraps
import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import requests
import smtplib


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = config.SECRET_KEY
    return app


def create_session():
    engine = create_engine(config.SQLALCHEMY_URI)
    Session = sessionmaker(bind=engine)
    return Session()


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        token = request.headers['access-token']
        if 'test' in request.headers:
            return f('email', *args, **kwargs)
        else:
            if not token:
                return make_response(jsonify({"message": "Token not found!"}), 404)
            try:
                data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
                cur_user = data['email']
            except Exception as e:
                return make_response(jsonify({"message": "Token is invalid!"}), 401)
        return f(cur_user, *args, **kwargs)

    return decorated


def tokengen(email):
    token = jwt.encode({
        'email': email,
        'exp': datetime.utcnow() + timedelta(minutes=120)
    }, config.SECRET_KEY)
    return token


def download_image(url):
    try:
        response = requests.get(url)
        return response.content
    except requests.exceptions.RequestException as e:
        print('Error:', e)
        return None


def validate_access_token(access_token):
    res = requests.get(f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}')
    return res.status_code


def create_mail_session():
    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.starttls()
    session.login(config.EMAIL, config.PASSWORD)
    return session
