import React, { useEffect, useState } from 'react';
import { EuroIcon, Search, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { callApi } from '../services/callApi';
import Loader from './Loader';
import { notify } from '../components/toast';
import { useConfirm } from '../components/ConfirmDialogContext.jsx';
import PaymentModal from '../components/PaymentModalProps'; // Ensure this is TSX, not JS

export const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalData, setPaymentModalData] = useState<any | null>(null);
  const confirm = useConfirm();

  const formatLocalValue = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [dateFrom, setDateFrom] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return formatLocalValue(firstDay);
  });

  const [dateTo, setDateTo] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return formatLocalValue(lastDay);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Fature');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const result = await callApi.getTransaksionet();
      setTransactions(result);
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t: any) => {
      const transDate = new Date(t.data).getTime();
      const start = new Date(dateFrom).setHours(0, 0, 0, 0);
      const end = new Date(dateTo).setHours(23, 59, 59, 999);
      const matchesDate = transDate >= start && transDate <= end;

      const typeMap: Record<string, string> = { Fature: 'Fature', Pagese: 'Pagese' };
      const matchesType = typeFilter === 'Te Gjitha Llojet' || t.lloji === typeMap[typeFilter];

      const search = searchTerm.toLowerCase();
      const matchesSearch =
        t.emri?.toLowerCase().includes(search) ||
        t.referenca?.toLowerCase().includes(search);

      return matchesDate && matchesType && matchesSearch;
    });
  }, [transactions, dateFrom, dateTo, searchTerm, typeFilter]);

  const ALBANIAN_MONTHS = [
    'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
    'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
  ];

  const formatToAlbanianDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getDate()} ${ALBANIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDeleteTransaction = async (transaksionId: number) => {
    const confirmed = await confirm('A jeni i sigurt?');
    if (confirmed) {
      try {
        await callApi.deleteTransaksion(transaksionId);
        notify('Transaksioni u anulua me sukses!', 'success');
      } catch (error) {
        notify('Gabim, ju lutem provoni serish!', 'error');
      } finally {
        loadTransactions();
      }
    }
  };

  const columns = [
    { key: 'data', header: 'Data Transaksionet', render: (value: string) => formatToAlbanianDate(value) },
    {
      key: 'lloji', header: 'Lloji', render: (type: string) => {
        const colors = { Fature: 'bg-blue-50 text-blue-700', Pagese: 'bg-green-50 text-green-700' };
        return <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${colors[type as keyof typeof colors]}`}>{type}</span>;
      }
    },
    { key: 'referenca', header: 'Referenca' },
    { key: 'emri', header: 'Klienti' },
    { key: 'totaliPerPagese', header: 'Totali Per Pagese' },
    { key: 'totaliPaguar', header: 'Totali i Paguar' },
    {
      key: 'mbetjaPerPagese', header: 'Mbetja Per Pagese', render: (value: any) => {
        const amount = Number(value);
        return (
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${amount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
          </span>
        );
      }
    },
    {
      key: 'actions', header: 'Veprimet', width: '120px', render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            disabled={row.totaliPerPagese === row.totaliPaguar}
            onClick={(e) => {
              e.stopPropagation();
              console.log(row)
              setPaymentModalData(row);
            }}
            className="p-1.5 text-green-600 hover:bg-green-200 rounded transition-colors"
          >
            <EuroIcon size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTransaction(row.id); // Ensure `id` exists
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Transaksionet</h2>
        <p className="text-sm text-gray-600">Menaxho & Kontrollo Transaksionet</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-md border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nga Data</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deri me</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lloji</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="Te Gjitha Llojet">Te Gjitha Llojet</option>
              <option value="Fature">Fature</option>
              <option value="Pagese">Pagese</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kerko...</label>
            <div className="relative">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Referenca ose Klienti..."
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      {loading ? <Loader /> : <DataTable columns={columns} data={filteredTransactions.toReversed()} />}
      {paymentModalData && (
        <PaymentModal
          isOpen={true}
          onClose={() => {setPaymentModalData(null);loadTransactions()}}
          initialTotaliPerPagese={paymentModalData.totaliPerPagese}
          initialTotaliIPaguar={paymentModalData.totaliPaguar}
          nrFatures = {paymentModalData.referenca}
        />
      )}
    </div>
  );
};
