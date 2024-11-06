const nodemailer = require("nodemailer")

const transportData = {
  host: "smtp.gmail.com",
  // port: 587,
  // secure: false,
  port: 465,
  secure: true,
  auth: {
    user: "sibaru@pu.go.id",
    pass: "123Pnp456housing",
  },
}
const transporter = nodemailer.createTransport(transportData)

console.log("transportData", transportData)

const recipient = "f.anaturdasa@gmail.com"

const mailOptions = {
  from: "sibaru@pu.go.id",
  to: recipient,
  subject: 'test',
  html: "pesan <b>saya</b>",
}

console.log("Mailer", `mengirim email ke ${recipient}`)

  // Mengirim email
  transporter.sendMail(mailOptions).then(() => {
    console.log("Email terkirim: ", info.messageId)
  }).catch((error) => {
    console.error("Gagal mengirim email: ", error)
  })