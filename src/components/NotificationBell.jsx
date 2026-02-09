import { useState } from 'react';
import { Bell, Check, CheckCheck, Settings, ExternalLink } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'repair':
                return '🔧';
            case 'payment':
                return '💳';
            case 'promo':
                return '🎁';
            case 'system':
                return '⚙️';
            default:
                return '📢';
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-800">
                <div className="flex items-center justify-between px-2">
                    <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-blue-400 hover:text-blue-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead && markAllAsRead();
                            }}
                        >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No notifications yet</p>
                        <p className="text-xs mt-1">We'll notify you when something happens</p>
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.slice(0, 10).map(notif => (
                            <DropdownMenuItem
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`cursor-pointer flex items-start gap-3 p-3 ${!notif.read ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''}`}
                            >
                                <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-white truncate">{notif.title}</div>
                                    <div className="text-xs text-zinc-400 line-clamp-2">{notif.message}</div>
                                    <div className="text-[10px] text-zinc-600 mt-1 flex items-center gap-2">
                                        <span>{new Date(notif.created_at).toLocaleDateString()}</span>
                                        {!notif.read && (
                                            <Badge variant="outline" className="h-4 text-[8px] text-blue-400 border-blue-500/30">NEW</Badge>
                                        )}
                                    </div>
                                </div>
                                {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <div className="p-2 flex justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-zinc-400 hover:text-white"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/settings');
                                }}
                            >
                                <Settings className="w-3 h-3 mr-1" />
                                Settings
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-blue-400 hover:text-blue-300"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/notifications');
                                }}
                            >
                                View All
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;
