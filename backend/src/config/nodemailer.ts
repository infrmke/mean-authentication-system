import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PWD,
  },
  tls: {
    rejectUnauthorized: false, // força o nodemailer a confiar no servidor
  },
})

const verifyConnection = async () => {
  try {
    await transporter.verify()
    console.log('[NODEMAILER] is ready to take messages')
  } catch (error) {
    console.log('\n[NODEMAILER] failed to establish connection:', error.message)
  }
}

const sendEmail = async (mail) => {
  try {
    const info = await transporter.sendMail(mail)
    console.log('[NODEMAILER] sent an e-mail:', info.envelope)
  } catch (error) {
    console.log('\n[NODEMAILER] failed to send e-mail:', error.message)
  }
}

export { verifyConnection, sendEmail }
