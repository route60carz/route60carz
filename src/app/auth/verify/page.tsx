import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md text-center">
                <div className="auth-card">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
                    <p className="text-secondary mb-6">
                        We&apos;ve sent a verification link to your email address.
                        Please check your inbox and click the link to activate your account.
                    </p>
                    <p className="text-secondary text-sm mb-6">
                        Didn&apos;t receive the email? Check your spam folder or try signing up again.
                    </p>
                    <Link href="/auth/login" className="auth-btn-primary inline-block px-8">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
