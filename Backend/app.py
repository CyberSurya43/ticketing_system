from factory import create_app
from authentication import auth
from tickets import tickets
from editProfile import editProfile
from admin import admin

app = create_app()

app.register_blueprint(auth.auth, url_prifix='/auth')
app.register_blueprint(tickets.ticket, url_prifix='/ticket')
app.register_blueprint(editProfile.edit_profile_view, url_prifix='/editProfile')
app.register_blueprint(admin.admin, url_prifix='/admin')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='5000')
