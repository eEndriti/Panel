import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Printer } from 'lucide-react';
import { callApi } from '../services/callApi';
import Select from "react-select";
import InvoiceProductsTable from './InvoiceProductsTable';
import InvoiceActions from './InvoiceActions';
import { InvoicePrint } from './InvoicePrint';
import {  notify } from '../components/toast';


interface Client { id: string; emri: string; }


export const CreateInvoiceScreen: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [kompaniaFetched, setKompaniaFetched] = useState([])
  const [klientet, setKlientet] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false)
  const [nrFatures, setNrFatures] = useState()
  const [stoku, setStoku] = useState([])
  const [invoiceData, setInvoiceData] = useState({
    rows: [],
    total: 0
  });
  const [komenti, setKomenti] = useState('')
  const [loadingSaveBtn, setLoadingSaveBtn] = useState(false)
  
    useEffect(()=>{
      loadData()
    },[])
  
    async function loadData() {
      try {
        setLoading(true)
        const kompaniaFetched = await callApi.getKompania()
        const klientet = await callApi.getKlientet()
        const stoku = await callApi.getProduktet()
        const nrFatures = await callApi.getInvoiceNr()
        setKompaniaFetched(kompaniaFetched)
        setKlientet(klientet)
        setStoku(stoku)
        const nextNr = nrFatures[0]?.nextNr ?? 0;
        setNrFatures(`F${nextNr.toString().padStart(3, "0")}`);
      } catch (error) {
        console.log('error',error)
      }finally{
        setLoading(false)
      }
    }

    const options = klientet.map(k => ({
        value: k.id,
        label: k.emri
      }));

  const handleInvoiceChange = ({ rows, total }) => {
    setInvoiceData({ rows, total });
  };


  const  saveInvoice = async (totaliPaguar) => {
     let klienti = klientet.find(k => k.id == selectedClient)
    //nrFatures,klientId,data,komenti,totaliPerPagese,TotaliPaguar,mbetja, isDeleted = false
    //produktet, idFatura,idProdukt,sasia,cmimiPerCop,
    //lloji = Fature , referenca (nrFatures),klientiId,totaliPerPagse,totaliPaguar,mbetja,data
    //invoiceCounter ++1
   const totaliPerPagese = Number(invoiceData.total) || 0;
    const totaliPaguarFinal = Number(totaliPaguar) || 0;
    const mbetjaPerPagese = Math.max(
      totaliPerPagese - totaliPaguarFinal,
      0
    );
    
    const dataPerFature = {
      nrFatures,
      klientId: klienti?.id ?? '',
      data: new Date().toISOString().split('T')[0],
      komenti,
      invoiceData,
      lloji: 'Fature',
      isDeleted: false,
      totaliPerPagese,
      totaliPaguar: totaliPaguarFinal,
      mbetjaPerPagese
    };
    try {
      setLoadingSaveBtn(true)
      const result = await callApi.createFature(dataPerFature)
       notify('Fatura u Regjistrua me Sukses!','success')

    } catch (error) {
       notify('Gabim gjate Regjistrimit!','error')
    }finally{
      setLoadingSaveBtn(false)
      window.location.reload()
    }

    InvoicePrint(klienti,nrFatures,formattedDate,komenti,invoiceData,kompaniaFetched[0],totaliPaguarFinal,mbetjaPerPagese) // klient data,nr fatures,data fatures,komenti,produktet,totalet
  }

  const formattedDate = invoiceDate.split('-').reverse().join('-');

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Left Column - Invoice Details */}
        <div className="col-span-2 space-y-6">
          {/* Client & Invoice Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Informatat e Fatures</h3>

            <div className="grid grid-cols-4 md:grid-cols-4 gap-5">
              {/* Klienti */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Klienti *
                </label>
                <Select
                  options={options}
                  onChange={(opt) => setSelectedClient(opt.value)}
                  placeholder="Selekto ose shkruaj klient"
                  isSearchable
                  classNamePrefix="react-select"
                />
              </div>

              {/* Nr i Fatures */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nr i Fatures
                </label>
                <input
                  type="text"
                  value={nrFatures}
                  onChange={(e) => setNrFatures(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  readOnly
                />
              </div>

              {/* Data e Fatures */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Fatures *
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Komenti
                </label>
                <textarea
                  value={komenti}
                  onChange={(e) => setKomenti(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              { /*<div className="w-75">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komenti
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}  // smaller textarea for cleaner layout
                placeholder="Shto Koment..."
              />
            </div>*/}
            </div>

            {/* Komenti */}
            
          </div>


          {/* Items Table */}
          <div className="bg-white rounded-md border border-gray-200 p-5">
           <InvoiceProductsTable products={stoku} onChange={handleInvoiceChange}/>
          </div>
        </div>

        {/* Bottom Column - Actions */}
        <InvoiceActions invoiceData = {invoiceData} onCancel = {() => ''} onRegister ={saveInvoice} disabledButton = {invoiceData?.rows?.length < 1 || !selectedClient} loadingSaveBtn = {loadingSaveBtn}/>

      </div>
    </div>
  );
};