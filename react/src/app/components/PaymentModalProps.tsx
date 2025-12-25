import React, { useState, useEffect } from "react";
import { notify } from '../components/toast';
import { callApi } from "../services/callApi";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTotaliPerPagese: number;
  initialTotaliIPaguar: number;
  nrFatures: string; // New prop
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  initialTotaliPerPagese,
  initialTotaliIPaguar,
  nrFatures,
}) => {
  const initialMbetjaPerPagese = initialTotaliPerPagese - initialTotaliIPaguar;

  const [totaliPerPagese] = useState(initialTotaliPerPagese); // read-only
  const [totaliIPaguar, setTotaliIPaguar] = useState(0);
  const [mbetjaPerPagese, setMbetjaPerPagese] = useState(initialMbetjaPerPagese);

  useEffect(() => {
    const adjustedPaguar =
      totaliIPaguar > initialMbetjaPerPagese ? initialMbetjaPerPagese : totaliIPaguar;
    setTotaliIPaguar(adjustedPaguar);
    setMbetjaPerPagese(initialMbetjaPerPagese - adjustedPaguar);
  }, [totaliIPaguar, initialMbetjaPerPagese]);

  if (!isOpen) return null;

  const handleSave = async() => {
    // Save logic can now include nrFatures
    try {
        const data = {
          nrFatures,
          totaliPerPagese,
          totaliIPaguar,
          mbetjaPerPagese,
        }
        await callApi.shtoPagesen(data)
        notify('Pagesa u ruajt me sukses','success')
    } catch (error) {
        notify('Nuk mund te behet pagesa','error')
    }finally{
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-100 bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-90 opacity-0 animate-modal-in">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <p className="text-sm text-gray-500 mb-4">Nr i Dokumentit: {nrFatures}</p>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label>Totali Per Pagese:</label>
            <input
              type="number"
              value={totaliPerPagese}
              readOnly
              className="border px-2 py-1 rounded w-24 text-right bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-between items-center">
            <label>Totali i Paguar:</label>
            <input
              type="number"
              value={totaliIPaguar}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTotaliIPaguar(value > initialMbetjaPerPagese ? initialMbetjaPerPagese : value);
              }}
              max={initialMbetjaPerPagese}
              className="border px-2 py-1 rounded w-24 text-right"
            />
          </div>

          <div className="flex justify-between items-center">
            <label>Mbetja per Pagese:</label>
            <input
              type="number"
              value={mbetjaPerPagese}
              readOnly
              className="border px-2 py-1 rounded w-24 text-right bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-in {
          animation: modalIn 0.25s forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;
