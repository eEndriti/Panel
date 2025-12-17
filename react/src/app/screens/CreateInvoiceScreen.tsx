import React, { useState } from 'react';
import { Plus, Trash2, Save, Printer } from 'lucide-react';

interface InvoiceItem {
  product: string;
  quantity: number;
  price: number;
  total: number;
}

export const CreateInvoiceScreen: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-' + Date.now().toString().slice(-6));
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { product: '', quantity: 1, price: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const taxRate = 10; // 10% tax

  const clients = ['ABC Company', 'XYZ Corp', 'Tech Solutions', 'Global Inc', 'Local Store'];
  const products = [
    { name: 'Premium Widget', price: 49.99 },
    { name: 'Standard Gadget', price: 29.99 },
    { name: 'Deluxe Tool', price: 89.99 },
    { name: 'Basic Component', price: 15.99 },
    { name: 'Advanced Module', price: 125.00 },
  ];

  const handleAddItem = () => {
    setItems([...items, { product: '', quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'product') {
      const product = products.find(p => p.name === value);
      if (product) {
        newItems[index].price = product.price;
      }
    }
    
    newItems[index].total = newItems[index].quantity * newItems[index].price;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + tax - discount;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Create Invoice</h2>
        <p className="text-sm text-gray-600">Generate a new invoice for your client</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Invoice Details */}
        <div className="col-span-2 space-y-6">
          {/* Client & Invoice Info */}
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date *
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add any additional notes or terms..."
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Items</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-3 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left pb-3 text-sm font-semibold text-gray-700 w-24">Quantity</th>
                    <th className="text-left pb-3 text-sm font-semibold text-gray-700 w-28">Price</th>
                    <th className="text-left pb-3 text-sm font-semibold text-gray-700 w-28">Total</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select product</option>
                          {products.map((product) => (
                            <option key={product.name} value={product.name}>{product.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="py-3">
                        {items.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="pt-3">
                      <button
                        onClick={handleAddItem}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors"
                      >
                        <Plus size={16} />
                        Add Another Item
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({taxRate}%):</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Discount:</label>
                <input
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Grand Total:</span>
                  <span className="font-semibold text-gray-900 text-lg">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Save size={18} />
              Save Invoice
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <Printer size={18} />
              Print Invoice
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <Save size={18} />
              Save & Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};