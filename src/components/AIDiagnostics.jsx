import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import {
    Bot,
    Send,
    User,
    Smartphone,
    Monitor,
    Tablet,
    Loader2,
    Cpu,
    Battery,
    Wifi,
    Camera,
    Volume2,
    Zap,
    Droplet,
    ThermometerSun,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    Sparkles,
    RefreshCw
} from 'lucide-react';

/**
 * AI Diagnostics Chatbot Component
 * Provides AI-powered device diagnostics through a conversational interface
 */
const AIDiagnostics = ({ onComplete, deviceType: initialDeviceType }) => {
    const { toast } = useToast();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [step, setStep] = useState('welcome'); // welcome, device, symptoms, diagnosis, estimate
    const [deviceType, setDeviceType] = useState(initialDeviceType || null);
    const [symptoms, setSymptoms] = useState([]);
    const [diagnosis, setDiagnosis] = useState(null);

    // Common symptoms by category
    const symptomCategories = {
        screen: [
            { id: 'cracked_screen', label: 'Cracked/Broken Screen', icon: Smartphone },
            { id: 'display_issues', label: 'Display flickering/lines', icon: Monitor },
            { id: 'touch_issues', label: 'Touch not responsive', icon: Tablet },
            { id: 'black_screen', label: 'Black/blank screen', icon: Monitor },
        ],
        battery: [
            { id: 'fast_drain', label: 'Battery drains fast', icon: Battery },
            { id: 'not_charging', label: 'Won\'t charge', icon: Zap },
            { id: 'swollen_battery', label: 'Battery swollen', icon: AlertTriangle },
            { id: 'overheating', label: 'Overheating', icon: ThermometerSun },
        ],
        hardware: [
            { id: 'speaker_issues', label: 'Speaker/audio problems', icon: Volume2 },
            { id: 'camera_issues', label: 'Camera not working', icon: Camera },
            { id: 'wifi_issues', label: 'WiFi/Bluetooth issues', icon: Wifi },
            { id: 'water_damage', label: 'Water damage', icon: Droplet },
        ],
        software: [
            { id: 'slow_performance', label: 'Slow/lagging', icon: Cpu },
            { id: 'crash_restart', label: 'Crashing/restarting', icon: RefreshCw },
            { id: 'wont_boot', label: 'Won\'t turn on', icon: Zap },
            { id: 'storage_full', label: 'Storage issues', icon: Cpu },
        ]
    };

    // Diagnosis database (AI simulation)
    const diagnosisDatabase = {
        cracked_screen: {
            issue: 'Screen Replacement Required',
            description: 'Your device screen is physically damaged and needs replacement.',
            severity: 'moderate',
            estimatedCost: { min: 3500, max: 15000 },
            repairTime: '1-2 hours',
            tips: ['Avoid pressing on cracked areas', 'Use screen protector to prevent further damage']
        },
        display_issues: {
            issue: 'Display/LCD Issue',
            description: 'The LCD or display panel has internal damage or connector issues.',
            severity: 'moderate',
            estimatedCost: { min: 4000, max: 12000 },
            repairTime: '1-3 hours',
            tips: ['Could be connector issue (cheaper fix)', 'May require full display replacement']
        },
        not_charging: {
            issue: 'Charging Port Problem',
            description: 'The charging port may be damaged, dirty, or have a loose connection.',
            severity: 'low',
            estimatedCost: { min: 1500, max: 5000 },
            repairTime: '30 mins - 1 hour',
            tips: ['Try cleaning the port gently', 'Test with different cable first']
        },
        fast_drain: {
            issue: 'Battery Replacement Needed',
            description: 'Your battery has degraded and needs replacement for optimal performance.',
            severity: 'low',
            estimatedCost: { min: 2000, max: 6000 },
            repairTime: '30 mins - 1 hour',
            tips: ['Check battery health in settings', 'Reduce background app refresh']
        },
        water_damage: {
            issue: 'Water Damage Repair',
            description: 'Water damage requires immediate professional cleaning and repair.',
            severity: 'critical',
            estimatedCost: { min: 5000, max: 25000 },
            repairTime: '2-5 days',
            tips: ['DO NOT turn on the device', 'DO NOT charge it', 'Bring to repair immediately']
        },
        overheating: {
            issue: 'Thermal System Issue',
            description: 'The device is overheating due to battery, processor, or ventilation issues.',
            severity: 'high',
            estimatedCost: { min: 2000, max: 8000 },
            repairTime: '1-2 hours',
            tips: ['Stop using immediately if very hot', 'Could indicate battery issue']
        },
        slow_performance: {
            issue: 'Performance Optimization',
            description: 'Device needs software optimization or hardware upgrade.',
            severity: 'low',
            estimatedCost: { min: 1000, max: 3000 },
            repairTime: '1-2 hours',
            tips: ['Clear cache and unused apps', 'Consider storage upgrade']
        },
        wont_boot: {
            issue: 'Boot/Motherboard Issue',
            description: 'Device has a critical issue preventing startup. Could be motherboard or software.',
            severity: 'critical',
            estimatedCost: { min: 3000, max: 20000 },
            repairTime: '1-3 days',
            tips: ['Try force restart first', 'May need professional diagnosis']
        }
    };

    // Initialize with welcome message
    useEffect(() => {
        setTimeout(() => {
            addBotMessage(
                "👋 Hi! I'm TechCare AI, your device diagnostic assistant. I'll help identify issues with your device and provide repair estimates.\n\nWhat type of device are you having trouble with?",
                'device_select'
            );
        }, 500);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Add bot message
    const addBotMessage = (content, action = null) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                content,
                action,
                timestamp: new Date()
            }]);
            setIsTyping(false);
        }, 500 + Math.random() * 500);
    };

    // Add user message
    const addUserMessage = (content) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'user',
            content,
            timestamp: new Date()
        }]);
    };

    // Handle device selection
    const handleDeviceSelect = (type) => {
        setDeviceType(type);
        addUserMessage(`I need help with my ${type}`);
        setStep('symptoms');

        setTimeout(() => {
            addBotMessage(
                `Got it! Let's diagnose your ${type}. 🔍\n\nPlease select all the symptoms you're experiencing:`,
                'symptom_select'
            );
        }, 300);
    };

    // Handle symptom toggle
    const handleSymptomToggle = (symptomId) => {
        setSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(s => s !== symptomId)
                : [...prev, symptomId]
        );
    };

    // Analyze symptoms and generate diagnosis
    const analyzeDiagnosis = () => {
        if (symptoms.length === 0) {
            toast({
                title: "Please select symptoms",
                description: "Select at least one symptom to get a diagnosis.",
                variant: "destructive"
            });
            return;
        }

        addUserMessage(`I'm experiencing: ${symptoms.map(s => {
            for (const cat of Object.values(symptomCategories)) {
                const found = cat.find(item => item.id === s);
                if (found) return found.label;
            }
            return s;
        }).join(', ')}`);

        setStep('analyzing');
        setIsTyping(true);

        // Simulate AI analysis
        setTimeout(() => {
            // Get most severe issue
            const diagnoses = symptoms
                .map(s => diagnosisDatabase[s])
                .filter(Boolean)
                .sort((a, b) => {
                    const severityOrder = { critical: 3, high: 2, moderate: 1, low: 0 };
                    return severityOrder[b.severity] - severityOrder[a.severity];
                });

            if (diagnoses.length === 0) {
                addBotMessage(
                    "I need more information to diagnose this issue. Could you describe the problem in more detail?",
                    'text_input'
                );
                return;
            }

            const primaryDiagnosis = diagnoses[0];
            const totalMinCost = diagnoses.reduce((sum, d) => sum + d.estimatedCost.min, 0);
            const totalMaxCost = diagnoses.reduce((sum, d) => sum + d.estimatedCost.max, 0);

            setDiagnosis({
                primary: primaryDiagnosis,
                all: diagnoses,
                totalCost: { min: totalMinCost, max: totalMaxCost }
            });

            setStep('diagnosis');
            setIsTyping(false);

            addBotMessage(
                `Based on your symptoms, here's my diagnosis:`,
                'show_diagnosis'
            );
        }, 2000);
    };

    // Handle text input
    const handleSend = () => {
        if (!input.trim()) return;

        addUserMessage(input);
        setInput('');

        // Simple keyword matching for free-form input
        const lowerInput = input.toLowerCase();

        setTimeout(() => {
            if (lowerInput.includes('screen') || lowerInput.includes('display')) {
                handleSymptomToggle('display_issues');
                addBotMessage("I see you're having display issues. Let me add that to the symptoms.");
            } else if (lowerInput.includes('battery') || lowerInput.includes('charge')) {
                handleSymptomToggle('not_charging');
                addBotMessage("Battery/charging issues noted. What else is happening?");
            } else {
                addBotMessage(
                    "I understand. Please use the symptom selector below to help me better diagnose your issue.",
                    'symptom_select'
                );
            }
        }, 500);
    };

    // Reset chat
    const resetChat = () => {
        setMessages([]);
        setStep('welcome');
        setDeviceType(null);
        setSymptoms([]);
        setDiagnosis(null);

        setTimeout(() => {
            addBotMessage(
                "👋 Let's start fresh! What type of device are you having trouble with?",
                'device_select'
            );
        }, 300);
    };

    // Get severity badge color
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-green-500/20 text-green-400 border-green-500/30';
        }
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800 max-w-2xl mx-auto h-[550px] flex flex-col">
            <CardHeader className="border-b border-zinc-800 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        TechCare AI Diagnostics
                        <Badge variant="outline" className="ml-2 border-green-500/50 text-green-400">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Powered
                        </Badge>
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetChat}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reset
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                                ? 'bg-blue-500'
                                : 'bg-gradient-to-br from-green-500 to-blue-500'
                                }`}>
                                {message.type === 'user' ? (
                                    <User className="h-4 w-4 text-white" />
                                ) : (
                                    <Bot className="h-4 w-4 text-white" />
                                )}
                            </div>
                            <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''
                                }`}>
                                <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-800 text-zinc-100'
                                    }`}>
                                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Device Selection */}
                    {step === 'welcome' && messages.some(m => m.action === 'device_select') && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {[
                                { type: 'smartphone', label: 'Smartphone', icon: Smartphone },
                                { type: 'laptop', label: 'Laptop/PC', icon: Monitor },
                                { type: 'tablet', label: 'Tablet', icon: Tablet },
                            ].map(device => (
                                <button
                                    key={device.type}
                                    onClick={() => handleDeviceSelect(device.type)}
                                    className="p-4 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500 transition-all flex flex-col items-center gap-2"
                                >
                                    <device.icon className="h-8 w-8 text-green-400" />
                                    <span className="text-sm font-medium">{device.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Symptom Selection */}
                    {step === 'symptoms' && (
                        <div className="mt-4 space-y-4">
                            {Object.entries(symptomCategories).map(([category, items]) => (
                                <div key={category}>
                                    <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-2 capitalize">
                                        {category} Issues
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {items.map(symptom => (
                                            <button
                                                key={symptom.id}
                                                onClick={() => handleSymptomToggle(symptom.id)}
                                                className={`p-3 rounded-lg border text-left text-sm transition-all flex items-center gap-2 ${symptoms.includes(symptom.id)
                                                    ? 'bg-green-500/20 border-green-500 text-green-400'
                                                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500'
                                                    }`}
                                            >
                                                <symptom.icon className="h-4 w-4 flex-shrink-0" />
                                                {symptom.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <Button
                                onClick={analyzeDiagnosis}
                                disabled={symptoms.length === 0}
                                className="w-full bg-green-600 hover:bg-green-700 mt-4"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Analyze & Diagnose
                            </Button>
                        </div>
                    )}

                    {/* Diagnosis Results */}
                    {step === 'diagnosis' && diagnosis && (
                        <div className="mt-4 space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-lg">{diagnosis.primary.issue}</h3>
                                    <Badge className={getSeverityColor(diagnosis.primary.severity)}>
                                        {diagnosis.primary.severity.toUpperCase()}
                                    </Badge>
                                </div>
                                <p className="text-zinc-400 text-sm mb-4">
                                    {diagnosis.primary.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-zinc-900">
                                        <div className="text-xs text-zinc-500 mb-1">Estimated Cost</div>
                                        <div className="font-bold text-green-400">
                                            LKR {Math.abs(diagnosis.totalCost.min).toLocaleString()} - {Math.abs(diagnosis.totalCost.max).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-zinc-900">
                                        <div className="text-xs text-zinc-500 mb-1">Repair Time</div>
                                        <div className="font-bold text-blue-400">
                                            {diagnosis.primary.repairTime}
                                        </div>
                                    </div>
                                </div>

                                {diagnosis.primary.tips && (
                                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                        <div className="text-xs text-yellow-400 font-medium mb-2">💡 Tips</div>
                                        <ul className="text-sm text-zinc-300 space-y-1">
                                            {diagnosis.primary.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => onComplete?.(diagnosis)}
                                    className="flex-1 bg-white text-black hover:bg-gray-200"
                                >
                                    Book Repair Now
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={resetChat}
                                    className="border-zinc-700"
                                >
                                    Start Over
                                </Button>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-zinc-800 p-4 flex-shrink-0">
                    <div className="flex gap-3">
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Describe your issue..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AIDiagnostics;
