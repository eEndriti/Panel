import React, { useEffect, useState } from 'react';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { callApi } from '../services/callApi';
import Loader from './Loader';
import { notify } from '../components/toast';
import { useConfirm } from '../components/ConfirmDialogContext.jsx';


export const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const formatLocalValue = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [dateFrom, setDateFrom] = useState(() => {
    const now = new Date();
    // First day of current month: Year, Month, 1
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return formatLocalValue(firstDay);
  });

  const [dateTo, setDateTo] = useState(() => {
    const now = new Date();
    // Last day of current month: Year, Month + 1, 0
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return formatLocalValue(lastDay);
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Fature');
  const confirm = useConfirm()

  useEffect(()=> {
    loadTransactions()
  },[])

 async function loadTransactions(){
    try {
      setLoading(true)
      const result = await callApi.getTransaksionet()
      setTransactions(result)
      
    } catch (error) {
      console.log('Error',error)
    }finally{
      setLoading(false)
    }
  }

const filteredTransactions = React.useMemo(() => {
  return transactions.filter((t: any) => {
    // 1. Date Filtering
    // Convert mssql date and input dates to timestamps for comparison
    const transDate = new Date(t.data).getTime();
    const start = new Date(dateFrom).setHours(0, 0, 0, 0);
    const end = new Date(dateTo).setHours(23, 59, 59, 999);
    const matchesDate = transDate >= start && transDate <= end;
    // 2. Type Filtering
    // Matches your select values (invoice, payment, etc.) to your data values
    const typeMap: Record<string, string> = {
      Fature: 'Fature',
      Pagese: 'Pagese',
      Ndryshim: 'Ndryshim'
    };
    const matchesType = typeFilter === 'Te Gjitha Llojet' || t.lloji === typeMap[typeFilter];
    // 3. Search Term Filtering (Case Insensitive)
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

  const day = date.getDate();
  const month = ALBANIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

  const columns = [
   { 
    key: 'data', 
    header: 'Data Transaksionet', 
    width: 'auto',
    render: (value: string) => formatToAlbanianDate(value)
  },
    {
      key: 'lloji',
      header: 'Lloji',
      width: 'auto',
      render: (type: string) => {
        const colors = {
          Fature: 'bg-blue-50 text-blue-700',
          Pagese: 'bg-green-50 text-green-700',
          Ndryshim: 'bg-orange-50 text-orange-700'
        };
        return (
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${colors[type as keyof typeof colors]}`}>
            {type}
          </span>
        );
      }
    },
    { key: 'referenca', header: 'Referenca', width: 'auto' },
    { key: 'emri', header: 'Klienti', width: 'auto' },
    { key: 'totaliPerPagese', header: 'totaliPerPagese', width: 'auto' },
    { key: 'totaliPaguar', header: 'Totali i Paguar', width: 'auto' },
    { 
      key: 'mbetjaPerPagese', 
      header: 'Mbetja Per Pagese', 
      width: 'auto',
      render: (value: any) => {
        // Convert to number to ensure the comparison works correctly
        const amount = Number(value);

        if (amount > 0) {
          return (
            <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
              {amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </span>
          );
        }

        return (
          <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
            0.00 €
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Veprimet',
      width: '120px',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditTransaction(row);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Pencil size={16} />
          </button>
          {row.lloji !== 'Ndryshim' && <button disabled = {row.lloji  == 'Ndryshim'}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTransaction(row.id);
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>}
        </div>
      ),
    },
  ];

  const handleDeleteTransaction = async (transaksionId: number) => {
    const confirmed = await confirm('A jeni i sigurt?')
    
        if(confirmed){
            try {
              const result = await callApi.deleteTransaksion(transaksionId)
              notify('Transaksioni u anulua me sukses!','success')
            } catch (error) {
              notify('Gabim, ju lutem provoni serish !')
            }finally{
              loadTransactions()
            }
        }
  };

  const handleEditTransaction = (product: any) => {
    alert('Hala su bo')
    loadTransactions();
  };

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nga Data
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
              Deri me
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
              Lloji
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Te Gjitha Llojet">Te Gjitha Llojet</option>
              <option value="Fature">Fature</option>
              <option value="Pagese">Pagese</option>
              <option value="Ndryshim">Ndryshim</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kerko...
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Referenca ose Klienti..."
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      {loading ? <Loader /> :<DataTable columns={columns} data={filteredTransactions} />}
    </div>
  );
};
