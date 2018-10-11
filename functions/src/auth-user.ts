import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
try { admin.initializeApp() } catch (e) { console.log(e) }
import * as nodemailer from 'nodemailer';
import * as moment from 'moment';

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword
    },
  });

const settings = {timestampsInSnapshots: true};
const db = admin.firestore();
db.settings(settings);

export const createUserRecord = functions.auth
  .user()
  .onCreate((uRecord, context) => {

        // Tracking bug: https://github.com/firebase/firebase-functions/issues/217
        const userRecord = uRecord;
        const userUid = userRecord.uid;
        const email = userRecord.email;
        const displayName = userRecord.displayName;
        const photoUrl = userRecord.photoURL;
        const phoneNumber = userRecord.phoneNumber;
        const emailVerified = userRecord.emailVerified;
        const onCreateDate = context.timestamp;

        const creationTime = moment(context.timestamp);
        const year = creationTime.format('YYYY');
        const month = creationTime.format('MM');
        const day = creationTime.format('DD');


        return admin.auth().getUser(userUid).then(user => {

        const provider = user.providerData !== [] ? user.providerData[0] : {
            providerId: email ? 'password' : 'phone',
            uid: userUid,
            email: email ? email :'Unregistered Email',
            displayName: displayName ? displayName : 'Unregistered Name',
            photoURL: photoUrl ? photoUrl : 'https://angularfirebase.com/images/logo.png',
            phoneNumber: phoneNumber ? phoneNumber : 'Unregistered Phone'
        };

        const providerId = provider.providerId ? provider.providerId.replace('.com', '') : provider.providerId;
        const providerUserId = provider.uid ? provider.uid : userUid;
        const providerEmail = provider.email ? provider.email : 'Unregistered Email';
        const providerDisplayName = provider.displayName ? provider.displayName : 'Unregistered Name';
        const providerPhotoUrl = provider.photoURL ? provider.photoURL : 'https://angularfirebase.com/images/logo.png';
        const providerPhone = provider.phoneNumber ? provider.phoneNumber : 'Unregistered Phone';

        const providerRef = db.doc(`providers/${userUid}`);

        // Tracking bug: https://github.com/firebase/firebase-functions/issues/217
        console.log('Event user data', userRecord);
        console.log('Auth user data', user);

        let promises = [];

        if (provider) {
            console.log('Auth user providerId:', providerId);
            promises.push(
                providerRef.set({
                    uid: userUid,
                    uidProvider: providerUserId,
                    email: providerEmail,
                    displayName: providerDisplayName,
                    photoUrl: providerPhotoUrl,
                    phoneNumber: providerPhone,
                    providerId:  providerId,
                    emailVerified: emailVerified,
                    creationDate: onCreateDate
                })
            )
        }

        if (providerId) {
            promises.push(
              admin.database()
                .ref(`/provider_count/${providerId}`)
                .transaction(current => (current || 0) + 1)
            )
          }

        const dayCount = admin.database().ref(`/user_registrations_per_day/${year}/${month}/${day}`).transaction(current => (current || 0) + 1);

        const monthCount = admin.database()
          .ref(`/user_registrations_per_month/${year}/${month}`)
          .transaction(current => (current || 0) + 1)
    
        const usersCount = admin.database()
          .ref(`/users_count`)
          .transaction(current => (current || 0) + 1)
    
        promises.push(dayCount, monthCount, usersCount)


        if (email && emailVerified) {
            const mailOptions = {
              from: `"GuateDev" <${gmailEmail}>`,
              to: email,
              subject: `Welcome to App Maker Developers!`,
              text: `Hey ${displayName || ''}!, Welcome to App Maker Developers. I hope you will enjoy the service.`
            }
            promises.push(mailTransport.sendMail(mailOptions))
        }

        return Promise.all(promises)
    });
});
