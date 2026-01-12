import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
    UserPlus,
    Sparkles,
    User,
    Shield,
    Wrench,
    ArrowRight,
    CheckCircle,
    Users,
    Star
} from 'lucide-react';
import SEO from '../components/SEO';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('user');
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate(user.role === 'technician' ? '/technician-dashboard' : '/customer-dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Passwords do not match",
            });
            return;
        }

        try {
            setIsLoading(true);
            const result = await register(name, email, password, role);

            if (!result.success) {
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Registration Successful!",
                    description: "Please login with your new credentials.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        { icon: CheckCircle, text: 'Access to verified technicians' },
        { icon: Shield, text: 'Secure & protected transactions' },
        { icon: Star, text: 'Quality guaranteed services' }
    ];

    const accountTypes = [
        {
            value: 'user',
            icon: Users,
            title: 'Customer',
            description: 'Book repairs and track services'
        },
        {
            value: 'technician',
            icon: Wrench,
            title: 'Technician',
            description: 'Offer services and grow your business'
        }
    ];

    return (
        <div className="bg-black text-white min-h-screen">
            <SEO
                title="Register - TechCare"
                description="Create a new TechCare account. Join as a customer to book repairs or as a technician to offer your services."
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
                                    Join TechCare
                                </Badge>

                                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                                    Create your<br />
                                    <span className="text-zinc-400">free account</span>
                                </h1>

                                <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                                    Join thousands of satisfied customers and expert technicians on our platform.
                                </p>

                                <div className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-white/10">
                                                <benefit.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-zinc-300">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="w-10 h-10 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-zinc-400" />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">10,000+</div>
                                            <div className="text-sm text-zinc-400">Users joined</div>
                                        </div>
                                    </div>
                                    <p className="text-zinc-400 text-sm">
                                        "TechCare made finding a reliable technician so easy. Highly recommended!"
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
                                    <CardHeader className="text-center pb-4 pt-8">
                                        <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center border border-zinc-700">
                                            <UserPlus className="h-10 w-10 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                                        <p className="text-zinc-400">
                                            Fill in the details to get started
                                        </p>
                                    </CardHeader>

                                    <form onSubmit={handleSubmit}>
                                        <CardContent className="space-y-5 px-8">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-white">Account Type</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {accountTypes.map((type) => (
                                                        <button
                                                            key={type.value}
                                                            type="button"
                                                            onClick={() => setRole(type.value)}
                                                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${role === type.value
                                                                ? 'border-white bg-white/10'
                                                                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                                                                }`}
                                                        >
                                                            <type.icon className={`w-6 h-6 mb-2 ${role === type.value ? 'text-white' : 'text-zinc-400'}`} />
                                                            <div className={`font-semibold ${role === type.value ? 'text-white' : 'text-zinc-300'}`}>
                                                                {type.title}
                                                            </div>
                                                            <div className="text-xs text-zinc-500 mt-1">{type.description}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium text-white flex items-center gap-2">
                                                    <User className="h-4 w-4 text-zinc-400" />
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-5"
                                                />
                                            </div>

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
                                                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-5"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-5 pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                                        >
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-white flex items-center gap-2">
                                                        <Lock className="h-4 w-4 text-zinc-400" />
                                                        Confirm
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="confirmPassword"
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white/50 py-5 pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
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
                                                        Creating Account...
                                                    </div>
                                                ) : (
                                                    <>
                                                        Create Account
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </>
                                                )}
                                            </Button>

                                            <div className="text-center w-full pt-4">
                                                <p className="text-zinc-400">
                                                    Already have an account?{' '}
                                                    <Link
                                                        to="/login"
                                                        className="text-white font-semibold hover:underline transition-colors"
                                                    >
                                                        Sign In
                                                    </Link>
                                                </p>
                                            </div>

                                            <div className="text-center w-full pt-4 border-t border-zinc-800">
                                                <p className="text-xs text-zinc-500 pt-4">
                                                    By creating an account, you agree to our{' '}
                                                    <Link to="/terms" className="text-zinc-400 hover:text-white hover:underline">Terms of Service</Link>
                                                    {' '}and{' '}
                                                    <Link to="/privacy" className="text-zinc-400 hover:text-white hover:underline">Privacy Policy</Link>
                                                </p>
                                            </div>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;
