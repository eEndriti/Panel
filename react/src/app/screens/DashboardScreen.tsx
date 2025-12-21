import { useEffect, useMemo, useState } from 'react';
import { DollarSign, TrendingUp, FileText, Package, Pencil, Trash2, EuroIcon } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { callApi } from '../services/callApi';
import Loader from './Loader';


const columns = [
  { key: 'id', header: 'Nr #', width: 'auto' },
  { 
    key: 'data', 
    header: 'Data Fatures', 
    width: 'auto',
    render: (value: string) => formatToAlbanianDate(value)
  },
  { key: 'nrFatures', header: 'Nr i Fatures', width: 'auto' },
  { key: 'totaliPerPagese', header: 'Totali Per Pagese', width: 'auto' },
  { 
      key: 'mbetja', 
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTransaction(row.id);
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  
];
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

  const handleDeleteTransaction = async (transaksionId: number) => {
    const confirmed = await confirm('A jeni i sigurt?')
    
       
  };

  const handleEditTransaction = (product: any) => {
    alert('Hala su bo')
   
  };

export const DashboardScreen: React.FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nrPaPaguar, setNrPaPaguar] = useState(0);
  const [faturimetSot, setFaturimetSot] = useState()
  
  useEffect(() => {
    loadData()
  }, []);

  async function loadData() {
    try {
      const result  = await callApi.getFaturat()
      const getNr = await callApi.getNrPaPaguar()
      setNrPaPaguar(getNr[0][''])
      setInvoices(result)
      
    } catch (error) {
      console.log('error',error)
    }finally{
      setLoading(false)
    }
  }



const stats = useMemo(() => {
  const now = new Date();
  
  // 1. Setup Date Reference Strings
  const todayStr = now.toDateString();
  
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(now.getMonth() - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  // 2. Single Pass Calculation
  return invoices.reduce((acc: any, curr: any) => {
    const itemDate = new Date(curr.data);
    const itemDateStr = itemDate.toDateString();
    const itemMonth = itemDate.getMonth();
    const itemYear = itemDate.getFullYear();
    const amount = Number(curr.totaliPerPagese) || 0;

    // Day Checks
    if (itemDateStr === todayStr) {
      acc.todayTotal += amount;
    } else if (itemDateStr === yesterdayStr) {
      acc.yesterdayTotal += amount;
    }

    // Month Checks
    if (itemMonth === currentMonth && itemYear === currentYear) {
      acc.thisMonthTotal += amount;
    } else if (itemMonth === lastMonth && itemYear === lastMonthYear) {
      acc.lastMonthTotal += amount;
    }
      acc.todayDiff = ((acc.todayTotal-acc.yesterdayTotal)/acc.yesterdayTotal)*100
      acc.monthDiff = ((acc.thisMonthTotal - acc.lastMonthTotal)/acc.lastMonthTotal)*100

    return acc;
  }, { 
    todayTotal: 0, 
    yesterdayTotal: 0, 
    thisMonthTotal: 0, 
    lastMonthTotal: 0 
  });
}, [invoices]);


  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Faqja Kryesore</h2>
        <p className="text-sm text-gray-600"></p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          title="Faturimet per Sot"
          value={`${stats?.todayTotal?.toFixed(2)}`}
          icon={EuroIcon}
          trend={{ value: stats?.todayDiff?.toFixed(2) + ' %', isPositive: stats?.todayDiff > 0 , }}
          iconColor="bg-green-50 text-green-600"
        />
        <StatCard
          title="Faturimet per kete Muaj"
          value={`${stats?.thisMonthTotal?.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: stats?.monthDiff?.toFixed(2)  + ' %', isPositive: stats?.monthDiff > 0 , }}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Nr i Faturave te Pa Paguara"
          value={`${nrPaPaguar || ''}`}
          icon={FileText}
          iconColor="bg-yellow-50 text-yellow-600"
        />
        
      </div>

      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Faturat e Fundit</h3>
        {loading ? <Loader /> :<DataTable columns={columns} data={invoices.toReversed()} />}
      </div>
    </div>
  );
};
