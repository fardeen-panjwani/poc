import getpass

import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate("ServiceAccountKey.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

_email = raw_input('email: ')
_password = getpass.getpass('password(hidden): ')
print('creating user...')

user = auth.create_user(email=_email, password=_password)
print('Sucessfully created new user: {0}'.format(user.uid))
