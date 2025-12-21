import React from 'react';
import { LayoutDashboard, Users, Package, FileText, DollarSign, BarChart3, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Faqja Kryesore' },
    { id: 'clients', icon: Users, label: 'Klientet' },
    { id: 'products', icon: Package, label: 'Stoku' },
    { id: 'transactions', icon: DollarSign, label: 'Transaksionet' },
    { id: 'settings', icon: Settings, label: 'Parametrat' },
  ];

  return (
    <div className="w-[220px] bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="w-25 h-10 bg-gray-400 rounded-md flex items-center justify-center mb-2">
          <span className="text-white font-semibold">PANELI</span>
        </div>
      </div>
      
      <nav className="flex-1 p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <LogOut size={18} />
          <span>Dil</span>
        </button>
      </div>
    </div>
  );
};
