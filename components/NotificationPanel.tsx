import React from 'react';
import { Notification, NotificationType } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
}

const IconForType: React.FC<{ type: NotificationType }> = ({ type }) => {
    const baseClasses = "w-5 h-5 mr-3 flex-shrink-0";
    switch (type) {
        case NotificationType.Success:
            return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-green-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
        case NotificationType.Info:
            return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-blue-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
        case NotificationType.Alert:
            return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-yellow-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
        default:
            return null;
    }
};


const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start">
                                <IconForType type={notification.type} />
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {notification.message}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">You have no new notifications.</p>
                </div>
            )}
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 text-center">
            {/* Can add a "View All" link here later */}
        </div>
    </div>
  );
};

export default NotificationPanel;
