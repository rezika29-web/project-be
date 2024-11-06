import nodemailer from "nodemailer"
import axios from "axios"
import config from "../config/AllConfig"

export class MailerHelper {
  async sendMail(
    recipient: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    const transportData = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.envy.MAILER_USER,
        pass: config.envy.MAILER_PASSWORD,
      },
    }
    const transporter = nodemailer.createTransport(transportData)

    console.log("transportData", transportData)

    const mailOptions = {
      from: config.envy.MAILER_USER,
      to: recipient,
      subject,
      html: message,
    }

    console.log("Mailer", `mengirim email ke ${recipient}`)

    try {
      // Mengirim email
      const info = await transporter.sendMail(mailOptions)
      console.log("Email terkirim", info.messageId)
      return true
    } catch (error) {
      console.error("Gagal mengirim email", error)
      return false
    }
  }

  async sendTelegram(message: string) {
    console.log("Telegram message", message)

    try {
      const apiUrl = `https://api.telegram.org/bot${config.envy.TELEGRAM_BOT_TOKEN}/sendMessage`
      const response = await axios.post(apiUrl, {
        chat_id: config.envy.TELEGRAM_GROUP_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      })
      console.log('Telegram response', response.data)
    } catch (error) {
      console.error('Telegram error', error)
    }
  }
}

export const mailerHelper = new MailerHelper()
