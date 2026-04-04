import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject: 'Reset your Vigne password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8f5ef;border-radius:16px;">
        <h1 style="font-family:Georgia,serif;color:#11430F;font-size:28px;margin-bottom:8px;">Reset your password</h1>
        <p style="color:#555;line-height:1.6;margin-bottom:24px;">
          We received a request to reset the password for your Vigne account.
          Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}"
          style="display:inline-block;background:#11430F;color:#e4f386;padding:14px 28px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">
          Reset Password
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
