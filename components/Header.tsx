import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, UserRole, Notification } from '../types';
import { useAuth } from '../hooks/useAuth';
import JobPortalLogo from './icons/JobPortalLogo';
import ThemeToggle from './ThemeToggle';
import BellIcon from './icons/BellIcon';
import NotificationPanel from './NotificationPanel';
import UserAvatar from './UserAvatar';

type ActiveView = 'jobs' | 'companies' | 'profile';

interface HeaderProps {
  user: User;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  notifications: Notification[];
  onNotificationsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, activeView, setActiveView, notifications, onNotificationsRead }) => {
  const { logout } = useAuth();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  
  const handleTogglePanel = () => {
    setIsPanelOpen(prev => !prev);
    if (!isPanelOpen && unreadCount > 0) {
      onNotificationsRead();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setIsPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinkClasses = (view: ActiveView) => 
    `text-sm font-medium transition-colors ${
      activeView === view 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
    }`;

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <JobPortalLogo className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">JobPortal</h1>
          </div>
          
          {user.role === UserRole.Employee && (
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => setActiveView('jobs')} className={navLinkClasses('jobs')}>
                Find Jobs
              </button>
              <button onClick={() => setActiveView('companies')} className={navLinkClasses('companies')}>
                Find Companies
              </button>
            </nav>
          )}

          <div className="flex items-center space-x-4">
              <div ref={panelRef} className="relative">
                 <button 
                    onClick={handleTogglePanel}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    aria-label="Toggle notifications"
                  >
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                    )}
                 </button>
                 {isPanelOpen && <NotificationPanel notifications={notifications} />}
              </div>
              
              {user.role === UserRole.Employee ? (
                <button 
                  onClick={() => setActiveView('profile')}
                  className="hidden sm:flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="View profile"
                >
                  <UserAvatar name={user.email} className="w-8 h-8 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, <span className="font-semibold text-gray-800 dark:text-gray-200">{user.email.split('@')[0]}</span>
                  </span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <UserAvatar name={user.email} className="w-8 h-8 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, <span className="font-semibold text-gray-800 dark:text-gray-200">{user.email.split('@')[0]}</span>
                  </span>
                </div>
              )}
              
              <ThemeToggle />
              <button
                  onClick={logout}
                  className="px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                  Log Out
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;