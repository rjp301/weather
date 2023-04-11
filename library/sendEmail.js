import fs from "fs/promises";
import path from "path";
import sgMail from "@sendgrid/mail";

export default async function sendEmail(subject, html, testFlag) {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     type: "OAuth2",
  //     user: process.env.EMAIL_USER,
  //     clientId: process.env.OAUTH_CLIENT_ID,
  //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  //   },
  // });

  sgMail.setApiKey(process.env.SG_API_KEY);

  const fname_emails = path.join("data", "emailList.csv");
  const emails = (await fs.readFile(fname_emails, "utf-8"))
    .replace(/\r\n/g, "\n")
    .split("\n");

  const msg = {
    to: testFlag ? "rileypaul96@gmail.com" : emails,
    from: "saeg.weather@gmail.com",
    subject,
    html,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode, "Mail sent with SendGrid");
    })
    .catch((error) => {
      console.error(error);
    });

  // transporter.sendMail(msg, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });
}
