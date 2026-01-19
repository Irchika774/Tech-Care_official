import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import {
    Gift,
    Star,
    Award,
    Sparkles,
    TrendingUp,
    Clock,
    CheckCircle,
    Crown,
    Zap,
    Heart,
    Loader2
} from 'lucide-react';
import CurrencyDisplay from './CurrencyDisplay';

/**
 * LoyaltyPoints Component
 * Displays user's loyalty points, tier status, and available rewards
 * 
 * Props:
 * - userId: User ID to fetch loyalty data
 * - compact: Show compact version
 */
const LoyaltyPoints = ({ userId, compact = false }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [loyalty, setLoyalty] = useState({
        points: 0,
        tier: 'bronze',
        totalEarned: 0,
        totalRedeemed: 0,
        pointsToNextTier: 500,
        history: []
    });
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [redeeming, setRedeeming] = useState(false);

    // Tier configurations
    const tiers = {
        bronze: {
            name: 'Bronze',
            minPoints: 0,
            maxPoints: 499,
            color: 'text-amber-600',
            bgColor: 'bg-amber-500/20',
            icon: Award,
            multiplier: 1,
            benefits: ['1 point per LKR 100 spent', 'Basic rewards access']
        },
        silver: {
            name: 'Silver',
            minPoints: 500,
            maxPoints: 1499,
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/20',
            icon: Star,
            multiplier: 1.25,
            benefits: ['1.25x points multiplier', 'Priority support', 'Exclusive discounts']
        },
        gold: {
            name: 'Gold',
            minPoints: 1500,
            maxPoints: 4999,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            icon: Crown,
            multiplier: 1.5,
            benefits: ['1.5x points multiplier', 'Free diagnostics', 'Birthday bonus']
        },
        platinum: {
            name: 'Platinum',
            minPoints: 5000,
            maxPoints: Infinity,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20',
            icon: Sparkles,
            multiplier: 2,
            benefits: ['2x points multiplier', 'VIP support', 'Free pickup/delivery', 'Exclusive events']
        }
    };

    // Available rewards
    const rewards = [
        { id: 1, name: '10% Off Next Repair', points: 100, type: 'discount', value: 10 },
        { id: 2, name: '20% Off Next Repair', points: 200, type: 'discount', value: 20 },
        { id: 3, name: 'Free Screen Protector', points: 150, type: 'gift', value: 500 },
        { id: 4, name: 'Free Diagnostics', points: 75, type: 'service', value: 0 },
        { id: 5, name: 'Priority Booking', points: 50, type: 'service', value: 0 },
        { id: 6, name: 'LKR 500 Credit', points: 250, type: 'credit', value: 500 },
        { id: 7, name: 'LKR 1000 Credit', points: 450, type: 'credit', value: 1000 },
        { id: 8, name: 'Free Express Service', points: 300, type: 'service', value: 0 }
    ];

    // Fetch loyalty data
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchLoyaltyData = async () => {
            try {
                // Try to fetch from profiles or customers table
                const { data: profile } = await supabase
                    .from('customers')
                    .select('loyalty_points, loyalty_tier, total_bookings')
                    .eq('user_id', userId)
                    .single();

                if (profile) {
                    const points = profile.loyalty_points || 0;
                    const tier = calculateTier(points);
                    const nextTier = getNextTier(tier);

                    setLoyalty({
                        points: points,
                        tier: tier,
                        totalEarned: points + (profile.totalRedeemed || 0),
                        totalRedeemed: 0,
                        pointsToNextTier: nextTier ? (tiers[nextTier].minPoints - points) : 0,
                        nextTierName: nextTier ? tiers[nextTier].name : null
                    });
                }
            } catch (error) {
                console.error('Error fetching loyalty data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLoyaltyData();
    }, [userId]);

    // Calculate tier based on points
    const calculateTier = (points) => {
        if (points >= 5000) return 'platinum';
        if (points >= 1500) return 'gold';
        if (points >= 500) return 'silver';
        return 'bronze';
    };

    // Get next tier
    const getNextTier = (currentTier) => {
        const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
        const currentIndex = tierOrder.indexOf(currentTier);
        return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
    };

    // Calculate progress to next tier
    const calculateProgress = () => {
        const currentTierConfig = tiers[loyalty.tier];
        const nextTier = getNextTier(loyalty.tier);

        if (!nextTier) return 100;

        const tierRange = tiers[nextTier].minPoints - currentTierConfig.minPoints;
        const progress = ((loyalty.points - currentTierConfig.minPoints) / tierRange) * 100;
        return Math.min(100, Math.max(0, progress));
    };

    // Redeem reward
    const redeemReward = async (reward) => {
        if (loyalty.points < reward.points) {
            toast({
                title: "Insufficient points",
                description: `You need ${reward.points - loyalty.points} more points for this reward.`,
                variant: "destructive"
            });
            return;
        }

        setRedeeming(true);
        try {
            // Update points in database
            const newPoints = loyalty.points - reward.points;

            const { error } = await supabase
                .from('customers')
                .update({ loyalty_points: newPoints })
                .eq('id', userId);

            if (error) throw error;

            setLoyalty(prev => ({
                ...prev,
                points: newPoints,
                totalRedeemed: prev.totalRedeemed + reward.points,
                tier: calculateTier(newPoints)
            }));

            toast({
                title: "Reward redeemed!",
                description: `You've successfully redeemed: ${reward.name}`,
            });
        } catch (error) {
            toast({
                title: "Redemption failed",
                description: "Could not redeem the reward. Please try again.",
                variant: "destructive"
            });
        } finally {
            setRedeeming(false);
        }
    };

    const currentTierConfig = tiers[loyalty.tier];
    const TierIcon = currentTierConfig.icon;

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-6 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </CardContent>
            </Card>
        );
    }

    // Compact version for dashboard widgets
    if (compact) {
        return (
            <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                <div className={`p-4 ${currentTierConfig.bgColor}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-black/20`}>
                                <TierIcon className={`h-5 w-5 ${currentTierConfig.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-300">Loyalty Points</p>
                                <p className="text-xl font-bold text-white">{loyalty.points.toLocaleString()}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className={`${currentTierConfig.color} border-current`}>
                            {currentTierConfig.name}
                        </Badge>
                    </div>
                </div>
                {loyalty.pointsToNextTier > 0 && (
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-zinc-400">Progress to {loyalty.nextTierName}</span>
                            <span className="text-zinc-300">{loyalty.pointsToNextTier} pts needed</span>
                        </div>
                        <Progress value={calculateProgress()} className="h-2 bg-zinc-800" />
                    </div>
                )}
            </Card>
        );
    }

    // Full version
    return (
        <div className="space-y-6">
            {/* Tier Status Card */}
            <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                <div className={`p-6 ${currentTierConfig.bgColor}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-black/20`}>
                                <TierIcon className={`h-8 w-8 ${currentTierConfig.color}`} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{loyalty.points.toLocaleString()} Points</h2>
                                <p className="text-zinc-300">{currentTierConfig.name} Member</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-zinc-300">Points Multiplier</p>
                            <p className={`text-xl font-bold ${currentTierConfig.color}`}>
                                {currentTierConfig.multiplier}x
                            </p>
                        </div>
                    </div>

                    {/* Progress to next tier */}
                    {loyalty.pointsToNextTier > 0 && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-zinc-300">Progress to {loyalty.nextTierName}</span>
                                <span className="text-white font-medium">
                                    {loyalty.pointsToNextTier} points needed
                                </span>
                            </div>
                            <Progress value={calculateProgress()} className="h-3 bg-black/20" />
                        </div>
                    )}
                </div>

                <CardContent className="p-6">
                    {/* Tier Benefits */}
                    <h3 className="text-white font-semibold mb-3">Your Benefits</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {currentTierConfig.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-zinc-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                {benefit}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Available Rewards */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Gift className="h-5 w-5 text-pink-400" />
                        Available Rewards
                    </CardTitle>
                    <CardDescription>
                        Redeem your points for exclusive rewards
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        {rewards.map((reward) => (
                            <div
                                key={reward.id}
                                className={`p-4 rounded-lg border transition-all ${loyalty.points >= reward.points
                                    ? 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500'
                                    : 'border-zinc-800 opacity-50'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">{reward.name}</h4>
                                        <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                                            <Star className="h-3 w-3 text-yellow-400" />
                                            {reward.points} points
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        disabled={loyalty.points < reward.points || redeeming}
                                        onClick={() => redeemReward(reward)}
                                        className={
                                            loyalty.points >= reward.points
                                                ? 'bg-white text-black hover:bg-gray-200'
                                                : 'bg-zinc-700 text-zinc-400'
                                        }
                                    >
                                        {redeeming ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            'Redeem'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        How to Earn Points
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/50">
                            <div className="p-2 rounded-lg bg-green-500/20">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Book a Service</p>
                                <p className="text-sm text-zinc-400">Earn 1 point per LKR 100 spent</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/50">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <Star className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Leave a Review</p>
                                <p className="text-sm text-zinc-400">Earn 50 bonus points per review</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/50">
                            <div className="p-2 rounded-lg bg-pink-500/20">
                                <Heart className="h-5 w-5 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Refer a Friend</p>
                                <p className="text-sm text-zinc-400">Earn 200 points when they book</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoyaltyPoints;
