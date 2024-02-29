const db = require('../models');
const Rdv = db.rdv;
const User = db.user;
const mail = require('../utils/mailer');
const sender = process.env.MAIL_USER;
const sendReminder = async() => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const rdvs = await Rdv.find().where('dateheuredebut').gte(now).lt(new Date(now.valueOf() + 24 * 60 * 60 * 1000));
    for(let i = 0; i< rdvs.length ; i++){
        const clientId = rdvs[i].idClient();
        const client = await User.findById(clientId);
        if(client){
            mail.emailSender(sender,client.mail,'Rappel de rendez vous','Vous avez un rendez vous à '+rdvs.dateheuredebut.toISOSString().split('T')[1]);
        } 
    }
}

module.exports = {
    sendReminder
}