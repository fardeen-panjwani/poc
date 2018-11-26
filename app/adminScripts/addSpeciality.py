import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate("ServiceAccountKey.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

newSpeciality = raw_input('name of speciality: ');
print('adding {} to database...'.format(newSpeciality))

doc_ref = db.collection('specialities')
doc_ref.add({
    'value': u'{}'.format(newSpeciality)
});
print('{} has been successfully added to the database!'.format(newSpeciality))
