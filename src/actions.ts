"use server";
import { Resend } from 'resend';
import { ImproveEmailTemplate } from './components/ui/improve-email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export const submitForm = async (form: FormData) => {
    const { name, email, message } = {
        name: form.get("name") as string,
        email: form.get("email") as string,
        message: "Settled App: " + form.get("message") as string
    }
    try {
        const { error } = await resend.emails.send({
            from: 'Settled App <settled@parthmanhas.com>',
            to: ['parthmanhas@gmail.com'],
            subject: 'From Settled App',
            react: ImproveEmailTemplate({ name, email, message }),
        });
        if (error) {
            throw new Error('Failed to send email');
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}