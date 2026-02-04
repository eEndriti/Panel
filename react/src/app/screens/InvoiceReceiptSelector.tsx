import { useState, useEffect, useMemo } from "react";
import { Receipt } from "./types";
import { callApi } from "../services/callApi";

type Props = {
  receipts: Receipt[];
  // Callback that returns the modified ingredients with calculated totals
  onIngredientsChange?: (data: any[]) => void; 
  totaliKubikazhesSend:BigInteger;
  recepturaSelektuar?: (data: any[]) => void;
};

type Ingredient = {
  emertimi: string;
  pershkrimi: string;
  sasia: number;
  njesia: string;
};

export function InvoiceReceiptSelector({ receipts, onIngredientsChange,totaliKubikazhesSend,recepturaSelektuar }: Props) {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [totaliKubikazhes, setTotaliKubikazhes] = useState<number>(1);

  // Load raw ingredients when receipt is selected
  useEffect(() => {
    if (!selectedReceipt) return;
    async function loadIngredients() {
      setLoading(true);
      try {
        const data = await callApi.getProduktet(selectedReceipt);
        setIngredients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadIngredients();
  }, [selectedReceipt]);

  // Calculate and notify parent whenever ingredients or multiplier changes
  useEffect(() => {
    const updatedIngredients = ingredients.map(ing => ({
      ...ing,
      sasiaTotale: ing.sasia * totaliKubikazhes
    }));
    
    if (onIngredientsChange) {
      onIngredientsChange(updatedIngredients);
      totaliKubikazhesSend(totaliKubikazhes)
      recepturaSelektuar(selectedReceipt)
    }
  }, [ingredients, totaliKubikazhes]);

  return (
<div className="w-full space-y-6">
  {/* Header Section: Now with a max-width constraint for a tighter look */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-6  p-4 rounded-xl   max-w-3xl mx-auto">
    
    {/* Receipt Selector - Width now constrained */}
    <div className="w-full md:w-3/5"> 
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Zgjidh Recetën
      </label>
      <select
        className="w-full border border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer text-sm"
        value={selectedReceipt?.id || ""}
        onChange={(e) => {
          const receipt = receipts.find((r) => r.id === Number(e.target.value));
          if (receipt) setSelectedReceipt(receipt);
        }}
      >
        <option value="">-- Selekto --</option>
        {receipts.map((r) => (
          <option key={r.id} value={r.id}>
            {r.emertimi}
          </option>
        ))}
      </select>
    </div>


  </div>

  {/* Table Section */}
  {selectedReceipt && (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl overflow-hidden border border-gray-200 rounded-xl shadow-md bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3.5 font-semibold text-gray-400 w-12 text-center">#</th>
              <th className="px-4 py-3.5 font-semibold text-gray-700">Përbërësi / Materiali</th>
              <th className="px-4 py-3.5 font-semibold text-gray-700 text-center">Sasia Bazë</th>
              <th className="px-4 py-3.5 font-semibold text-gray-700 text-right">Totali Final</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-12">
                  <div className="flex justify-center items-center space-x-2 text-gray-400 italic">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Duke u ngarkuar...</span>
                  </div>
                </td>
              </tr>
            ) : ingredients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 italic">
                  Nuk u gjet asnjë përbërës për këtë recetë.
                </td>
              </tr>
            ) : (
              ingredients.map((ing, i) => (
                <tr key={i} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-4 py-4 text-center text-gray-400 font-mono text-xs">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {ing.emertimi}
                    </div>
                    {ing.pershkrimi && (
                      <div className="text-[11px] text-gray-500 mt-0.5 italic">
                        {ing.pershkrimi}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600 font-medium">
                    {ing.sasia} <span className="text-[10px] text-gray-400">{ing.njesia}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100 group-hover:bg-blue-100/50 group-hover:border-blue-200 transition-all">
                      {(ing.sasia * totaliKubikazhes).toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </span>
                    <span className="ml-1.5 text-[10px] font-bold text-blue-600/70 uppercase">
                      {ing.njesia}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Footer containing the Multiplier aligned to the right */}
            <tfoot className="bg-gray-50/50 border-t border-gray-200">
              <tr>
                <td colSpan={4} className="p-4">
                  {/* Flex container to push the input to the right */}
                  <div className="flex justify-end">
                    <div className="w-full md:w-auto min-w-[180px] max-w-[220px]">
                      <div className="flex justify-between items-end mb-1.5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Kubikazha (m³)
                        </label>
                        {totaliKubikazhes !== 1 && (
                          <button 
                            onClick={() => setTotaliKubikazhes(1)}
                            className="text-[10px] text-blue-600 hover:underline font-medium"
                          >
                            Reset në 1
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <input
                          type="number"
                          min={1}
                          value={totaliKubikazhes}
                          onChange={(e) => setTotaliKubikazhes(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 bg-white shadow-sm group-hover:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-blue-600 text-right"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-blue-500">
                          ×
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
        </table>
      </div>
    </div>
  )}
</div>
  );
}