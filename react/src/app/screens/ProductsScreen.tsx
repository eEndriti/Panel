import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { callApi } from '../services/callApi';
import Loader from './Loader';
import { notify } from '../components/toast';
import { useConfirm } from '../components/ConfirmDialogContext.jsx';



export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    emertimi: '',
    pershkrimi: '',
    shifra: '',
    njesia: '',
    Tvsh:'',
    sasia:'',
    cmimiShitjes:''
  });
  const [loading, setLoading] = useState(true)
  const confirm = useConfirm()

  
  useEffect(() => {
    loadStock()
  },[])

  async function loadStock(){
      try {
        setLoading(true)
        const result = await callApi.getProduktet()
        setProducts(result)
      } catch (error) {
        console.log('Error',error)
      }finally{
        setLoading(false)
      }
  } 

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({  emertimi: '',pershkrimi: '',shifra: '',njesia: '',Tvsh:'',sasia:'',cmimiShitjes:'' });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      emertimi: product.emertimi,
      pershkrimi: product.pershkrimi,
      shifra: product.shifra,
      njesia: product.njesia,
      Tvsh: product.Tvsh,
      sasia: product.sasia,
      cmimiShitjes: product.cmimiShitjes,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
   const confirmed = await confirm('A jeni i sigurt?')
   
        if(confirmed){
           try {
             const result = await callApi.deleteProdukt(productId)
             notify('Produkti u eliminua me sukses!','success')
           } catch (error) {
             notify('Gabim, ju lutem provoni serish !')
           }finally{
             loadStock()
           }
        }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      try {
        const result = await callApi.updateProdukt(editingProduct.id ,formData)
        notify('Produkti u ndryshua me sukses!','success')
      } catch (error) {
        notify('Gabim, ju lutem provoni serish !')
      }finally{
        loadStock()
      }
    } else {
      try {
        const result = await callApi.createProdukt(formData)
        notify('Produkti u ruajt me sukses!','success')
      } catch (error) {
        notify('Gabim, ju lutem provoni serish !')
      }finally{
        loadStock()
      } 
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'emertimi', header: 'Emertimi', width: 'auto' },
    { key: 'pershkrimi', header: 'Pershkrimi', width: 'auto' },
    { key: 'njesia', header: 'Njesia', width: 'auto' },
    { key: 'Tvsh', header: 'TVSH %', width: 'auto' },
    { key: 'sasia', header: 'Sasia', width: 'auto' },
    { key: 'cmimiShitjes', header: 'Cmimi i Shitjes', width: 'auto' },
    
    {
      key: 'actions',
      header: 'Veprimet',
      width: '120px',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditProduct(row);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProduct(row.id);
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
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Produktet & Stoku</h2>
          <p className="text-sm text-gray-600">Menaxho Stokin dhe Produktet</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Shto nje Produkt</span>
        </button>
      </div>

      {loading ? <Loader /> : <DataTable columns={columns} data={products} />}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Ndrysho Produktin' : 'Shto Nje Produkt te Ri'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
  {/* Emertimi - Kept as is */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Emertimi *
    </label>
    <input
      type="text"
      value={formData.emertimi}
      onChange={(e) => setFormData({ ...formData, emertimi: e.target.value })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    />
  </div>

  {/* Pershkrimi */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Pershkrimi
    </label>
    <input
      type="text"
      value={formData.pershkrimi}
      onChange={(e) => setFormData({ ...formData, pershkrimi: e.target.value })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>

  {/* Row: Njesia, TVSH, Sasia, Cmimi */}
  <div className="grid grid-cols-4 gap-3">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Njesia 
      </label>
      <input
        type="text"
        value={formData.njesia}
        onChange={(e) => setFormData({ ...formData, njesia: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        TVSH %
      </label>
      <input
        type="number"
        value={formData.Tvsh}
        onChange={(e) => setFormData({ ...formData, Tvsh: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Sasia *
      </label>
      <input
        type="number"
        value={formData.sasia}
        onChange={(e) => setFormData({ ...formData, sasia: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cmimi Shitjes *
      </label>
      <input
        type="number"
        step="0.01"
        value={formData.cmimiShitjes}
        onChange={(e) => setFormData({ ...formData, cmimiShitjes: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  </div>

  {/* Buttons */}
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
      {editingProduct ? 'Ndrysho' : 'Shto'} Produktin
    </button>
  </div>
</form>
      </Modal>
    </div>
  );
};
