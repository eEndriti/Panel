import { AnimatePresence,motion } from "framer-motion";
import { ReceiptCard } from "./ReceiptCard";
import { Receipt } from "./types";

type Props = {
  receipts: Receipt[];
  triggerReload: () => void;
};

export function ReceiptGrid({ receipts, triggerReload }: Props) {
  return (
    <AnimatePresence>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {receipts.map((receipt, index) => (
          <motion.div
            key={receipt.id ?? index}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ReceiptCard
              receipt={receipt}
              triggerReload={triggerReload}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
