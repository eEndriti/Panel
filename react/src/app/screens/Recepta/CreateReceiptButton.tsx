export function CreateReceiptButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
    >
      + Shto nje Recept
    </button>
  );
}
