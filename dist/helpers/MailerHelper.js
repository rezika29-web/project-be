"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailerHelper = exports.MailerHelper = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const axios_1 = __importDefault(require("axios"));
const AllConfig_1 = __importDefault(require("../config/AllConfig"));
class MailerHelper {
    sendMail(recipient, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const transportData = {
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: AllConfig_1.default.envy.MAILER_USER,
                    pass: AllConfig_1.default.envy.MAILER_PASSWORD,
                },
            };
            const transporter = nodemailer_1.default.createTransport(transportData);
            console.log("transportData", transportData);
            const mailOptions = {
                from: AllConfig_1.default.envy.MAILER_USER,
                to: recipient,
                subject,
                html: message,
            };
            console.log("Mailer", `mengirim email ke ${recipient}`);
            try {
                // Mengirim email
                const info = yield transporter.sendMail(mailOptions);
                console.log("Email terkirim", info.messageId);
                return true;
            }
            catch (error) {
                console.error("Gagal mengirim email", error);
                return false;
            }
        });
    }
    sendTelegram(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Telegram message", message);
            try {
                const apiUrl = `https://api.telegram.org/bot${AllConfig_1.default.envy.TELEGRAM_BOT_TOKEN}/sendMessage`;
                const response = yield axios_1.default.post(apiUrl, {
                    chat_id: AllConfig_1.default.envy.TELEGRAM_GROUP_CHAT_ID,
                    text: message,
                    parse_mode: "HTML",
                });
                console.log('Telegram response', response.data);
            }
            catch (error) {
                console.error('Telegram error', error);
            }
        });
    }
}
exports.MailerHelper = MailerHelper;
exports.mailerHelper = new MailerHelper();
