import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { DataTable } from '../components/DataTable';

const mockTransactions = [
  { id: 1, date: '2025-12-16', type: 'Invoice', reference: 'INV-001', client: 'ABC Company', amount: '$1,250.00', method: 'Bank Transfer' },
  { id: 2, date: '2025-12-15', type: 'Payment', reference: 'PAY-045', client: 'XYZ Corp', amount: '$3,500.00', method: 'Credit Card' },
  { id: 3, date: '2025-12-15', type: 'Invoice', reference: 'INV-002', client: 'Tech Solutions', amount: '$890.00', method: 'Cash' },
  { id: 4, date: '2025-12-14', type: 'Payment', reference: 'PAY-044', client: 'Global Inc', amount: '$2,100.00', method: 'Bank Transfer' },
  { id: 5, date: '2025-12-14', type: 'Invoice', reference: 'INV-003', client: 'Local Store', amount: '$450.00', method: 'Check' },
  { id: 6, date: '2025-12-13', type: 'Adjustment', reference: 'ADJ-012', client: 'Design Studio', amount: '-$50.00', method: 'N/A' },
  { id: 7, date: '2025-12-13', type: 'Payment', reference: 'PAY-043', client: 'Marketing Plus', amount: '$675.00', method: 'Credit Card' },
  { id: 8, date: '2025-12-12', type: 'Invoice', reference: 'INV-004', client: 'Development Co', amount: '$4,200.00', method: 'Bank Transfer' },
  { id: 9, date: '2025-12-12', type: 'Payment', reference: 'PAY-042', client: 'Retail Chain', amount: '$920.00', method: 'Cash' },
  { id: 10, date: '2025-12-11', type: 'Invoice', reference: 'INV-005', client: 'Consulting Firm', amount: '$3,100.00', method: 'Bank Transfer' },
  { id: 11, date: '2025-12-11', type: 'Payment', reference: 'PAY-041', client: 'ABC Company', amount: '$1,200.00', method: 'Credit Card' },
  { id: 12, date: '2025-12-10', type: 'Invoice', reference: 'INV-006', client: 'Tech Solutions', amount: '$750.00', method: 'Check' },
];

export const TransactionsScreen: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2025-12-01');
  const [dateTo, setDateTo] = useState('2025-12-31');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const columns = [
    { key: 'date', header: 'Date', width: '120px' },
    {
      key: 'type',
      header: 'Type',
      width: '120px',
      render: (type: string) => {
        const colors = {
          Invoice: 'bg-blue-50 text-blue-700',
          Payment: 'bg-green-50 text-green-700',
          Adjustment: 'bg-orange-50 text-orange-700'
        };
        return (
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${colors[type as keyof typeof colors]}`}>
            {type}
          </span>
        );
      }
    },
    { key: 'reference', header: 'Reference', width: '120px' },
    { key: 'client', header: 'Client', width: 'auto' },
    { key: 'amount', header: 'Amount', width: '120px' },
    { key: 'method', header: 'Payment Method', width: '150px' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Transactions</h2>
        <p className="text-sm text-gray-600">Qetu i kisha hek ndryshimet e kto e kisha bo me u dok veq faturat edhe i kisha shtu veprimet, nese klienti e klikon shfaq ne detaje, me ja qit ndryshimet edhe pagesat</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-md border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
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
          <div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoice</option>
              <option value="payment">Payment</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Client or reference..."
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <DataTable columns={columns} data={mockTransactions} />
    </div>
  );
};
