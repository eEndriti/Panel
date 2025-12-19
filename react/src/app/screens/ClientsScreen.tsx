import React, { useState,useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { callApi } from '../services/callApi';
import {  notify } from '../components/toast';
import { useConfirm } from '../components/ConfirmDialogContext.jsx';
import {CircleLoader} from 'react-spinners'

export const ClientsScreen: React.FC = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    emri: '',
    nrTelefonit: '',
    email: '',
    adresa: '',
    nrBiznesit:'',
    nrFiskal:'',
    nrTvsh:''
  });
  const [loading, setLoading] = useState(true)
  const confirm = useConfirm()

    useEffect(() => {
      loadClients();
  }, []);


  async function loadClients() {
      try {
        setLoading(true)
        const data = await callApi.getKlientet(); 
        setClients(data);
      } catch (error) {
        console.log('error fetching clients',error)
      }finally{
        setLoading(false)
      }
    }

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({ emri: '', nrTelefonit: '', email: '', adresa: '',nrBiznesit:'',nrFiskal:'',nrTvsh:'' });
    setIsModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setFormData({
      emri: client.emri,
      nrTelefonit: client.nrTelefonit,
      email: client.email,
      adresa: client.adresa,
      nrBiznesit:client.nrBiznesit,
      nrFiskal:client.nrFiskal,
      nrTvsh:client.nrTvsh
    });
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (clientId: number) => {

    const confirmed = await confirm('A jeni i sigurt?')

     if(confirmed){
        try {
          const result = await callApi.deleteKlient(clientId)
          notify('Klienti u eliminua me sukses!','success')
        } catch (error) {
          notify('Gabim, ju lutem provoni serish !')
        }finally{
          loadClients()
        }
     }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
       try {
        const result = await callApi.updateKlient(editingClient.id ,formData)
        notify('Klienti u ndryshua me sukses!','success')
      } catch (error) {
        notify('Gabim, ju lutem provoni serish !')
      }finally{
        loadClients()
      }
    } else {
      try {
        const result = await callApi.createKlient(formData)
        notify('Klienti u ruajt me sukses!','success')
      } catch (error) {
        notify('Gabim, ju lutem provoni serish !')
      }finally{
        loadClients()
      }
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'emri', header: 'Emertimi', width: '180px' },
    { key: 'nrTelefonit', header: 'Nr Telefonit', width: '140px' },
    { key: 'email', header: 'Email', width: 'auto' },
    { key: 'adresa', header: 'Adresa', width: '200px' },
    { key: 'detyrimet', header: 'Detyrimet', width: '120px' },
    {
      key: 'actions',
      header: 'Veprimet',
      width: '120px',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClient(row);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClient(row.id);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Klientet</h2>
          <p className="text-sm text-gray-600">Menaxho Klientet</p>
        </div>
        <button
          onClick={handleAddClient}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Shto Klientin</span>
        </button>
      </div>

      {loading ? <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          height: '70vh',
                          width: '100%' 
                      }}>
                    <CircleLoader color='#1502ec' size={60} />
                  </div>
                :<DataTable columns={columns} data={clients} />}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Ndrysho Klientin' : 'Shto nje Klient'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emertimi *
            </label>
            <input
              type="text"
              value={formData.emri}
              onChange={(e) => setFormData({ ...formData, emri: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nr Telefonit *
            </label>
            <input
              type="tel"
              value={formData.nrTelefonit}
              onChange={(e) => setFormData({ ...formData, nrTelefonit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresa
            </label>
            <textarea
              value={formData.adresa}
              onChange={(e) => setFormData({ ...formData, adresa: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nr Biznesit </label>
              <input
                type="number"
                value={formData.nrBiznesit}
                onChange={(e) => setFormData({ ...formData, nrBiznesit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nr Fiskal</label>
              <input
                type="number"
                value={formData.nrFiskal}
                onChange={(e) => setFormData({ ...formData, nrFiskal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nr TVSH</label>
              <input
                type="number"
                value={formData.nrTvsh}
                onChange={(e) => setFormData({ ...formData, nrTvsh: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Anulo
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingClient ? 'Ndrysho' : 'Shto'} Klientin
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
