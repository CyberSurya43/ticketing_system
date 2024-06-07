from sqlalchemy import create_engine, Column, Integer, Sequence, String, LargeBinary, Date, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('postgresql://postgres:postgres@localhost:5432/ticketingSystemDB')
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()


class UserDetails(Base):
    __tablename__ = 'userDetails'
    emp_id = Column(Integer, Sequence('id', start=1000, increment=1), primary_key=True)
    email = Column(String(50), nullable=False)
    name = Column(String(50), nullable=False)
    dept_id = Column(Integer, ForeignKey('deptDetails.dept_id'))
    profile_pic = Column(LargeBinary)
    created_date = Column(Date)
    updated_date = Column(Date)

    def make_json(self):
        return {
            'emp_id': self.emp_id,
            'email': self.email,
            'name': self.name,
            'dept_id': self.dept_id,
            'created_date': self.created_date,
            'updated_date': self.updated_date
        }


class TicketDetails(Base):
    __tablename__ = 'ticketDetails'
    ticket_id = Column(Integer, Sequence('id', start=10000, increment=1), primary_key=True)
    p_ticket_id = Column(Integer)
    emp_id = Column(Integer, nullable=False)
    subject = Column(String(30), nullable=False)
    descr = Column(String(100), nullable=False)
    status = Column(String(10), nullable=False)
    dept_id = Column(Integer, ForeignKey('deptDetails.dept_id'), nullable=False)
    agent_id = Column(Integer, ForeignKey('userDetails.emp_id'))
    raise_date = Column(Date, nullable=False)
    update_date = Column(Date, nullable=False)

    def make_json(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class DeptDetails(Base):
    __tablename__ = 'deptDetails'
    dept_id = Column(Integer, primary_key=True)
    dept_name = Column(String(30), nullable=False)


class ImgDetails(Base):
    __tablename__ = 'imgDetails'
    img_id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey('ticketDetails.ticket_id'))
    img = Column(LargeBinary, nullable=False)
