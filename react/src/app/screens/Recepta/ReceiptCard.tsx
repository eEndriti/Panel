import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LayoutDashboard, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Receipt } from "./types";
import { callApi } from "../../services/callApi";
import toast from "react-hot-toast";

type Props = {
  receipt: Receipt;
    triggerReload: () => void;

};

export function ReceiptCard({ receipt, triggerReload }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produktet, setProduktet] = useState([]);

  useEffect(() => {
    if (!open) return; // only load when card opens
    setLoading(true);
    loadData();
  }, [open]);

  async function loadData() {
    try {
      const result = await callApi.getProduktet(receipt);
      setProduktet(result);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  const deleteRecepta = async (e) => {
          e.stopPropagation(); 
          try {
            await callApi.deleteRecepta(receipt.id)
            toast.success('Recepta u hoq me sukses!')
            
          } catch (error) {
            console.log(error)
            //toast.error('Gabim gjate procesit, provoni serish !')
          }finally{
            triggerReload();
          }
        }

  return (
    <motion.div
      layout
      className="rounded-2xl border bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition"
    >
      {/* Card Header */}
      <button
  onClick={() => setOpen(!open)}
  className="w-full flex items-center justify-between p-5"
>
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
      <LayoutDashboard size={20} />
    </div>
    <h3 className="text-lg font-semibold">{receipt.emertimi}</h3>
  </div>

  <div className="flex items-center gap-2">
    {/* DELETE BUTTON — only when open */}
    {open && (
      <button
        onClick={(e) => deleteRecepta(e)}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
        title="Delete receipt"
      >
        <Trash2 size={18} />
      </button>
    )}

    <ChevronDown
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    />
  </div>
</button>

      {/* Card Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {loading ? (
                <div className="text-gray-500 text-sm">Loading...</div>
              ) : produktet.length === 0 ? (
                <div className="text-gray-400 text-sm">Nuk ka produkte</div>
              ) : (
                produktet.map((ing, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start rounded-xl bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {ing.emertimi} {ing.pershkrimi}
                      </p>
                    </div>

                    <span className="font-semibold text-indigo-600">
                      {ing.sasia} {ing.njesia}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
