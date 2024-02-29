const nodemailer = require('nodemailer');
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASSWORD;

//transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass
    }
});

//sendEmail
const emailSender = (sender, receiver, subject , content) => {
    let mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        text: content
    };
    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            throw error;
        } 
    });
}

module.exports = {
    transporter,
    emailSender
}

