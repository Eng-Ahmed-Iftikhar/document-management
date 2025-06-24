import nodemailer from "nodemailer";
import env from "./env";

// Create a test account or replace with real credentials.
const nodemailerTransport = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.smtp.user, // SMTP username
    pass: env.smtp.pass, // SMTP password
  },
});


// send a email

export const sendNoReplayEmail = async (to:string, subject:string, html:string) => {
    try {
        const info = await nodemailerTransport.sendMail({
        from: `"No Reply" <${env.smtp.user}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
        
        });
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export const sendEmail = async (to:string, subject:string, html:string) => {
    try {
        const info = await nodemailerTransport.sendMail({
            from: `"Dee watsica" <${env.smtp.user}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}