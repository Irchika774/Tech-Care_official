const Loading = ({ fullscreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-background-light dark:bg-background-dark bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-2xl">
          {spinner}
          <p className="mt-4 text-text-light dark:text-text-dark font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loading;
