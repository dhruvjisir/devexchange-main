import { smtpConfig } from './smtp-config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': import.meta.env.VITE_BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: 'StartupBazzar',
          email: options.from || smtpConfig.defaultFrom,
        },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
        replyTo: {
          email: options.replyTo || smtpConfig.defaultReplyTo,
          name: 'StartupBazzar Support',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  return await sendEmail({
    to,
    subject: 'Verify your StartupBazzar account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  return await sendEmail({
    to,
    subject: 'Reset your StartupBazzar password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </div>
    `,
  });
}; 