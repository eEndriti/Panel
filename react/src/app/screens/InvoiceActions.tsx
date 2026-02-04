import React from "react";
import { ClipLoader } from 'react-spinners';

export default function InvoiceActions({ onCancel, onRegister, disabledButton, loadingSaveBtn }) {
  return (
    <div className=" rounded-xl border  p-6 ">
      {/* Container switched to flex-col */}
      <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
        
        {/* Register Button - Primary Action First */}
        <button
          disabled={disabledButton || loadingSaveBtn}
          onClick={() => onRegister()}
          className={`w-full px-6 py-3 rounded-lg text-lg font-bold transition-all transform active:scale-[0.98]
            ${disabledButton || loadingSaveBtn
              ? "bg-green-100 text-green-400 cursor-not-allowed border border-green-200"
              : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
            }`}
        >
          {loadingSaveBtn ? (
            <div className="flex items-center justify-center gap-3">
              <ClipLoader size={18} color="#ffffff" />
              <span>Duke u Ruajtur...</span>
            </div>
          ) : (
            'Regjistro Fletedergesen'
          )}
        </button>

        {/* Cancel Button - Secondary Action */}
        <button
          onClick={onCancel}
          className="w-full bg-white text-gray-500 border border-gray-200 px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
        >
          Anulo Transaksionin
        </button>
        
      </div>
    </div>
  );
}