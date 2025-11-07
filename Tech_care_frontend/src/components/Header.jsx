import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import SearchModal from './SearchModal';
import NotificationsModal from './NotificationsModal';
import AccountModal from './AccountModal';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <>
      <header className="py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="material-icons text-primary text-3xl">build_circle</span>
          <h1 className="text-2xl font-bold">TechCare</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary"
          >
            Mobile Repairing
          </Link>
          <Link 
            to="/pc-repair" 
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary"
          >
            PC Repairing
          </Link>
          <Link 
            to="/reviews" 
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary"
          >
            Reviews
          </Link>
          <Link 
            to="/admin" 
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary"
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary flex items-center space-x-1"
          >
            <span className="material-icons">search</span>
            <span>Search</span>
          </button>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary flex items-center space-x-1 relative"
          >
            <span className="material-icons">notifications</span>
            <span>Notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => setIsAccountOpen(true)}
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary flex items-center space-x-1"
          >
            <span className="material-icons">account_circle</span>
            <span>Account</span>
          </button>
          <button 
            onClick={toggleTheme}
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary flex items-center space-x-1"
          >
            <span className="material-icons">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </>
  );
};

export default Header;
