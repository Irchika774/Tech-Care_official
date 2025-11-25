const NotificationsModal = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Mobile Wizards is confirmed for tomorrow at 2:00 PM',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'review',
      title: 'New Review Response',
      message: 'Tech Solutions Hub responded to your review',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on PC hardware upgrades this week!',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Service Reminder',
      message: 'Time for your scheduled device maintenance check',
      time: '2 days ago',
      read: true
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return 'event';
      case 'review':
        return 'rate_review';
      case 'promotion':
        return 'local_offer';
      case 'reminder':
        return 'notifications_active';
      default:
        return 'notifications';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-20 pr-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <button 
              onClick={onClose}
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read
                    ? 'border-border-light dark:border-border-dark'
                    : 'border-primary bg-blue-50 dark:bg-blue-900 bg-opacity-10'
                } hover:bg-background-light dark:hover:bg-background-dark transition cursor-pointer`}
              >
                <div className="flex items-start space-x-3">
                  <span className="material-icons text-primary mt-1">
                    {getIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
            <button className="w-full text-center text-primary font-semibold hover:underline">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
