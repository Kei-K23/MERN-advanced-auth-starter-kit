import { MailtrapClient } from 'mailtrap';
import 'dotenv/config';

const TOKEN = process.env.MAILTRAP_TOKEN;

const client = new MailtrapClient({
  token: TOKEN,
  testInboxId: 3588408,
});

const sender = {
  email: 'mern.auth.starter@kit.gmail.com',
  name: 'MERN Auth Starter Kit',
};

export const sendEmail = (subject, html, category, recipients) => {
  client.testing
    .send({
      from: sender,
      to: recipients,
      subject,
      html,
      category,
    })
    .then(console.log, console.error);
};
