import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const env = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: env.EMAIL_SMTP_SERVER,
  port: env.EMAIL_PORT,
  secure: true,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

class Emailer {

    async sendMail(emailTo, subject, text, html) {

        await transporter.sendMail({
            from: env.EMAIL_FROM,
            to: emailTo,
            subject: subject,
            text: text,
            html: html,
        }).then((info) => {
            console.log(info);
            return info;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });

    }
}


export default Emailer;