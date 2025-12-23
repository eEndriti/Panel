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
import { Toaster } from 'react-hot-toast';
import './components/App.css'
import { ConfirmDialogProvider } from './components/ConfirmDialogContext';
import { EditInvoiceScreen } from './screens/EditInvoiceScreen';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  // Add a state to hold the ID of the invoice you want to edit
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  const handleEditInvoice = (id: string) => {
    setEditingInvoiceId(id);
    setActiveScreen('editInvoice');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        // Pass the handleEditInvoice function to the Dashboard
        return <DashboardScreen onEditInvoice={handleEditInvoice} />;
      case 'editInvoice':
        // Pass the ID to the Edit Screen
        return <EditInvoiceScreen invoiceId={editingInvoiceId} onBack={() => setActiveScreen('dashboard')} />;
      case 'clients':
        return <ClientsScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'invoices':
        return <CreateInvoiceScreen />;
      
      case 'transactions':
        return <TransactionsScreen />;
    
      case 'settings':
        return <SettingsScreen />;
      case 'editInvoice':
        return <EditInvoiceScreen />;
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
        <ConfirmDialogProvider>
          <main className="flex-1 overflow-y-auto">
            <Toaster position="top-right" />
            {renderScreen()}
          </main>
        </ConfirmDialogProvider>
      </div>
    </div>
  );
}
