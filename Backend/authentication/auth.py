from flask import make_response, Blueprint, request, Response
from flask_cors import cross_origin
from sqlalchemy import select
from model.model import UserDetails, DeptDetails
from factory import create_session, token_required
import base64
from factory import validate_access_token, tokengen, download_image
from datetime import datetime

auth = Blueprint('auth', __name__)

session = create_session()


@auth.route('/login', methods=['POST'])
@cross_origin(origins="*", allow_headers="*")
def login():
    if request.method == 'POST':
        res = request.get_json()
        if validate_access_token(res['token']) == 200:
            _token = tokengen(res['email'])
            data = session.query(UserDetails).filter_by(email=res['email']).first()
            if data is None:
                newData = UserDetails(
                    email=res['email'],
                    name=res['name'],
                    dept_id=401,
                    profile_pic=base64.b64encode(download_image(res['profile_pic'])),
                    created_date=datetime.utcnow(),
                    updated_date=datetime.utcnow()
                )
                session.add(newData)
                session.commit()
                data = session.query(UserDetails).filter_by(email=res['email']).first()
            stmt = (select(DeptDetails.dept_name, UserDetails.emp_id,
                           UserDetails.email, UserDetails.name)
                    .select_from(DeptDetails).join(UserDetails)
                    .filter_by(email=res['email'])
                    .filter_by(dept_id=data.dept_id))
            response = session.execute(stmt)
            result = response.fetchall()[0]
            resp = {
                'dept': result[0],
                'emp_id': result[1],
                'email': result[2],
                'name': result[3],
                'token': _token
            }
            return make_response(resp, 200)
        return Response('Invalid token', 401)
    return Response('Method not allowed', 405)


@auth.route('/img', methods=['GET'])
@token_required
def img(user):
    data = session.query(UserDetails).filter_by(email=user).first()
    pic = base64.b64decode(data.profile_pic)
    return Response(pic, content_type='image/jpeg')
