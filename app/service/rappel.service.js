const db = require('../models');
const Rdv = db.rdv;
const User = db.user;
const mail = require('../utils/mailer');
const { format } = require('date-fns');
const sender = process.env.MAIL_USER;


const sendReminder = async() => {
    const now = new Date();
    const rdvs = await Rdv.find({status:10,etat:1}).where('dateheuredebut').gte(now).lt(new Date(now.valueOf() + 24 * 60 * 60 * 1000));
    console.log("Rendez-vous",rdvs)
    for(let i = 0; i< rdvs.length ; i++){
        const clientId = rdvs[i].idClient;
        const client = await User.findById(clientId);
        if(client){
            const dateheuredebut = rdvs[i].dateheuredebut;
            const formattedTime = format(dateheuredebut, 'HH:mm');
            const formattedDate = format(dateheuredebut, 'dd/MM/yyyy');
            mail.emailSender(sender,client.mail,'Rappel de rendez vous',`Vous avez un rendez vous à ${formattedTime} le ${formattedDate}`);
        } 
    }
}

module.exports = {
    sendReminder
}