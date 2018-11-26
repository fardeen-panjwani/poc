import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate("ServiceAccountKey.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

docName = raw_input('new doctor name: ')
docSpec = raw_input('new doctor\'s speciality: ')
print('adding {}({}) to the database...'.format(docName, docSpec))

docRef = db.collection(u"doctors")
docRef.add({
    u'name': u'{}'.format(docName), 
    u'speciality': u'{}'.format(docSpec)
})
print('successfully added {}({})'.format(docName, docSpec))