const sgMail = require("@sendgrid/mail")
const sgMailApiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sgMailApiKey)

const sendWelcomeEmail = async(email, name)=>{
    try{
        await sgMail.send({
            to: email,
            from: 'sriprabhu642.sp@gmail.com',
            subject: 'Thanks for joingin in!',
            text: `Welcome to the app, ${name}, let us know how you get along with the application`
        })
    }catch(error){
        throw new Error(error)
    }
    
}

const sendCancellationEmail = async(email, name)=>{
    try{
        await sgMail.send({
            to: email,
            from: 'sriprabhu642.sp@gmail.com',
            subject: 'Sorry to see you go!',
            text: `Goodbye, ${name}. Is there anything we could have done to keep you onboard, please let us know \n I hope to see you back sometime soon`
        })
    }catch(error){
        throw new Error(error)
    }
    
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}