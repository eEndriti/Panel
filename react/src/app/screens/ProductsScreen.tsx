import React, { useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';

const mockProducts = [
  { id: 1, name: 'Premium Widget', sku: 'WDG-001', price: '$49.99', quantity: 150, lowStock: false },
  { id: 2, name: 'Standard Gadget', sku: 'GDG-002', price: '$29.99', quantity: 8, lowStock: true },
  { id: 3, name: 'Deluxe Tool', sku: 'TL-003', price: '$89.99', quantity: 45, lowStock: false },
  { id: 4, name: 'Basic Component', sku: 'CMP-004', price: '$15.99', quantity: 220, lowStock: false },
  { id: 5, name: 'Advanced Module', sku: 'MOD-005', price: '$125.00', quantity: 5, lowStock: true },
  { id: 6, name: 'Professional Kit', sku: 'KIT-006', price: '$199.99', quantity: 12, lowStock: false },
  { id: 7, name: 'Starter Pack', sku: 'STR-007', price: '$34.99', quantity: 3, lowStock: true },
];

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', sku: '', price: '', quantity: '' });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.replace('$', ''),
      quantity: product.quantity.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(formData.quantity);
    const productData = {
      name: formData.name,
      sku: formData.sku,
      price: `$${parseFloat(formData.price).toFixed(2)}`,
      quantity: qty,
      lowStock: qty <= 10,
    };

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productData }
          : p
      ));
    } else {
      setProducts([...products, { id: products.length + 1, ...productData }]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'name', header: 'Product Name', width: 'auto' },
    { key: 'sku', header: 'SKU', width: '120px' },
    { key: 'price', header: 'Sale Price', width: '120px' },
    {
      key: 'quantity',
      header: 'Quantity',
      width: '120px',
      render: (quantity: number, row: any) => (
        <div className="flex items-center gap-2">
          <span>{quantity}</span>
          {row.lowStock && (
            <div className="text-red-600" title="Low stock">
              <AlertCircle size={16} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
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
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Products & Stock</h2>
          <p className="text-sm text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <DataTable columns={columns} data={products} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingProduct ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
