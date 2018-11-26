import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate("ServiceAccountKey.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

newMessage = raw_input('new message: ')
print('adding \'{}\' to the database...'.format(newMessage))

msgRef = db.collection(u'message')
msgRef.document('gM3oJRSOc5cKfpYwDyfm').update({
    u'value': u'{}'.format(newMessage)
})

print('added \'{}\' to the database!')
