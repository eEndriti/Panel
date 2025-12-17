import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { CreateInvoiceScreen } from './screens/CreateInvoiceScreen';
import { InvoicePrintScreen } from './screens/InvoicePrintScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'clients':
        return <ClientsScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'invoices':
        return <CreateInvoiceScreen />;
      case 'invoice-print':
        return <InvoicePrintScreen />;
      case 'transactions':
        return <TransactionsScreen />;
    
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onNewInvoice={() => setActiveScreen('invoices')}
        />
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
