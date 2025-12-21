import React, { useState } from "react";

export default function InvoiceActions({invoiceData,onCancel,onRegister,disabledButton}) {
  const [totaliPaguar, setTotaliPaguar] = useState(0);

  const mbetjaPerPagese = Math.max(invoiceData.total - totaliPaguar, 0);

  return (
    <div className="bg-white rounded-md border border-gray-200 p-5 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
      
      {/* Left: Buttons */}
      <div className="flex gap-4 flex-1 w-auto md:w-auto">
        <button
          onClick={onCancel}
          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Anulo
        </button>
        <button
            disabled={disabledButton}
            onClick={() => onRegister(totaliPaguar)}
            className={`flex-1 px-6 py-3 rounded-md text-lg font-semibold transition-colors
                ${disabledButton 
                ? "bg-green-300 text-white cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
            Regjistro
            </button>
      </div>

      {/* Right: Totals */}
      <div className="flex-1 md:flex-none w-full md:w-auto border border-gray-200 rounded-md p-4 bg-gray-50">
        <div className="space-y-3 text-sm md:text-base">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Totali i Fatures:</span>
            <span className="text-gray-900 font-semibold">
              {invoiceData.total.toFixed(2)} €
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium mr-2">Totali i Paguar:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              max = {invoiceData.total}
              value={totaliPaguar}
              onChange={(e) => setTotaliPaguar(parseFloat(e.target.value) || 0)}
              className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium mr-1">Mbetja per Pagese:</span>
            <span className="text-gray-900 font-semibold">{mbetjaPerPagese.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
