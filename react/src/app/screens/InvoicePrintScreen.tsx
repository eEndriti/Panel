import React, { useEffect, useState } from 'react';
import { callApi } from '../services/callApi';
import Loader from './Loader';

export const InvoicePrintScreen: React.FC = () => {

  const invoiceData = {
    number: 'INV-001234',
    date: 'December 16, 2025',
    dueDate: 'January 15, 2026',
    company: {
      name: 'Acme Corporation',
      address: '123 Business Street',
      city: 'New York, NY 10001',
      phone: '(555) 123-4567',
      email: 'billing@acmecorp.com',
    },
    client: {
      name: 'ABC Company',
      address: '456 Client Avenue',
      city: 'Los Angeles, CA 90001',
      phone: '(555) 987-6543',
    },
    items: [
      { description: 'Premium Widget', quantity: 5, price: 49.99, total: 249.95 },
      { description: 'Standard Gadget', quantity: 10, price: 29.99, total: 299.90 },
      { description: 'Deluxe Tool', quantity: 3, price: 89.99, total: 269.97 },
      { description: 'Basic Component', quantity: 15, price: 15.99, total: 239.85 },
    ],
    subtotal: 1059.67,
    tax: 105.97,
    discount: 50.00,
    total: 1115.64,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-md border border-gray-200 shadow-sm">
          {/* A4 Print Layout */}
          <div className="p-12" style={{ minHeight: '297mm', width: '210mm' }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
              <div>
                <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center mb-3">
                  <span className="text-white text-xl font-semibold">BM</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">{invoiceData.company.name}</h1>
                <p className="text-sm text-gray-600">{invoiceData.company.address}</p>
                <p className="text-sm text-gray-600">{invoiceData.company.city}</p>
                <p className="text-sm text-gray-600">{invoiceData.company.phone}</p>
                <p className="text-sm text-gray-600">{invoiceData.company.email}</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">INVOICE</h2>
                <p className="text-sm text-gray-600 mb-1">Invoice #: <span className="font-medium text-gray-900">{invoiceData.number}</span></p>
                <p className="text-sm text-gray-600 mb-1">Date: <span className="font-medium text-gray-900">{invoiceData.date}</span></p>
                <p className="text-sm text-gray-600">Due Date: <span className="font-medium text-gray-900">{invoiceData.dueDate}</span></p>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">BILL TO:</h3>
              <p className="text-sm font-medium text-gray-900">{invoiceData.client.name}</p>
              <p className="text-sm text-gray-600">{invoiceData.client.address}</p>
              <p className="text-sm text-gray-600">{invoiceData.client.city}</p>
              <p className="text-sm text-gray-600">{invoiceData.client.phone}</p>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-t border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 w-24">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 w-28">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 w-32">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">${invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="text-gray-900">${invoiceData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-gray-900">-${invoiceData.discount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-semibold text-gray-900 text-lg">${invoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-6 mt-12">
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Terms:</h4>
                <p className="text-sm text-gray-600">Payment is due within 30 days. Please make checks payable to {invoiceData.company.name}.</p>
              </div>
              
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Authorized Signature:</h4>
                <div className="border-b border-gray-300 w-64 mb-1"></div>
                <p className="text-xs text-gray-500">Authorized Representative</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Print Invoice
          </button>
          <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
