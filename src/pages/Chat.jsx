import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Send, User, Phone } from 'lucide-react';
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

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-120px)] flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="border-b bg-muted/30">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{recipient?.name || 'Chat'}</CardTitle>
                                <p className="text-xs text-muted-foreground">Booking #{bookingId.slice(0, 8)}</p>
                            </div>
                        </div>
                        {recipient?.phone && (
                            <Button variant="ghost" size="icon" asChild>
                                <a href={`tel:${recipient.phone}`}>
                                    <Phone className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5"
                >
                    {messages.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground italic">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isOwn = msg.sender_id === user?.id;
                            return (
                                <div 
                                    key={index}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                                        isOwn 
                                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                            : 'bg-muted rounded-tl-none'
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

                <CardFooter className="border-t p-4 bg-background">
                    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                        <Input 
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
