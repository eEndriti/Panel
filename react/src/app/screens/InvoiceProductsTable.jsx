import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function InvoiceProductsTable({ products, onChange }) {
  const [rows, setRows] = useState([]);
  // Calculate totals
  const calculateTotals = (rows) => {
    const total = rows.reduce((acc, r) => acc + (r.totaliProduktit || 0), 0);

    return { total };
  };

  // Notify parent whenever rows change
  useEffect(() => {
    if (onChange) {
      onChange({ rows, ...calculateTotals(rows) });
    }
  }, [rows]);

const addRow = () => {
  setRows([
    ...rows,
    {
      Nr: rows.length + 1, // row number
      selectedProduct: null,
      sasia: 1,
      cmimiShitjes: 0,
      totaliProduktit: 0,
      stock: 0,
      pershkrimi: "",
      emertimi: "",
    },
  ]);
};

const removeRow = (index) => {
  const updated = [...rows];
  updated.splice(index, 1);
  // Recalculate row numbers
  updated.forEach((row, i) => (row.Nr = i + 1));
  setRows(updated);
};

  const handleProductSelect = (index, selected) => {
    const updated = [...rows];
    updated[index].selectedProduct = selected;
    updated[index].emertimi = selected.emertimi;
    updated[index].pershkrimi = selected.pershkrimi;
    updated[index].cmimiShitjes = selected.cmimiShitjes || 0;
    updated[index].stock = selected.sasia;
    updated[index].sasia = 1;
    updated[index].njesia = selected.njesia;
    updated[index].totaliProduktit = 1 * updated[index].cmimiShitjes;
    setRows(updated);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = Number(value);
    const { sasia, cmimiShitjes } = updated[index];
    updated[index].totaliProduktit = sasia * cmimiShitjes;
    setRows(updated);
  };

  const { total } = calculateTotals(rows);

  return (
    <div className="bg-white rounded-md border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Produkte te Fatures</h3>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-3 py-2">Nr</th>
            <th className="border px-3 py-2">Produkt</th>
            <th className="border px-3 py-2">Pershkrimi</th>
            <th className="border px-3 py-2">Stoqet</th>
            <th className="border px-3 py-2">Sasia</th>
            <th className="border px-3 py-2">Cmimi Shitjes</th>
            <th className="border px-3 py-2">Totali</th>
            <th className="border px-3 py-2">Veprime</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border px-2 py-1 text-center">{index + 1}</td> 
              <td className="border px-2 py-1">
                <Select
                  options={products.map((p) => ({
                    value: p,
                    label: p.emertimi,
                    ...p,
                  }))}
                  value={
                    row.selectedProduct
                      ? { value: row.selectedProduct, label: row.emertimi }
                      : null
                  }
                  onChange={(opt) => handleProductSelect(index, opt.value)}
                  placeholder="Zgjidh produkt"
                  isSearchable
                  className="text-sm"
                />
              </td>
              <td className="border px-2 py-1">{row.pershkrimi}</td> 
              <td className="border px-2 py-1 text-center">{row.stock}</td> 
              <td className="border px-2 py-1"> 
                <input type="number" min="1" value={row.sasia} onChange={(e) => handleFieldChange(index, "sasia", e.target.value) } className="w-full px-2 py-1 border rounded text-sm" /> 
              </td> 
              <td className="border px-2 py-1"> 
                <input type="number" min="0" value={row.cmimiShitjes} onChange={(e) => handleFieldChange(index, "cmimiShitjes", e.target.value) } className="w-full px-2 py-1 border rounded text-sm" /> 
              </td> 
              <td className="border px-2 py-1 text-right">{row.totaliProduktit?.toFixed(2)}</td> 
              <td className="border px-2 py-1 text-center"> 
                <button type="button" onClick={() => removeRow(index)} className="text-red-500 hover:text-red-700 font-semibold" > Fshij </button> 
              </td>
              {/* rest of your columns */}
            </tr>
          ))}
        </tbody>

      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Shto Produkt
        </button>

        <div className="text-right font-semibold text-gray-800 space-y-1">
            <div>Totali i Produkteve: {total?.toFixed(2)} €</div>
        </div>
      </div>
    </div>
  );
}
