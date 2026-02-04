import { useEffect, useMemo, useState } from "react";

const emptyRow: ProductRow = {
  emertimi: "",
  pershkrimi: "",
  sasia: "",
  njesia: "",
};

export function CreateReceiptModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    emertimi: string;
    products: ProductRow[];
  }) => void;
}) {
  const [receiptName, setReceiptName] = useState("");
  const [rows, setRows] = useState<ProductRow[]>([
    { ...emptyRow },
    { ...emptyRow }, // start with 2 rows
  ]);

  // 🧠 Auto-add row when second-to-last is filled
  useEffect(() => {
    if (rows.length < 2) return;

    const secondLast = rows[rows.length - 2];
    const isFilled = Object.values(secondLast).every(v => String(v).trim() !== "");
    if (isFilled) {
      setRows(prev => [...prev, { ...emptyRow }]);
    }
  }, [rows]);

  // ✅ Validation
const isValid = useMemo(() => {
  if (!receiptName.trim()) return false;

  const filledRows = rows.filter(row =>
    // Use String(v) here too
    Object.values(row).some(v => String(v).trim() !== "")
  );

  if (filledRows.length === 0) return false;

  return filledRows.every(row =>
    // And here
    Object.values(row).every(v => String(v).trim() !== "")
  );
}, [receiptName, rows]);

  function updateRow(index: number, key: keyof ProductRow, value: string) {
    setRows(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [key]: value } : row
      )
    );
  }

function handleSave() {
  const products = rows.filter(row =>
    Object.values(row).every(v => String(v).trim() !== "")
  );

    onSave({
      emertimi: receiptName,
      products,
    });

    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Krijo Receptin</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Receipt name */}
        <input
          value={receiptName}
          onChange={e => setReceiptName(e.target.value)}
          placeholder="Emri i Receptit..."
          className="w-full mb-4 px-4 py-2 border rounded-xl"
        />

        {/* Products table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2">Emertimi</th>
                <th className="pb-2">Pershkrimi</th>
                <th className="pb-2">Sasia</th>
                <th className="pb-2">Njesia</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {(["emertimi", "pershkrimi", "sasia", "njesia"] as const).map(key => {
                    // Determine if this is the numeric field
                    const isNumberField = key === "sasia";

                    return (
                      <td key={key} className="pr-2 pb-2">
                        <input
                          // Use type="number" for sasia to trigger numeric keyboards and browser validation
                          type={isNumberField ? "number" : "text"}
                          value={row[key]}
                          onChange={e => {
                            const val = e.target.value;
                            // For sasia, convert to number; for others, keep as string
                            const finalValue = isNumberField ? (val === "" ? 0 : Number(val)) : val;
                            updateRow(i, key, finalValue);
                          }}
                          // Optional: prevent negative numbers
                          min={isNumberField ? 0 : undefined}
                          className="w-full px-2 py-1 border rounded-lg"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Anulo
          </button>

          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`px-4 py-2 rounded-xl text-white transition ${
              isValid
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Shto Receptin
          </button>
        </div>
      </div>
    </div>
  );
}
