import base64
import io
import os
from PIL import Image
from flask import make_response, Blueprint, request, Response
from factory import token_required, create_session
from model.model import UserDetails

edit_profile_view = Blueprint('editProfile', __name__)
session = create_session()


@edit_profile_view.route('/editProfile/<status>', methods=['PUT'])
@token_required
def edit_profile(email, status):
    try:
        data = session.query(UserDetails).filter_by(email=email).first()
        if status == 'remove':
            curr_path = os.path.dirname(os.path.abspath(__file__))
            image_path = os.path.join(curr_path, '../static/person.jpg')
            image = Image.open(image_path)
            print("img")
            with io.BytesIO() as byte_io:
                image.save(byte_io, format='JPEG')
                image_bytes = byte_io.getvalue()
            data.profile_pic = base64.b64encode(image_bytes)
            session.commit()
            return Response("success", 200)
        file = request.files['file']
        data.profile_pic = base64.b64encode(file.read())
        print(type(data.profile_pic))
        session.commit()
        return Response("success", 200)
    except Exception as e:
        return make_response(str(e), 500)
