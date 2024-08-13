import nodemailer from "nodemailer"
import { mail, mailPassword } from "../config";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mail,
        pass: mailPassword
    }
})