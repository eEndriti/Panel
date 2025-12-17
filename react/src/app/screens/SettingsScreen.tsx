import React, { useState } from 'react';
import { Save, Download } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [companyAddress, setCompanyAddress] = useState('123 Business Street');
  const [companyCity, setCompanyCity] = useState('New York, NY 10001');
  const [companyPhone, setCompanyPhone] = useState('(555) 123-4567');
  const [companyEmail, setCompanyEmail] = useState('billing@acmecorp.com');
  const [taxRate, setTaxRate] = useState('10');
  const [currency, setCurrency] = useState('USD');
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Settings</h2>
        <p className="text-sm text-gray-600">Configure your business settings</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Company Information</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City, State, ZIP *
                </label>
                <input
                  type="text"
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} />
                  Save Company Information
                </button>
              </div>
            </form>
          </div>

          {/* Invoice Settings */}
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Prefix
                  </label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Save size={18} />
                  Save Invoice Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Database Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Database</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Backup your database regularly to prevent data loss.
                </p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Download size={18} />
                  Backup Database
                </button>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Restore your database from a backup file.
                </p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Restore Database
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">About</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="text-gray-900 font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="text-gray-900 font-medium">SQLite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Backup:</span>
                <span className="text-gray-900 font-medium">2025-12-15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
