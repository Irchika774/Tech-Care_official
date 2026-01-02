import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import {
    Mail,
    ArrowLeft,
    Sparkles,
    Shield,
    CheckCircle,
    Send
} from 'lucide-react';
import SEO from '../components/SEO';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast({
                variant: "destructive",
                title: "Email Required",
                description: "Please enter your email address.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setIsEmailSent(true);
            toast({
                title: "Email Sent",
                description: "Check your inbox for password reset instructions.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to send reset email. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <SEO
                title="Forgot Password - TechCare"
                description="Reset your TechCare account password securely."
            />

            <section className="relative pt-16 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
                            <CardHeader className="text-center pb-6 pt-8">
                                <Badge className="mb-6 bg-white/10 text-white border-white/30 backdrop-blur-sm px-4 py-2 mx-auto">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Password Recovery
                                </Badge>
                                <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center border border-zinc-700">
                                    {isEmailSent ? (
                                        <CheckCircle className="h-10 w-10 text-green-500" />
                                    ) : (
                                        <Shield className="h-10 w-10 text-white" />
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {isEmailSent ? 'Check Your Email' : 'Forgot Password?'}
                                </h2>
                                <p className="text-zinc-400">
                                    {isEmailSent
                                        ? "We've sent you a password reset link"
                                        : "Enter your email and we'll send you a reset link"
                                    }
                                </p>
                            </CardHeader>

                            {!isEmailSent ? (
                                <form onSubmit={handleSubmit}>
                                    <CardContent className="space-y-6 px-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-zinc-400" />
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-6"
                                            />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
                                        <Button
                                            type="submit"
                                            className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-6 text-lg rounded-full transition-all duration-300"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </div>
                                            ) : (
                                                <>
                                                    Send Reset Link
                                                    <Send className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="text-center w-full pt-4">
                                            <Link
                                                to="/login"
                                                className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                Back to Login
                                            </Link>
                                        </div>
                                    </CardFooter>
                                </form>
                            ) : (
                                <CardContent className="px-8 pb-8 text-center">
                                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 mb-6">
                                        <p className="text-zinc-300 mb-2">
                                            We've sent a password reset link to:
                                        </p>
                                        <p className="text-white font-semibold text-lg">
                                            {email}
                                        </p>
                                    </div>

                                    <p className="text-zinc-400 text-sm mb-6">
                                        Didn't receive the email? Check your spam folder or{' '}
                                        <button
                                            onClick={() => setIsEmailSent(false)}
                                            className="text-white hover:underline"
                                        >
                                            try again
                                        </button>
                                    </p>

                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-white hover:text-zinc-300 transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </CardContent>
                            )}
                        </Card>

                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Secure password reset
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;
