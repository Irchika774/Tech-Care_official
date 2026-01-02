import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import {
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    Shield,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import SEO from '../components/SEO';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user has a valid recovery session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsValidSession(!!session);
            setCheckingSession(false);
        };
        checkSession();

        // Listen for auth changes (when user clicks the reset link)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsValidSession(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast({
                variant: "destructive",
                title: "Password Too Short",
                description: "Password must be at least 6 characters long.",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords Don't Match",
                description: "Please make sure both passwords are the same.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setIsReset(true);
            toast({
                title: "Password Updated",
                description: "Your password has been successfully reset.",
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to reset password. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingSession) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="mt-4 text-zinc-400">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!isValidSession && !isReset) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <Card className="bg-zinc-900 border-zinc-800 max-w-md mx-4">
                    <CardContent className="text-center py-12 px-8">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 mx-auto mb-6 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
                        <p className="text-zinc-400 mb-6">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Button
                            onClick={() => navigate('/forgot-password')}
                            className="bg-white text-black hover:bg-gray-100"
                        >
                            Request New Link
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <SEO
                title="Reset Password - TechCare"
                description="Create a new password for your TechCare account."
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
                                    Reset Password
                                </Badge>
                                <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center border border-zinc-700">
                                    {isReset ? (
                                        <CheckCircle className="h-10 w-10 text-green-500" />
                                    ) : (
                                        <Lock className="h-10 w-10 text-white" />
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {isReset ? 'Password Reset!' : 'Create New Password'}
                                </h2>
                                <p className="text-zinc-400">
                                    {isReset
                                        ? "Redirecting you to login..."
                                        : "Enter your new password below"
                                    }
                                </p>
                            </CardHeader>

                            {!isReset ? (
                                <form onSubmit={handleSubmit}>
                                    <CardContent className="space-y-6 px-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                                                <Lock className="h-4 w-4 text-zinc-400" />
                                                New Password
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    minLength={6}
                                                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-6 pr-12"
                                                    placeholder="At least 6 characters"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-white flex items-center gap-2">
                                                <Lock className="h-4 w-4 text-zinc-400" />
                                                Confirm Password
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-6 pr-12"
                                                    placeholder="Confirm your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
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
                                                    Updating...
                                                </div>
                                            ) : (
                                                <>
                                                    Reset Password
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </form>
                            ) : (
                                <CardContent className="px-8 pb-8 text-center">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <p className="text-green-400 font-medium">
                                            Your password has been successfully reset!
                                        </p>
                                    </div>

                                    <p className="text-zinc-400 text-sm">
                                        You will be redirected to the login page in a few seconds...
                                    </p>
                                </CardContent>
                            )}
                        </Card>

                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Secure password update
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;
