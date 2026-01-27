import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
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
  LayoutDashboard,
  Users,
  BarChart3,
  Shield,
  Star,
  Briefcase,
  AlertCircle,
  Activity,
  Calendar,
  Zap,
  Gavel,
  GitCompare
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
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { label: 'Services', path: '/services', icon: Wrench },
      { label: 'Technicians', path: '/technicians', icon: Users },
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
        { label: 'Bids', path: '/technician-dashboard?tab=bids', icon: Gavel },
        { label: 'Earnings', path: '/technician-dashboard?tab=earnings', icon: BarChart3 },
        { label: 'Chat', path: '/chat', icon: MessageCircle },
      ];
    }

    // Admin-specific items
    if (isAdmin()) {
      return [
        { label: 'Dashboard', path: '/admin?tab=dashboard', icon: LayoutDashboard },
        { label: 'Services', path: '/admin?tab=services', icon: Zap },
        { label: 'Technicians', path: '/admin?tab=technicians', icon: Users },
        { label: 'Areas', path: '/admin?tab=areas', icon: MapPin },
        { label: 'Support', path: '/admin?tab=support', icon: MessageCircle },
        { label: 'Reviews', path: '/admin?tab=reviews', icon: Star },
        { label: 'More', path: '#', icon: ChevronDown, isDropdown: true },
      ];
    }

    return baseItems;
  };

  // Service dropdown items
  const serviceItems = [
    { label: 'Mobile Repair', path: '/mobile-repair', icon: Smartphone },
    { label: 'PC Repair', path: '/pc-repair', icon: Laptop },
    { label: 'Tablet Repair', path: '/tablet-repair', icon: Tablet },
    { label: 'All Services', path: '/services', icon: Wrench },
  ];

  // User menu items (when logged in) - FIXED with correct navigation paths
  const getUserMenuItems = () => {
    if (isCustomer()) {
      return [
        { label: 'Dashboard', path: '/customer-dashboard', icon: LayoutDashboard },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'My Bookings', path: '/customer-dashboard?tab=bookings', icon: History },
        { label: 'Favorites', path: '/favorites', icon: Heart },
        { label: 'Loyalty Points', path: '/customer-dashboard?tab=loyalty', icon: Gift },
        { label: 'Chat', path: '/chat', icon: MessageCircle },
      ];
    }

    if (isTechnician()) {
      return [
        { label: 'Dashboard', path: '/technician-dashboard', icon: LayoutDashboard },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'My Earnings', path: '/technician-dashboard?tab=earnings', icon: CreditCard },
        { label: 'Chat', path: '/chat', icon: MessageCircle },
      ];
    }

    if (isAdmin()) {
      return [
        { label: 'Admin Panel', path: '/admin', icon: Shield },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
      ];
    }

    return [
      { label: 'Profile', path: '/profile', icon: User },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];
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
            {/* Dynamic Navigation Items */}
            {getNavItems().map((item) => (
              <div key={item.path + item.label}>
                {item.isDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors uppercase tracking-widest text-gray-400 hover:text-white">
                        {item.label}
                        <item.icon className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white min-w-[180px]">
                      <DropdownMenuItem onClick={() => navigate('/admin?tab=financials')} className="hover:bg-zinc-800 cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4 text-emerald-500" />
                        Financials
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin?tab=appointments')} className="hover:bg-zinc-800 cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                        Appointments
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin?tab=logs')} className="hover:bg-zinc-800 cursor-pointer">
                        <Activity className="mr-2 h-4 w-4 text-purple-500" />
                        System Logs
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem onClick={() => navigate('/admin?tab=settings')} className="hover:bg-zinc-800 cursor-pointer">
                        <Settings className="mr-2 h-4 w-4 text-zinc-400" />
                        Setup & Config
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : item.label === 'Services' && !isTechnician() && !isAdmin() ? (
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
                      {serviceItems.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.path + subItem.label}
                          className="hover:bg-zinc-800 cursor-pointer"
                          onClick={() => navigate(subItem.path)}
                        >
                          <subItem.icon className="mr-2 h-4 w-4 text-green-500" />
                          {subItem.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors uppercase tracking-widest ${isActiveRoute(item.path.split('?')[0]) && (item.path.includes('tab=') ? location.search.includes(item.path.split('?')[1]) : true) ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {(isTechnician() || isAdmin()) && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions - REMOVED SEARCH ICON */}
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
                        <img
                          src={`https://api.dicebear.com/9.x/micah/svg?seed=${user.email || user.name || 'User'}&backgroundColor=18181b`}
                          alt={user.name || 'User'}
                          className="h-7 w-7 rounded-full object-cover border border-white/20 bg-zinc-800"
                        />
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

        {/* Mobile Menu - UPDATED with removed items */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-lg border-b border-white/10 shadow-xl">
            <nav className="container mx-auto px-4 py-6 space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-widest px-4 py-2">Navigation</p>

                {/* Dynamic Navigation Items */}
                {getNavItems().map((item) => (
                  <div key={item.path + item.label}>
                    {item.isDropdown ? (
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest px-4 py-2 mt-2">More Management</p>
                        {[
                          { label: 'Financials', path: '/admin?tab=financials', icon: CreditCard },
                          { label: 'Appointments', path: '/admin?tab=appointments', icon: Calendar },
                          { label: 'System Logs', path: '/admin?tab=logs', icon: Activity },
                          { label: 'Setup & Config', path: '/admin?tab=settings', icon: Settings },
                        ].map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute(subItem.path.split('?')[0]) && location.search.includes(subItem.path.split('?')[1]) ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                          >
                            <subItem.icon className="h-5 w-5 text-zinc-400" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ) : !isTechnician() && !isAdmin() && item.label === 'Services' ? (
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest px-4 py-2 mt-2">Services</p>
                        {serviceItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute(subItem.path) ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                          >
                            <subItem.icon className="h-5 w-5 text-green-500" />
                            {subItem.label}
                          </Link>
                        ))}
                        <div className="h-px bg-white/5 my-2 mx-4" />
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActiveRoute(item.path.split('?')[0]) && (item.path.includes('tab=') ? location.search.includes(item.path.split('?')[1]) : true) ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                          }`}
                      >
                        <item.icon className="h-5 w-5 text-green-500" />
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* User Actions */}
              {user ? (
                <div className="space-y-1 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-widest px-4 py-2">Account</p>

                  {getUserMenuItems().slice(0, 5).map((item) => (
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