import { useEffect, useMemo, useState } from 'react';
import {  BarChart3 , Box , Package, Boxes , Trash2, EuroIcon } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { callApi } from '../services/callApi';
import Loader from './Loader';
import { notify } from '../components/toast';
import { useConfirm } from '../components/ConfirmDialogContext.jsx';

interface DashboardProps {
  onEditInvoice: (id: string) => void;
}



export const DashboardScreen: React.FC<DashboardProps> = ({ onEditInvoice }) => {  
    const confirm = useConfirm();
  
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

  const handleDeleteFatura = async (id: number) => {
    const confirmed = await confirm('A jeni i sigurt?');
    if (confirmed) {
      try {
        await callApi.deleteFature(id);
        notify('Fletedergesa u anulua me sukses!', 'success');
      } catch (error) {
        notify('Gabim, ju lutem provoni serish!', 'error');
      } finally {
        loadData();
      }
    }
  };

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nrPaPaguar, setNrPaPaguar] = useState(0);

  useEffect(() => {
    loadData()
  }, []);

async function loadData() {
  try {
    const result  = await callApi.getFaturat()
    const filtered = result.filter(f => !f.isDeleted);
    let sliced = filtered.slice(-5).reverse()
    
    setInvoices(sliced);
    
  } catch (error) {
    console.log('error',error)
  }finally{
    setLoading(false)
  }
}


const stats = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  return invoices.reduce(
    (acc, invoice) => {
      const invoiceDate = new Date(invoice.dataFatures);
      invoiceDate.setHours(0, 0, 0, 0);

      // TODAY
      if (invoiceDate.getTime() === today.getTime()) {
        acc.todayCount++;
        acc.todayKubikazha += invoice.kubikazha;
      }

      // YESTERDAY
      if (invoiceDate.getTime() === yesterday.getTime()) {
        acc.yesterdayCount++;
        acc.yesterdayKubikazha += invoice.kubikazha;
      }

      // THIS MONTH
      if (invoiceDate >= thisMonthStart) {
        acc.thisMonthCount++;
        acc.thisMonthKubikazha += invoice.kubikazha;
      }

      // LAST MONTH
      if (
        invoiceDate >= lastMonthStart &&
        invoiceDate <= lastMonthEnd
      ) {
        acc.lastMonthCount++;
        acc.lastMonthKubikazha += invoice.kubikazha;
      }

      return acc;
    },
    {
      todayCount: 0,
      yesterdayCount: 0,
      thisMonthCount: 0,
      lastMonthCount: 0,
      todayKubikazha: 0,
      yesterdayKubikazha: 0,
      thisMonthKubikazha: 0,
      lastMonthKubikazha: 0,
    }
  );
}, [invoices]);

const makeDiff = (today,yesterday) => {
    return  yesterday === 0
    ? today > 0
      ? 100
      : 0
    : ((today - yesterday) / yesterday) * 100;
}

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Faqja Kryesore</h2>
        <p className="text-sm text-gray-600"></p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Fletedergesat per Sot"
          value={`${stats?.todayCount?.toFixed(2)}`}
          icon={Package}
          trend={{ value: makeDiff(stats?.todayCount,stats?.yesterdayCount).toFixed(2) + ' %', isPositive: makeDiff(stats?.todayCount,stats?.yesterdayCount) >= 0 }}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Fletedergesat per kete Muaj"
          value={`${stats?.thisMonthCount?.toFixed(2)}`}
          icon={Boxes}
          trend={{ value: makeDiff(stats?.thisMonthCount,stats?.lastMonthCount).toFixed(2) + ' %', isPositive: makeDiff(stats?.thisMonthCount,stats?.lastMonthCount) >= 0 , }}
          iconColor="bg-indigo-50 text-indigo-600"
        />
       <StatCard
          title="Kubikazha per Sot"
          value={`${stats?.todayKubikazha?.toFixed(2)}`}
          icon={Box}
          trend={{ value: makeDiff(stats?.todayKubikazha,stats?.yesterdayKubikazha).toFixed(2) + ' %', isPositive: makeDiff(stats?.todayKubikazha,stats?.yesterdayKubikazha) >= 0 , }}
          iconColor="bg-green-50 text-green-600"
        />
        <StatCard
          title="Kubikazha per kete Muaj"
          value={`${stats?.thisMonthKubikazha?.toFixed(2)}`}
          icon={BarChart3 }
          trend={{ value: makeDiff(stats?.thisMonthKubikazha,stats?.lastMonthKubikazha).toFixed(2) + ' %', isPositive: makeDiff(stats?.thisMonthKubikazha,stats?.lastMonthKubikazha) >= 0 , }}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        
      </div>

      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Fletedergesat e Fundit</h3>
        {loading ? <Loader /> :<DataTable columns={columns} data={invoices} />}
      </div>
  
    </div>
  );
};
