import React, { useState } from 'react';
import { Printer, Download } from 'lucide-react';
import { DataTable } from '../components/DataTable';

export const ReportsScreen: React.FC = () => {
  const [activeReport, setActiveReport] = useState('sales-by-date');
  const [dateFrom, setDateFrom] = useState('2025-12-01');
  const [dateTo, setDateTo] = useState('2025-12-31');

  const salesByDateData = [
    { date: '2025-12-16', invoices: 5, amount: '$7,890.00' },
    { date: '2025-12-15', invoices: 8, amount: '$12,450.00' },
    { date: '2025-12-14', invoices: 6, amount: '$9,320.00' },
    { date: '2025-12-13', invoices: 7, amount: '$10,150.00' },
    { date: '2025-12-12', invoices: 4, amount: '$5,590.00' },
  ];

  const salesByClientData = [
    { client: 'ABC Company', invoices: 12, totalSales: '$15,890.00', outstanding: '$1,250.00' },
    { client: 'XYZ Corp', invoices: 8, totalSales: '$28,450.00', outstanding: '$0.00' },
    { client: 'Tech Solutions', invoices: 15, totalSales: '$13,320.00', outstanding: '$890.00' },
    { client: 'Global Inc', invoices: 6, totalSales: '$12,600.00', outstanding: '$0.00' },
    { client: 'Local Store', invoices: 10, totalSales: '$4,500.00', outstanding: '$450.00' },
  ];

  const stockReportData = [
    { product: 'Premium Widget', sku: 'WDG-001', quantity: 150, value: '$7,498.50' },
    { product: 'Standard Gadget', sku: 'GDG-002', quantity: 8, value: '$239.92' },
    { product: 'Deluxe Tool', sku: 'TL-003', quantity: 45, value: '$4,049.55' },
    { product: 'Basic Component', sku: 'CMP-004', quantity: 220, value: '$3,517.80' },
    { product: 'Advanced Module', sku: 'MOD-005', quantity: 5, value: '$625.00' },
  ];

  const lowStockData = [
    { product: 'Standard Gadget', sku: 'GDG-002', quantity: 8, reorderLevel: 10, status: 'Low' },
    { product: 'Advanced Module', sku: 'MOD-005', quantity: 5, reorderLevel: 10, status: 'Critical' },
    { product: 'Starter Pack', sku: 'STR-007', quantity: 3, reorderLevel: 15, status: 'Critical' },
  ];

  const reports = [
    { id: 'sales-by-date', name: 'Sales by Date' },
    { id: 'sales-by-client', name: 'Sales by Client' },
    { id: 'stock-report', name: 'Stock Report' },
    { id: 'low-stock', name: 'Low Stock Report' },
  ];

  const getReportColumns = () => {
    switch (activeReport) {
      case 'sales-by-date':
        return [
          { key: 'date', header: 'Date', width: '150px' },
          { key: 'invoices', header: 'Invoices', width: '120px' },
          { key: 'amount', header: 'Total Amount', width: 'auto' },
        ];
      case 'sales-by-client':
        return [
          { key: 'client', header: 'Client', width: 'auto' },
          { key: 'invoices', header: 'Invoices', width: '120px' },
          { key: 'totalSales', header: 'Total Sales', width: '150px' },
          { key: 'outstanding', header: 'Outstanding', width: '150px' },
        ];
      case 'stock-report':
        return [
          { key: 'product', header: 'Product', width: 'auto' },
          { key: 'sku', header: 'SKU', width: '120px' },
          { key: 'quantity', header: 'Quantity', width: '120px' },
          { key: 'value', header: 'Total Value', width: '150px' },
        ];
      case 'low-stock':
        return [
          { key: 'product', header: 'Product', width: 'auto' },
          { key: 'sku', header: 'SKU', width: '120px' },
          { key: 'quantity', header: 'Current Stock', width: '130px' },
          { key: 'reorderLevel', header: 'Reorder Level', width: '130px' },
          {
            key: 'status',
            header: 'Status',
            width: '120px',
            render: (status: string) => {
              const color = status === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700';
              return (
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${color}`}>
                  {status}
                </span>
              );
            }
          },
        ];
      default:
        return [];
    }
  };

  const getReportData = () => {
    switch (activeReport) {
      case 'sales-by-date':
        return salesByDateData;
      case 'sales-by-client':
        return salesByClientData;
      case 'stock-report':
        return stockReportData;
      case 'low-stock':
        return lowStockData;
      default:
        return [];
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Reports</h2>
        <p className="text-sm text-gray-600">Generate and view business reports</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Report Types */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 mb-3">Report Types</h3>
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`w-full text-left px-4 py-2.5 rounded-md transition-colors ${
                activeReport === report.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {report.name}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="col-span-3 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <div className="flex items-end gap-4">
              {activeReport.startsWith('sales') && (
                <>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Printer size={18} />
                  Print
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              {reports.find(r => r.id === activeReport)?.name}
            </h3>
            <DataTable columns={getReportColumns()} data={getReportData()} />
          </div>

          {/* Summary */}
          {activeReport === 'sales-by-date' && (
            <div className="bg-white rounded-md border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                  <p className="text-xl font-semibold text-gray-900">30</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                  <p className="text-xl font-semibold text-gray-900">$45,400.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Sale</p>
                  <p className="text-xl font-semibold text-gray-900">$1,513.33</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
