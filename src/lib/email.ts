import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, otp: string) {
    const user = process.env.EMAIL_USER;

    // OAuth2 Credentials
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    // App Password Fallback
    const pass = process.env.EMAIL_APP_PASSWORD;

    // Local Test Fallback: Prints to console if no email credentials are set
    if (!user || (!refreshToken && !pass)) {
        console.log('\n\n=========================================');
        console.log(`📧 MOCK EMAIL SENT`);
        console.log(`To: ${email}`);
        console.log(`Subject: Route 60 Carz - Verify your email Address`);
        console.log(`OTP: ${otp}`);
        console.log('---');
        console.log(`To use real emails, please set EMAIL_USER and GOOGLE_REFRESH_TOKEN in .env.local`);
        console.log('=========================================\n\n');
        return true;
    }

    try {
        let authConfig: any;

        if (refreshToken) {
            // Use advanced robust OAuth2 Email Transport
            authConfig = {
                type: 'OAuth2',
                user: user,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken
            };
        } else {
            // Basic authentication using old App Passwords
            authConfig = {
                user: user,
                pass: pass
            };
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: authConfig,
        });

        await transporter.sendMail({
            from: `"Route 60 Carz" <${user}>`,
            to: email,
            subject: 'Verify your email - Route 60 Carz',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #333; margin: 0; font-size: 24px; font-weight: 900;">ROUTE <span style="color: #C6D932;">60</span> CARZ</h2>
                    </div>
                    <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 12px; text-align: center;">
                        <h3 style="margin-top: 0; font-size: 20px; font-weight: normal;">Verify Your Login</h3>
                        <p style="color: #a1a1aa; font-size: 16px; margin-bottom: 20px;">Please use the following One-Time Password (OTP) to verify your email address. It is valid for 15 minutes.</p>
                        
                        <div style="background-color: #18181b; border: 1px solid #3f3f46; padding: 15px 30px; display: inline-block; border-radius: 8px; margin-bottom: 20px;">
                            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #C6D932;">${otp}</span>
                        </div>
                        
                        <p style="color: #71717a; font-size: 14px; margin: 0;">If you did not request this, please ignore this email.</p>
                    </div>
                </div>
            `
        });

        console.log(`📧 Actual verification email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('Failed to send verification email:', error);
        return false;
    }
}
