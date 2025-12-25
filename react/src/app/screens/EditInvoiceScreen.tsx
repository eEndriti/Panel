import React, { useEffect, useState } from 'react';
// REMOVED useParams and useNavigate since you use manual state navigation
import { callApi } from '../services/callApi';
import Select from "react-select";
import InvoiceProductsTable from './InvoiceProductsTable';
import InvoiceActions from './InvoiceActions';
import { InvoicePrint } from './InvoicePrint';
import { notify } from '../components/toast';

interface Client { id: string; emri: string; }

interface EditInvoiceProps {
  invoiceId: string | null;
  onBack: () => void;
}

export const EditInvoiceScreen: React.FC<EditInvoiceProps> = ({ invoiceId, onBack }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [kompaniaFetched, setKompaniaFetched] = useState([]);
  const [klientet, setKlientet] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [nrFatures, setNrFatures] = useState('');
  const [stoku, setStoku] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    rows: [],
    total: 0
  });
  const [komenti, setKomenti] = useState('');
  const [loadingSaveBtn, setLoadingSaveBtn] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false)

  useEffect(() => {
    if (invoiceId) {
      loadInitialData();
    }
  }, [invoiceId]);

  async function loadInitialData() {
    try {
      setLoading(true);
      // Ensure we use invoiceId here
      const [kompania, listaKlienteve, listaProdukteve, existingInvoice] = await Promise.all([
        callApi.getKompania(),
        callApi.getKlientet(),
        callApi.getProduktet(),
        callApi.getFaturaMeId(invoiceId) 
      ]);

      setKompaniaFetched(kompania);
      setKlientet(listaKlienteve);
      setStoku(listaProdukteve);
      setNrFatures(existingInvoice.nrFatures);
      setSelectedClient(existingInvoice.klientId);
      
      if (existingInvoice.data) {
      const dateObj = new Date(existingInvoice.data);
      const formattedDate = dateObj.toISOString().split('T')[0]; 
      setInvoiceDate(formattedDate);
    }
      setKomenti(existingInvoice.komenti || '');
      console.log(existingInvoice)
      
     try {
      setProductsLoading(true)
         const result = await callApi.getFaturaProduktet(existingInvoice.id);

          setInvoiceData({
            
            rows: result,
            total: result.reduce(
              (sum, item) => sum + item.cmimiPerCop * item.sasiaShitjes,
              0
            )
          });

     } catch (error) {
      
     }finally{
      setProductsLoading(false)
     }

    } catch (error) {
      console.error('Error loading invoice:', error);
      notify('Gabim në ngarkimin e të dhënave', 'error');
    } finally {
      setLoading(false);
    }
  }
      console.log(invoiceData)

  const options = klientet.map(k => ({
    value: k.id,
    label: k.emri
  }));

  const handleInvoiceChange = ({ rows, total }) => {
    setInvoiceData({ rows, total });
  };

  const updateInvoice = async (totaliPaguar: number) => {
    let klienti = klientet.find(k => k.id === selectedClient);
    const totaliPerPagese = Number(invoiceData.total) || 0;
    const totaliPaguarFinal = Number(totaliPaguar) || 0;
    const mbetjaPerPagese = Math.max(totaliPerPagese - totaliPaguarFinal, 0);

    const updatedData = {
      nrFatures,
      klientId: selectedClient,
      data: invoiceDate,
      komenti,
      invoiceData,
      totaliPerPagese,
      totaliPaguar: totaliPaguarFinal,
      mbetjaPerPagese,
    };

    try {
      setLoadingSaveBtn(true);
      // Ensure we use invoiceId here
      await callApi.updateFature(invoiceId, updatedData); 
      notify('Fatura u përditësua me sukses!', 'success');
      
      InvoicePrint(klienti, nrFatures, invoiceDate, komenti, invoiceData, kompaniaFetched[0], totaliPaguarFinal, mbetjaPerPagese);
      
    } catch (error) {
      notify('Gabim gjatë përditësimit!', 'error');
    } finally {
      setLoadingSaveBtn(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Duke ngarkuar të dhënat...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edito Faturën: {nrFatures}</h2>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">
          Kthehu Mbrapa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Klienti *</label>
                <Select
                  options={options}
                  value={options.find(o => o.value == selectedClient)}
                  onChange={(opt) => setSelectedClient(opt?.value || '')}
                  isSearchable
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nr i Fatures</label>
                <input type="text" value={nrFatures} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data e Fatures *</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Komenti</label>
                <textarea
                  value={komenti}
                  onChange={(e) => setKomenti(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-5">
           {productsLoading ? 'Loading' : <InvoiceProductsTable 
              key={invoiceData.rows.length}   // 👈 FORCE REMOUNT
              products={stoku} 
              //initialRows={invoiceData.rows}
              onChange={handleInvoiceChange}
            />}
          </div>
        </div>

        <InvoiceActions 
          invoiceData={invoiceData} 
          onCancel={onBack} 
          onRegister={updateInvoice} 
          disabledButton={invoiceData.rows?.length < 1 || !selectedClient} 
          loadingSaveBtn={loadingSaveBtn}
          //label="Përditëso Faturën"
        />
      </div>
    </div>
  );
};