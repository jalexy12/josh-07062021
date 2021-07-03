import useHandleWebsocketConnection from "./hooks/useHandleWebsocketConnection";
import useMassageCoinData from "./hooks/useMassageCoinData";
import OrderBook from "./components/OrderBook";
import socketHandler from "./socketHandler";
import { OrderBookState, WebSocketState } from "./types";

function App() {
  const { data, isClosed, isError }: WebSocketState =
    useHandleWebsocketConnection(socketHandler);

  const { buys, sells }: OrderBookState = useMassageCoinData(data);

  console.log(buys, sells);
  return (
    <main className="app">
      <OrderBook buys={buys} sells={sells} />
    </main>
  );
}

export default App;
