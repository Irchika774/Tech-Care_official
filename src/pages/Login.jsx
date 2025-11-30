import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import SEO from '../components/SEO';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(email, password);
        if (!result.success) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: result.error,
            });
        }
        setIsLoading(false);
    };

    const demoAccounts = [
        { email: 'demo@techcare.com', password: 'password', role: 'Customer' },
        { email: 'tech@techcare.com', password: 'password', role: 'Technician' },
        { email: 'admin@techcare.com', password: 'password', role: 'Admin' }
    ];

    const fillDemo = (account) => {
        setEmail(account.email);
        setPassword(account.password);
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] relative overflow-hidden">
            <SEO
                title="Login - TechCare"
                description="Sign in to your TechCare account to manage repairs, bookings, and technician services."
            />
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"></div>
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                className="w-full max-w-md px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="card-glass shadow-2xl border-2 border-white/20">
                    <CardHeader className="text-center pb-8">
                        <motion.div
                            className="w-20 h-20 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <LogIn className="h-10 w-10 text-white" />
                        </motion.div>
                        <CardTitle className="text-3xl font-bold">
                            <span className="text-gradient">Welcome Back!</span>
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            Sign in to access your TechCare account
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-purple-600" />
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-4 pr-4 py-6 text-base border-2 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-base font-medium flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-purple-600" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-4 pr-12 py-6 text-base border-2 focus:border-purple-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-purple-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Demo Accounts */}
                            <div className="border-t pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Quick Demo Access
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {demoAccounts.map((account, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            onClick={() => fillDemo(account)}
                                            className="px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all hover-lift"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {account.role}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full py-6 text-base gradient-primary hover:opacity-90 transition-all btn-shine font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-5 w-5" />
                                        Sign In
                                    </>
                                )}
                            </Button>

                            <div className="text-center w-full">
                                <p className="text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                </p>
                            </div>

                            <div className="text-center w-full pt-4 border-t">
                                <p className="text-xs text-muted-foreground">
                                    By signing in, you agree to our{' '}
                                    <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
                                </p>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Additional Info */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Secure encryption enabled
                        </span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
