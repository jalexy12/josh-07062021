import { useCallback, useEffect, useRef, useState } from "react";
import {
  CryptoResponse,
  OrderBookState,
  OrderBookStateHandlers,
  WebSocketState,
} from "../types";
import { SOCKET_STATES, SocketHandler } from "../socketHandler";
import { BTC_PRODUCT, EVENT_TYPE, FEED_TYPE } from "../constants";
import useMassageCoinData from "./useMassageCoinData";

export default function useHandleWebsocketConnection(
  socketHandler: SocketHandler
): WebSocketState {
  const [isError, setIsError] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(
    socketHandler.currentSocketState !== SOCKET_STATES[SOCKET_STATES.OPEN]
  );
  const {
    handleInitialData,
    handleTricklingData,
    ...coinData
  }: OrderBookState & OrderBookStateHandlers = useMassageCoinData();

  const lastUpdate = useRef(new Date());
  const waitingForFlush = useRef<CryptoResponse>({ asks: [], bids: [] });

  const handleError = useCallback(() => setIsError(true), []);
  const handleClose = useCallback(() => setIsClosed(true), []);

  const handleMessage = useCallback(
    (e) => {
      try {
        const response: CryptoResponse = JSON.parse(e.data);

        if (response.event) {
          console.warn("Connecting to WS", response);
          return;
        }

        switch (response?.feed) {
          case "book_ui_1_snapshot":
            return handleInitialData(response);
          case "book_ui_1":
            const dateComparator = new Date();
            const shouldUpdate: boolean =
              dateComparator.getTime() - lastUpdate.current.getTime() > 1500;

            if (shouldUpdate) {
              const mergedResponse: CryptoResponse = {
                bids: [...waitingForFlush.current.bids, ...response.bids],
                asks: [...waitingForFlush.current.asks, ...response.asks],
              };

              waitingForFlush.current = { bids: [], asks: [] };
              lastUpdate.current = dateComparator;
              return handleTricklingData(mergedResponse);
            } else {
              waitingForFlush.current.asks =
                waitingForFlush.current.asks.concat(response.asks);
              waitingForFlush.current.bids =
                waitingForFlush.current.bids.concat(response.bids);
              return;
            }
          default:
            console.warn("Error receiving message: ", response);
            break;
        }
      } catch {
        setIsError(true);
      }
    },
    [handleInitialData, handleTricklingData]
  );

  const handleOpen = useCallback(
    () =>
      socketHandler.sendMessage({
        event: EVENT_TYPE,
        feed: FEED_TYPE,
        product_ids: [BTC_PRODUCT],
      }),
    []
  );

  useEffect(() => {
    socketHandler.initialize({
      onClose: handleClose,
      onError: handleError,
      onMessage: handleMessage,
      onOpen: handleOpen,
    });

    return socketHandler.terminate.bind(socketHandler);
  }, [handleError, handleClose, handleMessage, handleOpen]);

  return {
    isClosed,
    isError,
    data: coinData,
  };
}
