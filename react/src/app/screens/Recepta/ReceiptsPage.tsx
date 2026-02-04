import { useState } from "react";
import { CreateReceiptButton } from "./CreateReceiptButton";
import { CreateReceiptModal } from "./CreateReceiptModal";
import { ReceiptGrid } from "./ReceiptGrid";
import { Receipt } from "./types";
import { callApi } from "../../services/callApi";
import toast from "react-hot-toast";

type Props = {
  receipts: Receipt[];
  triggerReload: () => void;
};

export function ReceiptsPage({ receipts,triggerReload }: Props) {

  const [open, setOpen] = useState(false);

const saveData = async (data) => {
    try {
      await callApi.createRecepta(data);
      toast.success("Recepta u krijua me sukses!");

      triggerReload();   // 🔥 RELOAD DATA
      setOpen(false);    // close modal
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Gabim, recepta nuk u shtua!");
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Recetat
          </h1>
          <p className="text-gray-500 mt-1">
            Përbërësit dhe sasia për çdo recetë
          </p>
        </div>

        <CreateReceiptButton onClick={() => setOpen(true)} />
      </div>



      <CreateReceiptModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data) => saveData(data)}
      />
      <ReceiptGrid receipts={receipts} triggerReload={triggerReload} />    
    </div>
  );
}
