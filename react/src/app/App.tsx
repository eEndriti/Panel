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
  const [loggedInUser, setLoggedInUser] = useState<{ emri: string; roli: string } | null>(null);
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  const handleEditInvoice = (id: string) => {
    setEditingInvoiceId(id);
    setActiveScreen("editInvoice");
  };

  const renderScreen = () => {
    if (!loggedInUser) {
      return (
        <LoginScreen
          onLoginSuccess={(user) =>
            setLoggedInUser({ emri: user.emri, roli: user.roli })
          }
        />
      );
    }

    switch (activeScreen) {
      case "dashboard":
        return <DashboardScreen onEditInvoice={handleEditInvoice} />;
      case "editInvoice":
        return (
          <EditInvoiceScreen
            invoiceId={editingInvoiceId}
            onBack={() => setActiveScreen("dashboard")}
          />
        );
      case "clients":
        return <ClientsScreen />;
      case "products":
        return <ProductsScreen />;
      case "invoices":
        return <CreateInvoiceScreen />;
      case "transactions":
        return <TransactionsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <DashboardScreen onEditInvoice={handleEditInvoice}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {loggedInUser && (
        <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} user={loggedInUser} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {loggedInUser && (
          <TopBar
            onNewInvoice={() => setActiveScreen("invoices")}
            userName={loggedInUser.emri}
            roli={loggedInUser.roli}
          />
        )}
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
