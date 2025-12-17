import React from 'react';
import { Plus } from 'lucide-react';

interface TopBarProps {
  companyName?: string;
  userName?: string;
  onNewInvoice?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  userName = 'John Doe',
  onNewInvoice 
}) => {
  const currentDate = new Date().toLocaleDateString('al-AL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>
      
      <div className="flex items-center gap-4">
        {onNewInvoice && (
          <button
            onClick={onNewInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>New Invoice</span>
          </button>
        )}
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {userName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
