import React from 'react';
import { DollarSign, TrendingUp, FileText, Package } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';

const recentInvoices = [
  { id: 'INV-001', date: '2025-12-15', client: 'ABC Company', amount: '$1,250.00', status: 'Paid' },
  { id: 'INV-002', date: '2025-12-14', client: 'XYZ Corp', amount: '$3,500.00', status: 'Paid' },
  { id: 'INV-003', date: '2025-12-14', client: 'Tech Solutions', amount: '$890.00', status: 'Pending' },
  { id: 'INV-004', date: '2025-12-13', client: 'Global Inc', amount: '$2,100.00', status: 'Paid' },
  { id: 'INV-005', date: '2025-12-13', client: 'Local Store', amount: '$450.00', status: 'Pending' },
  { id: 'INV-006', date: '2025-12-12', client: 'Design Studio', amount: '$1,800.00', status: 'Paid' },
  { id: 'INV-007', date: '2025-12-12', client: 'Marketing Plus', amount: '$675.00', status: 'Overdue' },
  { id: 'INV-008', date: '2025-12-11', client: 'Development Co', amount: '$4,200.00', status: 'Paid' },
  { id: 'INV-009', date: '2025-12-11', client: 'Retail Chain', amount: '$920.00', status: 'Pending' },
  { id: 'INV-010', date: '2025-12-10', client: 'Consulting Firm', amount: '$3,100.00', status: 'Paid' },
];

const columns = [
  { key: 'id', header: 'Invoice #', width: '120px' },
  { key: 'date', header: 'Date', width: '120px' },
  { key: 'client', header: 'Client', width: 'auto' },
  { key: 'amount', header: 'Amount', width: '120px' },
  {
    key: 'status',
    header: 'Status',
    width: '120px',
    render: (status: string) => {
      const colors = {
        Paid: 'bg-green-50 text-green-700',
        Pending: 'bg-yellow-50 text-yellow-700',
        Overdue: 'bg-red-50 text-red-700'
      };
      return (
        <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${colors[status as keyof typeof colors]}`}>
          {status}
        </span>
      );
    }
  }
];

export const DashboardScreen: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-600">Overview of your business metrics</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Sales"
          value="$2,340"
          icon={DollarSign}
          trend={{ value: '+12.5%', isPositive: true }}
          iconColor="bg-green-50 text-green-600"
        />
        <StatCard
          title="Monthly Sales"
          value="$45,230"
          icon={TrendingUp}
          trend={{ value: '+8.2%', isPositive: true }}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Pending Invoices"
          value="23"
          icon={FileText}
          iconColor="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          title="Low Stock Items"
          value="7"
          icon={Package}
          iconColor="bg-red-50 text-red-600"
        />
      </div>

      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Invoices</h3>
        <DataTable columns={columns} data={recentInvoices} />
      </div>
    </div>
  );
};
