import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut } from 'lucide-react';
import TechCareLogo from './TechCareLogo';
import { Button } from './ui/button';
import SearchModal from './SearchModal';
import NotificationsModal from './NotificationsModal';
import NotificationBell from './NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const Header = () => {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header
        className={`py-4 transition-all duration-300 sticky top-0 z-50 border-b ${isScrolled
            ? 'bg-black/90 backdrop-blur-md border-white/10'
            : 'bg-black border-transparent'
          }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white p-1.5 rounded-sm group-hover:bg-gray-200 transition-colors">
              <TechCareLogo variant="icon" className="h-5 w-5" color="#000" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-white">TECHCARE</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/company" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
              About
            </Link>
            <Link to="/services" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
              Services
            </Link>
            <Link to="/technicians" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
              Technicians
            </Link>
            <Link to="/schedule" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
              Book Now
            </Link>
            <Link to="/support" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
              Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>
            )}

            {user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => navigate('/account')}>
                      Profile
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => navigate('/admin')}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    {user.role === 'technician' && (
                      <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => navigate('/technician-dashboard')}>
                        Technician Dashboard
                      </DropdownMenuItem>
                    )}
                    {user.role === 'user' && (
                      <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => navigate('/customer-dashboard')}>
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-red-400" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                  Login
                </Link>
                <Link to="/register">
                  <button className="bg-white text-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-none">
                    Register
                  </button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
};

export default Header;