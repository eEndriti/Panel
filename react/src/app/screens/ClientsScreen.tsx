import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';

const mockClients = [
  { id: 1, name: 'ABC Company', phone: '(555) 123-4567', email: 'contact@abccompany.com', address: '123 Main St, City', balance: '$1,250.00' },
  { id: 2, name: 'XYZ Corp', phone: '(555) 234-5678', email: 'info@xyzcorp.com', address: '456 Oak Ave, Town', balance: '$0.00' },
  { id: 3, name: 'Tech Solutions', phone: '(555) 345-6789', email: 'hello@techsolutions.com', address: '789 Pine Rd, Village', balance: '$890.00' },
  { id: 4, name: 'Global Inc', phone: '(555) 456-7890', email: 'contact@globalinc.com', address: '321 Elm St, City', balance: '$0.00' },
  { id: 5, name: 'Local Store', phone: '(555) 567-8901', email: 'info@localstore.com', address: '654 Maple Dr, Town', balance: '$450.00' },
];

export const ClientsScreen: React.FC = () => {
  const [clients, setClients] = useState(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId: number) => {
    setClients(clients.filter(c => c.id !== clientId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      setClients([...clients, { 
        id: clients.length + 1, 
        ...formData, 
        balance: '$0.00' 
      }]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'name', header: 'Name', width: '180px' },
    { key: 'phone', header: 'Phone', width: '140px' },
    { key: 'email', header: 'Email', width: 'auto' },
    { key: 'address', header: 'Address', width: '200px' },
    { key: 'balance', header: 'Balance', width: '120px' },
    {
      key: 'actions',
      header: 'Actions',
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
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Clients</h2>
          <p className="text-sm text-gray-600">Manage your client database</p>
        </div>
        <button
          onClick={handleAddClient}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Client</span>
        </button>
      </div>

      <DataTable columns={columns} data={clients} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
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
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
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
              {editingClient ? 'Update' : 'Add'} Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
