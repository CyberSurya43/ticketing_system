from flask import make_response, Blueprint, request, Response
from factory import token_required, create_session
from model.model import UserDetails, DeptDetails
from datetime import datetime

admin = Blueprint('admin', __name__)
session = create_session()


@admin.route('/editStatus/<emp_id>/<role>', methods=['PUT'])
@token_required
def edit_status(email, emp_id, role):
    try:
        if role == "IT Support":
            dept = "Help Desk/IT Support"
        elif role == "Hardware":
            dept = "Help Desk/Hardware"
        elif role == "Food":
            dept = "Help Desk/Food"
        else:
            dept = "User"
        user = session.query(UserDetails).filter_by(emp_id=emp_id).first()
        user.dept_id = session.query(DeptDetails).filter_by(dept_name=dept).first().dept_id
        user.updated_date = datetime.utcnow()
        session.commit()
        return Response("success", 200)
    except Exception as e:
        print(str(e))
        return Response(str(e), 500)


@admin.route('/members/<role>', methods=['GET'])
@token_required
def members(email, role):
    try:
        if role == 'User':
            data = session.query(UserDetails).filter_by(dept_id=201).all()
            res = []
            for d in data:
                res.append(d.make_json())
        elif role == 'Pending':
            data = session.query(UserDetails).filter_by(dept_id=401).all()
            res = []
            for d in data:
                res.append(d.make_json())
        elif role == 'IT Support':
            data = session.query(UserDetails).filter_by(dept_id=301).all()
            res = []
            for d in data:
                res.append(d.make_json())
        elif role == 'Hardware':
            data = session.query(UserDetails).filter_by(dept_id=302).all()
            res = []
            for d in data:
                res.append(d.make_json())
        else:
            data = session.query(UserDetails).filter_by(dept_id=303).all()
            res = []
            for d in data:
                res.append(d.make_json())
        return make_response(res, 200)
    except Exception as e:
        return make_response(str(e), 500)
