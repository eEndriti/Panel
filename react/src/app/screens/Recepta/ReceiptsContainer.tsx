import { useEffect, useState } from "react";
import { ReceiptsPage } from "./ReceiptsPage";
import { callApi } from "../../services/callApi";

export function ReceiptsContainer() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    loadData()
  }, []);

async function loadData() {
  try {
    const result  = await callApi.getRecepta()
    setReceipts(result);
  } catch (error) {
    console.log('error',error)
  }
}

  return <ReceiptsPage receipts={receipts}  triggerReload={loadData}/>;
}
