import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AccountModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const menuItems = [
    { icon: 'person', label: 'My Profile', path: '/profile' },
    { icon: 'event', label: 'My Appointments', path: '/schedule' },
    { icon: 'payment', label: 'Payment Methods', path: '/payment' },
    { icon: 'history', label: 'Service History', path: '/history' },
    { icon: 'favorite', label: 'Saved Technicians', path: '/favorites' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
    { icon: 'help', label: 'Help & Support', path: '/support' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-20 pr-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Account</h2>
            <button
              onClick={onClose}
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-border-light dark:border-border-dark">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {user.email}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition"
              >
                <span className="material-icons text-text-secondary-light dark:text-text-secondary-dark">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-opacity-30 transition"
            >
              <span className="material-icons">logout</span>
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
