import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Send, User, Phone, MessageCircle, Bot, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
    const { bookingId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [recipient, setRecipient] = useState(null);
    const scrollRef = useRef(null);

    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchChats = async () => {
            if (bookingId) return; // Don't fetch list if we're in a specific chat

            setLoadingChats(true);
            try {
                // Fetch all bookings for this user to show conversation list
                const isTech = user.role === 'technician';
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        customer:customers(id, name, user_id),
                        technician:technicians(id, name, user_id)
                    `)
                    .or(isTech ? `technician_id.eq.${user.id}` : `customer_id.eq.${user.id}`)
                    .order('updated_at', { ascending: false });

                if (!error) setChats(data || []);
            } catch (err) {
                console.error('Error fetching chats:', err);
            } finally {
                setLoadingChats(false);
            }
        };

        fetchChats();
    }, [bookingId, user]);

    useEffect(() => {
        if (!bookingId || !user) return;

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

            if (!bookingError) {
                const isCustomer = user.id === booking.customer.user_id;
                setRecipient(isCustomer ? booking.technician : booking.customer);
            }

            // Fetch existing messages
            const { data: msgs, error: msgsError } = await supabase
                .from('messages')
                .select('*')
                .eq('booking_id', bookingId)
                .order('created_at', { ascending: true });

            if (!msgsError) setMessages(msgs);
            setLoading(false);
        };

        fetchData();

        // Subscribe to new messages
        const channel = supabase
            .channel(`booking-chat-${bookingId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
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

    if (!bookingId) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="container max-w-4xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(user?.role === 'technician' ? '/technician-dashboard' : '/customer-dashboard')}
                        className="text-zinc-400 hover:text-white mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <MessageCircle className="h-8 w-8 text-green-500" />
                        Your Conversations
                    </h1>
                    <div className="grid gap-4">
                        {loadingChats ? (
                            <div className="text-center py-20">
                                <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4" />
                                <p className="text-zinc-400">Loading your chats...</p>
                            </div>
                        ) : chats.length === 0 ? (
                            <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
                                <p className="text-zinc-500">No active conversations found.</p>
                                <Button className="mt-4 bg-white text-black" onClick={() => navigate('/services')}>Start a Booking</Button>
                            </Card>
                        ) : (
                            chats.map(chat => {
                                const other = user.role === 'technician' ? chat.customer : chat.technician;
                                return (
                                    <Card
                                        key={chat.id}
                                        className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all"
                                        onClick={() => navigate(`/chat/${chat.id}`)}
                                    >
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white">{other?.name || 'Assigned Technician'}</h3>
                                                    <p className="text-sm text-zinc-500">{chat.device_brand} {chat.device_model} • {chat.status}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-zinc-600" />
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    }

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
                <Button
                    variant="ghost"
                    onClick={() => navigate(user?.role === 'technician' ? '/technician-dashboard' : '/customer-dashboard')}
                    className="text-zinc-400 hover:text-white mb-4 w-fit"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
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
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950"
                    >
                        {messages.length === 0 ? (
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

                    <CardFooter className="border-t border-zinc-800 p-4 bg-zinc-900">
                        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                            <Input
                                placeholder={!recipient ? "Waiting for technician to be assigned..." : "Type your message..."}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={!recipient}
                                className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 disabled:opacity-50"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!recipient || !newMessage.trim()}
                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

