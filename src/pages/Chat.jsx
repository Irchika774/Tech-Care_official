import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Send, User, Phone, MessageCircle, Bot, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
    const { bookingId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [recipient, setRecipient] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [isListLoading, setIsListLoading] = useState(false);
    const scrollRef = useRef(null);
    const cleanupRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        if (!bookingId) {
            const fetchConversations = async () => {
                setIsListLoading(true);
                // Sanitize user ID for safety (though Supabase handles this)
                const sanitizedUserId = user.id.replace(/[^a-zA-Z0-9-]/g, '');

                // Fetch recent bookings where the user is involved
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        device_type,
                        status,
                        created_at,
                        customer:customers(id, name, user_id),
                        technician:technicians(id, name, user_id)
                    `)
                    .or(`customer_id.eq.${sanitizedUserId},technician_id.eq.${sanitizedUserId}`)
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (!error) setConversations(data || []);
                setLoading(false);
                setIsListLoading(false);
            };
            fetchConversations();
            return;
        }

        let isMounted = true;
        const channelRef = supabase
            .channel(`booking-chat-${bookingId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
                (payload) => {
                    if (isMounted) {
                        setMessages(prev => [...prev, payload.new]);
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED' && isMounted) {
                    console.log('Chat: Subscribed to realtime messages');
                } else if ((status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') && isMounted) {
                    console.error('Chat: Realtime subscription error');
                }
            });

        const fetchData = async () => {
            // Fetch booking to get participant info
            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    customer:customers(id, name, user_id),
                    technician:technicians(id, name, user_id, phone)
                `)
                .eq('id', bookingId)
                .single();

            if (!bookingError && isMounted) {
                const isCustomer = user.id === booking.customer?.user_id;
                setRecipient(isCustomer ? booking.technician : booking.customer);
            }

            // Fetch existing messages
            const { data: msgs, error: msgsError } = await supabase
                .from('messages')
                .select('*')
                .eq('booking_id', bookingId)
                .order('created_at', { ascending: true });

            if (!msgsError && isMounted) setMessages(msgs || []);
            setLoading(false);
        };

        fetchData();

        // Store channel for cleanup
        cleanupRef.current = () => {
            isMounted = false;
            supabase.removeChannel(channelRef);
        };

        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
            }
        };
    }, [bookingId, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const messageData = {
            booking_id: bookingId,
            sender_id: user.id,
            content: newMessage.trim(),
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('messages').insert([messageData]);
        if (!error) setNewMessage('');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            <div className="text-center">
                <Loader2 className="animate-spin h-12 w-12 text-white mx-auto mb-4" />
                <p className="text-zinc-400">Loading chat...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-120px)] flex flex-col">
                <Card className="flex-1 flex flex-col overflow-hidden bg-zinc-900 border-zinc-800">
                    <CardHeader className="border-b border-zinc-800 bg-zinc-900">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-white">{recipient?.name || 'Chat'}</CardTitle>
                                    <p className="text-xs text-zinc-400">Booking #{bookingId?.slice(0, 8)}</p>
                                </div>
                            </div>
                            {recipient?.phone && (
                                <Button variant="outline" size="icon" asChild className="border-zinc-700 hover:bg-zinc-800">
                                    <a href={`tel:${recipient.phone}`}>
                                        <Phone className="h-4 w-4 text-white" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent
                        ref={scrollRef}
                        className={`flex-1 overflow-y-auto p-4 space-y-4 ${!bookingId ? 'bg-zinc-900' : 'bg-zinc-950'}`}
                    >
                        {!bookingId ? (
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-zinc-400 mb-4 px-2">Recent Conversations</h3>
                                {conversations.length === 0 ? (
                                    <div className="text-center py-20 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                                        <MessageCircle className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                                        <p className="text-zinc-500 italic">No active conversations found.</p>
                                        <Button
                                            variant="link"
                                            className="text-blue-500 mt-2"
                                            onClick={() => window.history.back()}
                                        >
                                            Go Back
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {conversations.map((conv) => (
                                            <button
                                                key={conv.id}
                                                onClick={() => window.location.href = `/chat/${conv.id}`}
                                                className="w-full flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl transition-all text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-zinc-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-white">Conversation about {conv.device_type}</h4>
                                                        <p className="text-xs text-zinc-400">Status: {conv.status}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-zinc-600" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-20">
                                <MessageCircle className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                                <p className="text-zinc-500 italic">No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isOwn = msg.sender_id === user?.id;
                                return (
                                    <div
                                        key={index}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-3 rounded-2xl ${isOwn
                                            ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-tr-none'
                                            : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 opacity-70 ${isOwn ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>

                    {bookingId && (
                        <CardFooter className="border-t border-zinc-800 p-4 bg-zinc-900">
                            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                                <Input
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!newMessage.trim()}
                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}

