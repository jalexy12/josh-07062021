import useHandleWebsocketConnection from "./hooks/useHandleWebsocketConnection";
import useMassageCoinData from "./hooks/useMassageCoinData";
import useManageProduct from "./hooks/useManageProduct";
import OrderBook from "./components/OrderBook";
import socketHandler from "./socketHandler";
import {
  OrderBookState,
  OrderBookStateHandlers,
  WebSocketState,
  Products,
  ProductGroupings,
} from "./types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { product, groupingData, handleProductChange, handleGroupingChange } =
    useManageProduct(Products.BTC_PRODUCT);

  const {
    handleInitialData,
    handleTricklingData,
    ...coinData
  }: OrderBookState & OrderBookStateHandlers = useMassageCoinData(groupingData);

  const { error, createForcedError }: WebSocketState =
    useHandleWebsocketConnection(socketHandler, product, {
      handleInitialData,
      handleTricklingData,
    });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    return toast.dismiss;
  }, [error]);

  return (
    <main className="app">
      <OrderBook
        availableGroups={ProductGroupings[product]}
        currentGroup={groupingData.groupSize}
        handleGroupChange={handleGroupingChange}
        buys={coinData.buys}
        sells={coinData.sells}
        handleProductChange={handleProductChange}
        createForcedError={createForcedError}
      />
      <Toaster />
    </main>
  );
}

export default App;
