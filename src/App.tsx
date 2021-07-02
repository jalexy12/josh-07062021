import useHandleWebsocketConnection from "./hooks/useHandleWebsocketConnection";
import useMassageCoinData from "./hooks/useMassageCoinData";
import OrderBook from "./components/OrderBook";
import socketHandler from "./socketHandler";
import "./App.css";

function App() {
  const { data, isClosed, isError } =
    useHandleWebsocketConnection(socketHandler);

  const { buyData, sellData } = useMassageCoinData(data);

  return (
    <main className="app">
      <OrderBook />
    </main>
  );
}

export default App;
