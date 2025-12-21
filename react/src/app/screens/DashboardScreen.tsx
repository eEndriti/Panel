import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, FileText, Package, Pencil, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    loadData()
  }, []);

  async function loadData() {
    console.log('vv')
    try {
      const result  = await callApi.getFaturat()
      const getNr = await callApi.getNrPaPaguar()
      setNrPaPaguar(getNr[0][''])
      console.log('nr pa paguar',getNr)
      console.log(result)
      setInvoices(result)
    } catch (error) {
      console.log('error',error)
    }finally{
      setLoading(false)
    }
  }
 

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-600">Overview of your business metrics</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
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
        
      </div>

      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Faturat e Fundit</h3>
        {loading ? <Loader /> :<DataTable columns={columns} data={invoices.toReversed()} />}
      </div>
    </div>
  );
};
