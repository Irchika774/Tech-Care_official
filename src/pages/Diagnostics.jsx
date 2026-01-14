import { useNavigate } from 'react-router-dom';
import AIDiagnostics from '../components/AIDiagnostics';
import SEO from '../components/SEO';
import { Badge } from '../components/ui/badge';
import { Bot, Sparkles, Shield, Clock, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

/**
 * Diagnostics Page - No white space, compact layout
 */
const Diagnostics = () => {
    const navigate = useNavigate();

    const handleDiagnosisComplete = (diagnosis) => {
        navigate('/schedule', {
            state: {
                diagnosis: diagnosis,
                estimatedCost: diagnosis.totalCost,
                service: diagnosis.primary.issue,
                deviceType: diagnosis.deviceType // Pass device type if available
            }
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="AI Device Diagnostics - TechCare"
                description="Get instant AI-powered diagnosis for your device issues. Free, accurate, and instant repair estimates in LKR."
                keywords="AI diagnostics, device repair, troubleshooting, repair estimate, Sri Lanka"
            />

            {/* Main Content - No padding gaps */}
            <section className="bg-gradient-to-b from-purple-900/20 via-black to-black">
                <div className="container mx-auto px-4 py-6">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                            <Bot className="w-3 h-3 mr-1" />
                            AI Powered
                        </Badge>
                        <h1 className="text-2xl md:text-3xl font-bold">AI Device Diagnostics</h1>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-400">
                                <Zap className="h-3 w-3 text-yellow-400" /> Instant
                            </span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-400">
                                <Sparkles className="h-3 w-3 text-purple-400" /> 95% Accuracy
                            </span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-400">
                                <Shield className="h-3 w-3 text-green-400" /> Free
                            </span>
                        </div>
                    </div>

                    {/* AI Diagnostics Component - Full Width */}
                    <div className="max-w-3xl mx-auto">
                        <AIDiagnostics onComplete={handleDiagnosisComplete} />
                    </div>
                </div>
            </section>

            {/* FAQ & CTA - Minimal spacing */}
            <section className="py-6 border-t border-zinc-800 bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <h3 className="font-medium mb-1 text-sm">How accurate?</h3>
                            <p className="text-zinc-500 text-xs">95% accuracy for common issues.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <h3 className="font-medium mb-1 text-sm">Is it free?</h3>
                            <p className="text-zinc-500 text-xs">100% free AI diagnosis.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <h3 className="font-medium mb-1 text-sm">Currency?</h3>
                            <p className="text-zinc-500 text-xs">All prices in LKR.</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/technicians')}
                                className="gap-2 w-full"
                                size="sm"
                            >
                                Find Technicians
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Diagnostics;
