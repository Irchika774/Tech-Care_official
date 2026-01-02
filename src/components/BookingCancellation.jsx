import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import {
    AlertTriangle,
    X,
    Calendar,
    Clock,
    AlertCircle,
    Loader2,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import CurrencyDisplay from './CurrencyDisplay';

/**
 * BookingCancellation Component
 * Handles booking cancellation with reason selection and refund processing
 * 
 * Props:
 * - booking: Booking data object
 * - onSuccess: Callback when cancellation is successful
 * - onClose: Callback to close the modal/page
 */
const BookingCancellation = ({
    booking,
    onSuccess,
    onClose
}) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1); // 1: Reason, 2: Confirm, 3: Success
    const [reason, setReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [refundAmount, setRefundAmount] = useState(0);

    // Cancellation reasons
    const cancellationReasons = [
        { value: 'change_of_plans', label: 'Change of plans', icon: Calendar },
        { value: 'found_alternative', label: 'Found alternative service', icon: AlertCircle },
        { value: 'scheduling_conflict', label: 'Scheduling conflict', icon: Clock },
        { value: 'device_not_needed', label: 'Device no longer needs repair', icon: CheckCircle },
        { value: 'too_expensive', label: 'Price too high', icon: AlertTriangle },
        { value: 'other', label: 'Other reason', icon: AlertCircle }
    ];

    // Calculate refund based on cancellation policy
    const calculateRefund = () => {
        if (!booking?.estimated_cost) return 0;

        const bookingDate = new Date(booking.scheduled_date);
        const now = new Date();
        const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

        // Refund policy:
        // - More than 24 hours before: 100% refund
        // - 12-24 hours before: 50% refund
        // - Less than 12 hours: No refund
        if (hoursUntilBooking > 24) {
            return booking.estimated_cost;
        } else if (hoursUntilBooking > 12) {
            return booking.estimated_cost * 0.5;
        }
        return 0;
    };

    // Get cancellation policy text
    const getCancellationPolicy = () => {
        const bookingDate = new Date(booking?.scheduled_date);
        const now = new Date();
        const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

        if (hoursUntilBooking > 24) {
            return {
                text: 'Full refund available',
                description: 'You are cancelling more than 24 hours before the scheduled time.',
                color: 'text-green-400',
                bgColor: 'bg-green-500/20'
            };
        } else if (hoursUntilBooking > 12) {
            return {
                text: '50% refund available',
                description: 'You are cancelling between 12-24 hours before the scheduled time.',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-500/20'
            };
        }
        return {
            text: 'No refund available',
            description: 'You are cancelling less than 12 hours before the scheduled time.',
            color: 'text-red-400',
            bgColor: 'bg-red-500/20'
        };
    };

    // Handle proceeding to confirmation
    const handleProceed = () => {
        if (!reason) {
            toast({
                title: "Please select a reason",
                description: "We need to know why you're cancelling to improve our service.",
                variant: "destructive"
            });
            return;
        }

        if (reason === 'other' && !otherReason.trim()) {
            toast({
                title: "Please provide a reason",
                description: "Please describe why you're cancelling.",
                variant: "destructive"
            });
            return;
        }

        setRefundAmount(calculateRefund());
        setStep(2);
    };

    // Handle cancellation
    const handleCancel = async () => {
        setLoading(true);
        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            const cancelReason = reason === 'other' ? otherReason :
                cancellationReasons.find(r => r.value === reason)?.label;

            // Update booking status to cancelled
            const { error } = await supabase
                .from('bookings')
                .update({
                    status: 'cancelled',
                    cancellation_reason: cancelReason,
                    cancelled_at: new Date().toISOString(),
                    refund_amount: refundAmount
                })
                .eq('id', booking.id);

            if (error) throw error;

            // If there was a payment, initiate refund (would integrate with Stripe)
            if (refundAmount > 0 && booking.payment_intent_id) {
                // This would call your backend to process the Stripe refund
                await fetch('/api/payment/refund', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        payment_intent_id: booking.payment_intent_id,
                        amount: refundAmount,
                        booking_id: booking.id
                    })
                });
            }

            setStep(3);
            onSuccess?.();

            toast({
                title: "Booking cancelled",
                description: refundAmount > 0
                    ? `Your refund of LKR ${refundAmount.toLocaleString()} will be processed within 5-7 business days.`
                    : "Your booking has been cancelled.",
            });
        } catch (error) {
            console.error('Cancellation error:', error);
            toast({
                title: "Cancellation failed",
                description: error.message || "Could not cancel the booking. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const policy = getCancellationPolicy();

    return (
        <Card className="bg-zinc-900 border-zinc-800 max-w-lg mx-auto">
            <CardHeader className="border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    {step > 1 && step < 3 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setStep(step - 1)}
                            className="text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            {step === 3 ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            )}
                            {step === 3 ? 'Booking Cancelled' : 'Cancel Booking'}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && 'Please let us know why you need to cancel'}
                            {step === 2 && 'Review your cancellation details'}
                            {step === 3 && 'Your cancellation has been processed'}
                        </CardDescription>
                    </div>
                </div>
                {onClose && step !== 3 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </CardHeader>

            <CardContent className="p-6">
                {/* Step 1: Select Reason */}
                {step === 1 && (
                    <div className="space-y-6">
                        {/* Booking Summary */}
                        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-zinc-500">Service</p>
                                    <p className="text-white font-medium">
                                        {booking?.service_type || 'Device Repair'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-500">Device</p>
                                    <p className="text-white font-medium">
                                        {booking?.device_brand} {booking?.device_model}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-500">Scheduled</p>
                                    <p className="text-white font-medium">
                                        {booking?.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString() : 'TBD'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-500">Amount</p>
                                    <p className="text-white font-medium">
                                        <CurrencyDisplay amount={booking?.estimated_cost || 0} currency="LKR" />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Policy Notice */}
                        <div className={`p-4 rounded-lg ${policy.bgColor} border border-zinc-700`}>
                            <div className="flex items-start gap-3">
                                <AlertCircle className={`h-5 w-5 ${policy.color} mt-0.5`} />
                                <div>
                                    <p className={`font-medium ${policy.color}`}>{policy.text}</p>
                                    <p className="text-sm text-zinc-400 mt-1">{policy.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reason Selection */}
                        <div className="space-y-3">
                            <Label className="text-white">Why are you cancelling?</Label>
                            <RadioGroup value={reason} onValueChange={setReason}>
                                <div className="space-y-2">
                                    {cancellationReasons.map((item) => (
                                        <div
                                            key={item.value}
                                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${reason === item.value
                                                ? 'border-white bg-zinc-800'
                                                : 'border-zinc-700 hover:border-zinc-500'
                                                }`}
                                            onClick={() => setReason(item.value)}
                                        >
                                            <RadioGroupItem value={item.value} id={item.value} />
                                            <item.icon className="h-4 w-4 text-zinc-400" />
                                            <Label htmlFor={item.value} className="cursor-pointer text-white">
                                                {item.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>

                            {reason === 'other' && (
                                <Textarea
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    placeholder="Please describe your reason..."
                                    className="bg-zinc-800 border-zinc-700 text-white mt-3"
                                    rows={3}
                                />
                            )}
                        </div>

                        <Button
                            onClick={handleProceed}
                            className="w-full bg-red-500 hover:bg-red-600 text-white"
                        >
                            Continue to Cancel
                        </Button>
                    </div>
                )}

                {/* Step 2: Confirmation */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-400">Are you sure?</p>
                                    <p className="text-sm text-zinc-400 mt-1">
                                        This action cannot be undone. Your booking will be permanently cancelled.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Refund Summary */}
                        <div className="space-y-3">
                            <Label className="text-zinc-400">Cancellation Summary</Label>
                            <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Original Amount</span>
                                    <span className="text-white">
                                        <CurrencyDisplay amount={booking?.estimated_cost || 0} currency="LKR" />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Cancellation Fee</span>
                                    <span className="text-white">
                                        <CurrencyDisplay
                                            amount={(booking?.estimated_cost || 0) - refundAmount}
                                            currency="LKR"
                                        />
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-zinc-700">
                                    <span className="text-white font-medium">Refund Amount</span>
                                    <span className="text-green-400 font-bold">
                                        <CurrencyDisplay amount={refundAmount} currency="LKR" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="flex-1 border-zinc-700"
                            >
                                Go Back
                            </Button>
                            <Button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    'Confirm Cancellation'
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="space-y-6 text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white">Booking Cancelled</h3>
                            <p className="text-zinc-400 mt-2">
                                Your booking has been successfully cancelled.
                            </p>
                        </div>

                        {refundAmount > 0 && (
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                <p className="text-green-400 font-medium">
                                    Refund of <CurrencyDisplay amount={refundAmount} currency="LKR" /> initiated
                                </p>
                                <p className="text-sm text-zinc-400 mt-1">
                                    This will be credited to your original payment method within 5-7 business days.
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={onClose}
                            className="w-full bg-white text-black hover:bg-gray-200"
                        >
                            Close
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BookingCancellation;
