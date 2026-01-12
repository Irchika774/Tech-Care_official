import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  History,
  Heart,
  CreditCard,
  MessageCircle,
  Gift,
  ChevronDown,
  Wrench,
  Smartphone,
  Laptop,
  Tablet,
  MapPin,
  Bot,
  LayoutDashboard,
  Users,
  BarChart3,
  Shield
} from 'lucide-react';
import TechCareLogo from './TechCareLogo';
import { Button } from './ui/button';
import NotificationsModal from './NotificationsModal';
import NotificationBell from './NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "./ui/dropdown-menu"

const Header = () => {
  const { user, logout, isAdmin, isTechnician, isCustomer } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    // Optional: window.location.reload() if persistent state issues occur
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { label: 'Services', path: '/services', icon: Wrench },
      { label: 'Technicians', path: '/technicians', icon: Users },
      { label: 'Diagnostics', path: '/diagnostics', icon: Bot },
      { label: 'Service Areas', path: '/service-areas', icon: MapPin },
    ];

    if (!user) {
      return baseItems;
    }

    // Customer-specific items
    if (isCustomer()) {
      return [
        ...baseItems,
        { label: 'Dashboard', path: '/customer-dashboard', icon: LayoutDashboard },
      ];
    }

    // Technician-specific items
    if (isTechnician()) {
      return [
        { label: 'Dashboard', path: '/technician-dashboard', icon: LayoutDashboard },
        { label: 'My Jobs', path: '/technician-dashboard', icon: Wrench },
        { label: 'Earnings', path: '/technician-dashboard', icon: BarChart3 },
        { label: 'Chat', path: '/chat', icon: MessageCircle },
      ];
    }

    // Admin-specific items
    if (isAdmin()) {
      return [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Users', path: '/admin', icon: Users },
        { label: 'Bookings', path: '/admin', icon: Wrench },
        { label: 'Analytics', path: '/admin', icon: BarChart3 },
      ];
    }

    return baseItems;
  };

  // Service dropdown items
  const serviceItems = [
    { label: 'Mobile Repair', path: '/mobile-repair', icon: Smartphone },
    { label: 'PC Repair', path: '/pc-repair', icon: Laptop },
    { label: 'Tablet Repair', path: '/services', icon: Tablet },
    { label: 'All Services', path: '/services', icon: Wrench },
  ];

  // User menu items (when logged in)
  const getUserMenuItems = () => {
    const baseItems = [
      { label: 'Profile', path: '/account', icon: User },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];

    if (isCustomer()) {
      return [
        ...baseItems,
        { label: 'My Bookings', path: '/customer-dashboard', icon: History },
        { label: 'Favorites', path: '/favorites', icon: Heart },
        { label: 'Loyalty Points', path: '/customer-dashboard', icon: Gift },
        { label: 'Chat', path: '/chat', icon: MessageCircle },
      ];
    }

    if (isTechnician()) {
      return [
        ...baseItems,
        { label: 'Dashboard', path: '/technician-dashboard', icon: LayoutDashboard },
        { label: 'My Earnings', path: '/technician-dashboard?tab=earnings', icon: CreditCard },
        { label: 'Chat', path: '/chat', icon: MessageCircle },
      ];
    }

    if (isAdmin()) {
      return [
        ...baseItems,
        { label: 'Admin Panel', path: '/admin', icon: Shield },
      ];
    }

    return baseItems;
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <header
        className={`py-3 transition-all duration-300 sticky top-0 z-50 border-b ${isScrolled
          ? 'bg-black/95 backdrop-blur-lg border-white/10 shadow-lg'
          : location.pathname === '/' ? 'bg-transparent border-transparent' : 'bg-black border-transparent'
          }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white p-1.5 rounded-sm group-hover:bg-gray-200 transition-colors">
              <TechCareLogo variant="icon" className="h-5 w-5" color="#000" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-white">TECHCARE</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors uppercase tracking-widest ${isActiveRoute('/services') || isActiveRoute('/mobile-repair') || isActiveRoute('/pc-repair')
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}>
                  Services
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white min-w-[200px]">
                {serviceItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path + item.label}
                    className="hover:bg-zinc-800 cursor-pointer"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-2 h-4 w-4 text-green-500" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/technicians"
              className={`px-4 py-2 text-sm font-medium transition-colors uppercase tracking-widest ${isActiveRoute('/technicians') ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              Technicians
            </Link>

            <Link
              to="/diagnostics"
              className={`px-4 py-2 text-sm font-medium transition-colors uppercase tracking-widest ${isActiveRoute('/diagnostics') ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              AI Diagnostics
            </Link>

            <Link
              to="/service-areas"
              className={`px-4 py-2 text-sm font-medium transition-colors uppercase tracking-widest ${isActiveRoute('/service-areas') ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              Areas
            </Link>

            <Link
              to="/support"
              className={`px-4 py-2 text-sm font-medium transition-colors uppercase tracking-widest ${isActiveRoute('/support') ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              Support
            </Link>
          </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
                {user ? (
                  <>
                    {/* Notifications */}
                    <NotificationBell />
  
                    {/* User Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 outline-none">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name || 'User'}
                              className="h-7 w-7 rounded-full object-cover border border-white/20"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <ChevronDown className="h-3 w-3 hidden sm:block" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white min-w-[220px]">
                        <DropdownMenuLabel className="flex flex-col">
                          <span className="font-semibold text-white">{user.name || 'User'}</span>
                          <span className="text-xs text-zinc-400 font-normal">{user.email}</span>
                          <span className="text-xs text-green-500 capitalize mt-1">{user.role}</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800" />
  
                        <DropdownMenuGroup>
                          {getUserMenuItems().map((item) => (
                            <DropdownMenuItem
                              key={item.path + item.label}
                              className="hover:bg-zinc-800 cursor-pointer text-zinc-300 focus:text-white"
                              onClick={() => navigate(item.path)}
                            >
                              <item.icon className="mr-2 h-4 w-4 text-zinc-400" />
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
  
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="hover:bg-red-500/10 cursor-pointer text-red-400 focus:text-red-400"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest px-3 py-2"
                    >
                      Login
                    </Link>
                    <Link to="/register">
                      <Button
                        variant="outline"
                        className="bg-white text-black hover:bg-green-600 hover:text-white border-0 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors px-4 h-9"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-lg border-b border-white/10 shadow-xl">
            <nav className="container mx-auto px-4 py-6 space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-widest px-4 py-2">Navigation</p>

                <Link
                  to="/services"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute('/services') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <Wrench className="h-5 w-5 text-green-500" />
                  Services
                </Link>

                <Link
                  to="/technicians"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute('/technicians') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <Users className="h-5 w-5 text-green-500" />
                  Technicians
                </Link>

                <Link
                  to="/diagnostics"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute('/diagnostics') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <Bot className="h-5 w-5 text-green-500" />
                  AI Diagnostics
                </Link>

                <Link
                  to="/service-areas"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute('/service-areas') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <MapPin className="h-5 w-5 text-green-500" />
                  Service Areas
                </Link>

                <Link
                  to="/support"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute('/support') ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  Support
                </Link>
              </div>

              {/* User Actions */}
              {user ? (
                <div className="space-y-1 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-widest px-4 py-2">Account</p>

                  {getUserMenuItems().slice(0, 4).map((item) => (
                    <Link
                      key={item.path + item.label}
                      to={item.path}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-zinc-400" />
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4 border-t border-white/10 px-4">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button className="w-full bg-white text-black hover:bg-gray-200">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
};

export default Header;