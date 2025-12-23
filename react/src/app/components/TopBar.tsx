import React from 'react';
import { Plus } from 'lucide-react';

interface TopBarProps {
  companyName?: string;
  userName?: string;
  onNewInvoice?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  userName = 'emri userit',
  onNewInvoice 
}) => {
const daysSq = [
  'e Diel',
  'e Hënë',
  'e Martë',
  'e Mërkurë',
  'e Enjte',
  'e Premte',
  'e Shtunë'
];

const date = new Date();

const dayName = daysSq[date.getDay()];
const day = date.getDate();
const year = date.getFullYear();

const month = date.toLocaleDateString('en-US', { month: 'long' });

const currentDate = `${dayName}, ${day} ${month} ${year}`;

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
            <span> Fature e re</span>
          </button>
        )}
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">roli</p>
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
