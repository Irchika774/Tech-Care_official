import { useState } from 'react';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const mockResults = [
        { id: 1, title: 'Mobile Screen Repair', category: 'Service', path: '/' },
        { id: 2, title: 'PC Hardware Upgrade', category: 'Service', path: '/pc-repair' },
        { id: 3, title: 'Battery Replacement', category: 'Service', path: '/' },
        { id: 4, title: 'Reviews', category: 'Page', path: '/reviews' },
        { id: 5, title: 'Schedule Appointment', category: 'Page', path: '/schedule' },
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(mockResults);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-slideDown"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Search</h2>
            <button 
              onClick={onClose}
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services, technicians, pages..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              Search
            </button>
          </form>
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Results</h3>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <a
                    key={result.id}
                    href={result.path}
                    className="block p-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{result.title}</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {result.category}
                        </p>
                      </div>
                      <span className="material-icons text-primary">arrow_forward</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {searchQuery && searchResults.length === 0 && (
            <div className="mt-6 text-center text-text-secondary-light dark:text-text-secondary-dark">
              <span className="material-icons text-5xl mb-2">search_off</span>
              <p>No results found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
