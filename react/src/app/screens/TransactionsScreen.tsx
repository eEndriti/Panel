import React, { useEffect, useState } from 'react';
import { EuroIcon, Search, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { callApi } from '../services/callApi';
import Loader from './Loader';
import { notify } from '../components/toast';
import { useConfirm } from '../components/ConfirmDialogContext.jsx';

export const TransactionsScreen: React.FC = () => {
  const [faturat, setFaturat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadFaturat();
  }, []);

  const loadFaturat = async () => {
    try {
      setLoading(true);
      const result = await callApi.getFaturat();
      console.log(result)
      setFaturat(result);
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaturat = React.useMemo(() => {
    return faturat.filter((t: any) => {
      const transDate = new Date(t.dataFatures).getTime();
      const start = new Date(dateFrom).setHours(0, 0, 0, 0);
      const end = new Date(dateTo).setHours(23, 59, 59, 999);
      const matchesDelete = !t.isDeleted
      const matchesDate = transDate >= start && transDate <= end;

      const search = searchTerm.toLowerCase();
      const matchesSearch =
        t.emri?.toLowerCase().includes(search) ||
        t.nrFatures?.toLowerCase().includes(search);

    
      return matchesDate  && matchesSearch && matchesDelete;
    });
  }, [faturat, dateFrom, dateTo, searchTerm]);

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

  const handleDeleteFatura = async (id: number) => {
    const confirmed = await confirm('A jeni i sigurt?');
    if (confirmed) {
      try {
        await callApi.deleteFature(id);
        notify('Fletedergesa u anulua me sukses!', 'success');
      } catch (error) {
        notify('Gabim, ju lutem provoni serish!', 'error');
      } finally {
        loadFaturat();
      }
    }
  };

const columns = [
{ key: 'id', header: 'Nr #', width: 'auto' },
{ 
  key: 'dataFatures', 
  header: 'Data Fletedergeses', 
  width: 'auto',
  render: (value: string) => formatToAlbanianDate(value)
},
{ key: 'nrFatures', header: 'Nr i Fletedergeses', width: 'auto' },
{ key: 'komenti', header: 'Komenti', width: 'auto' },
{ key: 'emri', header: 'Klienti', width: 'auto' },
{ key: 'kubikazha', header: 'Kubikazha (m³)', width: 'auto' },

  {
    key: 'actions',
    header: 'Veprimet',
    width: '120px',
    render: (_: any, row: any) => (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteFatura(row);
          }}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },

];



  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Fletedergesat</h2>
        <p className="text-sm text-gray-600">Kontrollo Fletedergesat</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-md border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-3 gap-4">
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

      {loading ? <Loader /> : <DataTable columns={columns} data={filteredFaturat.toReversed()} />}
      
    </div>
  );
};
