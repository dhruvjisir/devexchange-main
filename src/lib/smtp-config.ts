export const smtpConfig = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: import.meta.env.VITE_SMTP_USER,
    pass: import.meta.env.VITE_SMTP_PASSWORD,
  },
  defaultFrom: import.meta.env.VITE_SMTP_FROM_EMAIL || 'noreply@yourdomain.com',
  defaultReplyTo: import.meta.env.VITE_SMTP_REPLY_TO || 'startupbazzarhelp@gmail.com',
}; 