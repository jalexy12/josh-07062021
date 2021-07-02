import useHandleWebsocketConnection from "./hooks/useHandleWebsocketConnection";
import useMassageCoinData from "./hooks/useMassageCoinData";
import OrderBook from "./components/OrderBook";
import socketHandler from "./socketHandler";
import { OrderBookState, WebSocketState } from "./types";

import "./App.css";

function App() {
  const { data, isClosed, isError }: WebSocketState =
    useHandleWebsocketConnection(socketHandler);
  console.log(data);
  const { buys, sells }: OrderBookState = useMassageCoinData(data);

  console.log(buys, sells);
  return (
    <main className="app">
      <OrderBook />
    </main>
  );
}

export default App;
