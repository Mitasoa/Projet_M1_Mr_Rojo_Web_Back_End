var admin = require("firebase-admin");

var serviceAccount = require("./key.json");
var db = require("../models");
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY_TOKEN;
var Device = db.device;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}); 
// Construct a notification message
module.exports = async ( title, body) => {
    const devicePushToken = await Device.find({});
    for(let i = 0; i< devicePushToken.length; i++){
        jwt.verify(devicePushToken[i].auth_token, SECRET_KEY, async(err, decoded) => {
            if (err) {
              console.error('Erreur de vérification du JWT :', err);
            } else {
                try{
                    await admin.messaging().send({
                            token: devicePushToken[i].token_registration,
                            notification: {
                                title,
                                body 
                            }
                        })
                    }
                catch(error){
                }
            }
          });
    }
}