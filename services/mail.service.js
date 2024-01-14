import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const forgetPasswordEmailTemplatePath = `./public/email-templates/forgetPassword.html`;
const confirmRegistrationEmailTemplatePath = `./public/email-templates/registration.html`;

const mailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

async function sendEmail(mailOptions) {
  // create transporter
  const transporter = nodemailer.createTransport(mailConfig);

  // send email
  await transporter.sendMail(mailOptions);
}

export async function formForgetPasswordEmail(resetCode, email, name) {
  let html = fs.readFileSync(forgetPasswordEmailTemplatePath, "utf-8");
  html = html.replace("[resetCode]", resetCode);
  html = html.replace("[username]", name);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    html,
    subject: `Reset Password`,
  };
  await sendEmail(mailOptions);
}

export async function formConfirmRegistrationEmail(email, name, link) {
  let html = fs.readFileSync(confirmRegistrationEmailTemplatePath, "utf-8");
  html = html.replace("[registrationLink]", link);
  html = html.replace("[username]", name);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    html,
    subject: `Confirm Email`,
  };
  await sendEmail(mailOptions);
}
