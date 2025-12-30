import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    LogIn, 
    Sparkles,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
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

    const features = [
        { icon: Shield, text: 'Secure 256-bit encryption' },
        { icon: Zap, text: 'Instant access to your account' },
        { icon: CheckCircle, text: 'Track repairs in real-time' }
    ];

    return (
        <div className="bg-black text-white min-h-screen">
            <SEO
                title="Login - TechCare"
                description="Sign in to your TechCare account to manage repairs, bookings, and technician services."
            />

            <section className="relative pt-16 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="hidden lg:block">
                                <Badge className="mb-6 bg-white/10 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Welcome Back
                                </Badge>
                                
                                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                                    Sign in to your<br />
                                    <span className="text-zinc-400">TechCare account</span>
                                </h1>
                                
                                <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                                    Access your dashboard, track repairs, and manage your bookings with ease.
                                </p>

                                <div className="space-y-4">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-white/10">
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-zinc-300">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
                                    <CardHeader className="text-center pb-6 pt-8">
                                        <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center border border-zinc-700">
                                            <LogIn className="h-10 w-10 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                                        <p className="text-zinc-400">
                                            Enter your credentials to continue
                                        </p>
                                    </CardHeader>

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

                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                                                    <Lock className="h-4 w-4 text-zinc-400" />
                                                    Password
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-6 pr-12"
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
                                                        Signing in...
                                                    </div>
                                                ) : (
                                                    <>
                                                        Sign In
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </>
                                                )}
                                            </Button>

                                            <div className="text-center w-full pt-4">
                                                <p className="text-zinc-400">
                                                    Don't have an account?{' '}
                                                    <Link
                                                        to="/register"
                                                        className="text-white font-semibold hover:underline transition-colors"
                                                    >
                                                        Create Account
                                                    </Link>
                                                </p>
                                            </div>

                                            <div className="text-center w-full pt-4 border-t border-zinc-800">
                                                <p className="text-xs text-zinc-500 pt-4">
                                                    By signing in, you agree to our{' '}
                                                    <Link to="/terms" className="text-zinc-400 hover:text-white hover:underline">Terms of Service</Link>
                                                    {' '}and{' '}
                                                    <Link to="/privacy" className="text-zinc-400 hover:text-white hover:underline">Privacy Policy</Link>
                                                </p>
                                            </div>
                                        </CardFooter>
                                    </form>
                                </Card>

                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Secure encryption enabled
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
