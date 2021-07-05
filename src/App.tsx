import useHandleWebsocketConnection from "./hooks/useHandleWebsocketConnection";
import OrderBook from "./components/OrderBook";
import socketHandler from "./socketHandler";
import { WebSocketState } from "./types";

function App() {
  const { data, isClosed, isError }: WebSocketState =
    useHandleWebsocketConnection(socketHandler);

  return (
    <main className="app">
      <OrderBook buys={data.buys} sells={data.sells} />
    </main>
  );
}

export default App;
