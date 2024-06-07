from io import BytesIO
from flask import make_response, Blueprint, request, Response, jsonify
from flask_cors import cross_origin
from sqlalchemy import desc
from model.model import UserDetails, TicketDetails, ImgDetails
from factory import create_session, token_required
from datetime import datetime
from email.message import EmailMessage
from config import config
from factory import create_mail_session

ticket = Blueprint('ticket', __name__)
session = create_session()


@ticket.route('/user/newTicket', methods=['POST'])
@token_required
def new_ticket(email):
    try:
        emp_id = request.form['emp_id']
        category = request.form['category']
        subject = request.form['subject']
        descr = request.form['descr']
        file = None
        try:
            file = request.files['file']
        except Exception:
            pass
        d_id = None
        if category == 'IT Support':
            d_id = 301
        elif category == 'Hardware':
            d_id = 302
        elif category == 'Food':
            d_id = 303
        agent_id = session.query(UserDetails).filter_by(dept_id=d_id).first()
        newTicket = TicketDetails(
            emp_id=emp_id,
            subject=subject,
            descr=descr,
            status="open",
            dept_id=d_id,
            agent_id=agent_id.emp_id,
            raise_date=datetime.utcnow(),
            update_date=datetime.utcnow()
        )
        session.add(newTicket)
        session.commit()
        try:
            msg = EmailMessage()
            text = f'Your ticket is risen to {category}'
            msg.set_content(text)
            msg['SUBJECT'] = "Ticket Risen"
            msg['FROM'] = config.EMAIL
            msg['TO'] = email
            sess = create_mail_session()
            sess.send_message(msg)
            msg.clear()
            text = 'A new ticket is risen'
            msg.set_content(text)
            msg['SUBJECT'] = "Ticket Risen"
            msg['FROM'] = config.EMAIL
            msg['TO'] = agent_id.email
            sess.send_message(msg)
        except Exception as e:
            print(str(e))
            pass
        if file:
            t_id = session.query(TicketDetails).filter_by(emp_id=newTicket.emp_id).filter_by(
                raise_date=newTicket.raise_date).first()
            image_data = file.read()
            image = ImgDetails(ticket_id=t_id.ticket_id, img=image_data)
            session.add(image)
            session.commit()
        return make_response(jsonify({'message': 'ticket created'}), 200)
    except Exception as e:
        return Response(str(e), 500)


@ticket.route('/getTicket/<status>', methods=['GET'])
@token_required
def get_ticket(email, status):
    try:
        emp_data = session.query(UserDetails).filter_by(email=email).first()
        emp_id = emp_data.emp_id
        emp_dept = emp_data.dept_id
        if emp_dept == 101:
            data = (session.query(TicketDetails)
                    .filter_by(status=status)
                    .order_by(desc(TicketDetails.update_date))
                    .all())
        elif emp_dept == 201:
            data = (session.query(TicketDetails)
                    .filter_by(emp_id=emp_id)
                    .filter_by(status=status)
                    .order_by(desc(TicketDetails.update_date))
                    .all())
        else:
            data = (session.query(TicketDetails)
                    .filter_by(agent_id=emp_id)
                    .filter_by(dept_id=emp_dept)
                    .filter_by(status=status)
                    .order_by(desc(TicketDetails.update_date))
                    .all())
        res = []
        for d in data:
            res.append(d.make_json())
        return make_response(res, 200)
    except Exception as e:
        return Response(str(e), 500)


@ticket.route('/getTicketCount', methods=['GET'])
@token_required
def get_ticket_count(email):
    try:
        data = session.query(UserDetails).filter_by(email=email).first()
        if data.dept_id == 101:
            openCount = (session.query(TicketDetails)
                         .filter_by(status='open')
                         .count())
            processCount = (session.query(TicketDetails)
                            .filter_by(status='process')
                            .count())
            onHoldCount = (session.query(TicketDetails)
                           .filter_by(status='on hold')
                           .count())
            closedCount = (session.query(TicketDetails)
                           .filter_by(status='closed')
                           .count())
            reOpenCount = (session.query(TicketDetails)
                           .filter_by(status='re-open')
                           .count())
            ItCount = (session.query(TicketDetails)
                       .filter_by(dept_id=301)
                       .count())
            HardwareCount = (session.query(TicketDetails)
                             .filter_by(dept_id=302)
                             .count())
            FoodCount = (session.query(TicketDetails)
                         .filter_by(dept_id=303)
                         .count())
        elif data.dept_id == 201:
            openCount = (session.query(TicketDetails)
                         .filter_by(emp_id=data.emp_id)
                         .filter_by(status='open')
                         .count())
            processCount = (session.query(TicketDetails)
                            .filter_by(emp_id=data.emp_id)
                            .filter_by(status='process')
                            .count())
            onHoldCount = (session.query(TicketDetails)
                           .filter_by(emp_id=data.emp_id)
                           .filter_by(status='on hold')
                           .count())
            closedCount = (session.query(TicketDetails)
                           .filter_by(emp_id=data.emp_id)
                           .filter_by(status='closed')
                           .count())
            reOpenCount = (session.query(TicketDetails)
                           .filter_by(emp_id=data.emp_id)
                           .filter_by(status='re-open')
                           .count())
            ItCount = (session.query(TicketDetails)
                       .filter_by(emp_id=data.emp_id)
                       .filter_by(dept_id=301)
                       .count())
            HardwareCount = (session.query(TicketDetails)
                             .filter_by(emp_id=data.emp_id)
                             .filter_by(dept_id=302)
                             .count())
            FoodCount = (session.query(TicketDetails)
                         .filter_by(emp_id=data.emp_id)
                         .filter_by(dept_id=303)
                         .count())
        else:
            openCount = (session.query(TicketDetails)
                         .filter_by(agent_id=data.emp_id)
                         .filter_by(status='open')
                         .count())
            processCount = (session.query(TicketDetails)
                            .filter_by(agent_id=data.emp_id)
                            .filter_by(status='process')
                            .count())
            onHoldCount = (session.query(TicketDetails)
                           .filter_by(agent_id=data.emp_id)
                           .filter_by(status='on hold')
                           .count())
            closedCount = (session.query(TicketDetails)
                           .filter_by(agent_id=data.emp_id)
                           .filter_by(status='closed')
                           .count())
            reOpenCount = (session.query(TicketDetails)
                           .filter_by(agent_id=data.emp_id)
                           .filter_by(status='re-open')
                           .count())
            res = {
                'openCount': openCount,
                'processCount': processCount,
                'onHoldCount': onHoldCount,
                'closedCount': closedCount,
                'reOpenCount': reOpenCount
            }
            return make_response(res, 200)
        res = {
            'openCount': openCount,
            'processCount': processCount,
            'onHoldCount': onHoldCount,
            'closedCount': closedCount,
            'reOpenCount': reOpenCount,
            'ItCount': ItCount,
            'HardwareCount': HardwareCount,
            'FoodCount': FoodCount
        }
        return make_response(res, 200)
    except Exception as e:
        return Response(str(e), 500)


@ticket.route('/changeStatus', methods=['PUT'])
@cross_origin(origins="*", allow_headers="*")
@token_required
def change_status(email):
    try:
        data = request.get_json()
        ticket_ = session.query(TicketDetails).filter_by(ticket_id=data['ticket_id']).first()
        ticket_.status = data['status']
        ticket_.update_date = datetime.utcnow()
        try:
            msg = EmailMessage()
            if data['status'] == 'process':
                sub = "Ticket is on process"
                text = "Your ticket is on under process. It will be resolved soon"
            elif data['status'] == 'on hold':
                sub = "Ticket is on hold"
                text = "Your ticket is on hold. It will be resolved soon"
            else:
                sub = "Ticket is closed"
                text = "Your ticket is closed"
            msg.set_content(text)
            msg['SUBJECT'] = sub
            msg['FROM'] = config.EMAIL
            msg['TO'] = session.query(UserDetails).filter_by(emp_id=ticket_.emp_id).first().email
            sess = create_mail_session()
            sess.send_message(msg)
        except Exception as e:
            print(str(e))
            pass
        session.commit()
        return Response("success", 200)
    except Exception as e:
        return Response(str(e), 500)


@ticket.route('/getTicketImg/<ticket_id>', methods=['GET'])
@token_required
def get_ticket_img(email, ticket_id):
    try:
        pic = session.query(ImgDetails).filter_by(ticket_id=ticket_id).first()
        if pic:
            data = BytesIO(pic.img)
            return Response(data, mimetype='image/jpeg')
        else:
            return Response('content not found', 204)
    except Exception as e:
        return Response(str(e), 500)


@ticket.route('/getTicketDetail/<ticket_id>', methods=['GET'])
@token_required
def get_ticket_detail(email, ticket_id):
    try:
        data = session.query(TicketDetails).filter_by(ticket_id=ticket_id).first()
        res = data.make_json()
        return make_response(res, 200)
    except Exception as e:
        return Response(str(e), 500)


@ticket.route('/reopenTicket', methods=['POST'])
@token_required
def re_open_ticket(email):
    try:
        ticket_id = request.form['ticket_id']
        subject = request.form['subject']
        descr = request.form['descr']
        file = None
        try:
            file = request.files['file']
        except Exception as e:
            pass
        old_ticket = session.query(TicketDetails).filter_by(ticket_id=ticket_id).first()
        new_ticket_ = TicketDetails(
            emp_id=old_ticket.emp_id,
            p_ticket_id=old_ticket.ticket_id,
            subject=subject,
            descr=descr,
            status="re-open",
            dept_id=old_ticket.dept_id,
            agent_id=old_ticket.agent_id,
            raise_date=datetime.utcnow(),
            update_date=datetime.utcnow()
        )
        session.add(new_ticket_)
        session.commit()
        if old_ticket.dept_id == 301:
            dept = "IT Support"
        elif old_ticket.dept_id == 302:
            dept = "Hardware Support"
        else:
            dept = "Food Support"
        agent_email = session.query(UserDetails).filter_by(emp_id=old_ticket.agent_id).first().email
        try:
            msg = EmailMessage()
            text = f'your ticket is re-opened to {dept}'
            msg.set_content(text)
            msg['SUBJECT'] = "Ticket Re-Opened"
            msg['FROM'] = config.EMAIL
            msg['TO'] = email
            sess = create_mail_session()
            sess.send_message(msg)
            sess.close()
            msg.clear()
            text = 'A ticket is re-opened with a update'
            msg.set_content(text)
            msg['SUBJECT'] = "Ticket Re-Opened"
            msg['FROM'] = config.EMAIL
            msg['TO'] = agent_email
            sess = create_mail_session()
            sess.send_message(msg)
        except Exception as e:
            pass
        if file:
            t_id = session.query(TicketDetails).filter_by(emp_id=new_ticket_.emp_id).filter_by(
                raise_date=new_ticket_.raise_date).order_by(desc(TicketDetails.ticket_id)).first()
            image_data = file.read()
            image = ImgDetails(ticket_id=t_id.ticket_id, img=image_data)
            session.add(image)
            session.commit()
        return Response("ticket created", 200)
    except Exception as e:
        return Response(str(e), 500)


@ticket.route('/recentTickets', methods=['GET'])
@token_required
def recent_ticket(email):
    try:
        user = session.query(UserDetails).filter_by(email=email).first()
        if user.dept_id == 101:
            recent_ticket_ = (session.query(TicketDetails)
                              .order_by(desc(TicketDetails.update_date))
                              .limit(5)
                              .all())
            res = []
            for t in recent_ticket_:
                res.append(t.make_json())
            return make_response(res, 200)
        elif user.dept_id == 201:
            recent_ticket_ = (session.query(TicketDetails)
                              .filter_by(emp_id=user.emp_id)
                              .order_by(desc(TicketDetails.update_date))
                              .limit(5)
                              .all())
            res = []
            for t in recent_ticket_:
                res.append(t.make_json())
            return make_response(res, 200)
        else:
            recent_ticket_ = (session.query(TicketDetails)
                              .filter_by(agent_id=user.emp_id)
                              .order_by(desc(TicketDetails.update_date))
                              .limit(5)
                              .all())
            res = []
            for t in recent_ticket_:
                res.append(t.make_json())
            return make_response(res, 200)
    except Exception as e:
        return Response(str(e), 500)
