import { useCallback, useEffect, useRef, useState } from "react";
import { CryptoResponse, Products, WebSocketState } from "../types";
import { SOCKET_STATES, SocketHandler } from "../socketHandler";
import { EVENT_TYPE, FEED_TYPE } from "../constants";

export default function useHandleWebsocketConnection(
  socketHandler: SocketHandler,
  product: Products,
  {
    handleInitialData,
    handleTricklingData,
  }: {
    handleInitialData: Function;
    handleTricklingData: Function;
  }
): WebSocketState {
  const [error, setError] = useState<string>("");
  const [isClosed, setIsClosed] = useState<boolean>(
    socketHandler.currentSocketState !== SOCKET_STATES[SOCKET_STATES.OPEN]
  );

  const lastUpdate = useRef(new Date());
  const waitingForFlush = useRef<CryptoResponse>({ asks: [], bids: [] });

  const handleError = useCallback((e: string | Event) => {
    setError(typeof e === "string" ? e : "Unknown websocket error");
    setTimeout(() => setError(""), 2000);
  }, []);
  const handleClose = useCallback(() => setIsClosed(true), []);

  const handleMessage = useCallback(
    (e) => {
      try {
        const response: CryptoResponse = JSON.parse(e.data);

        if (response.event === "alert") {
          handleError(
            `Error from WS - connection status: ${
              socketHandler.currentSocketState !==
              SOCKET_STATES[SOCKET_STATES.OPEN]
                ? "Closed"
                : "Still Open"
            }`
          );
          return;
        }

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
      } catch (e) {
        setError(e.message);
      }
    },
    [handleInitialData, handleTricklingData, handleError]
  );

  const handleOpen = useCallback(() => {
    socketHandler.sendMessage({
      event: EVENT_TYPE,
      feed: FEED_TYPE,
      product_ids: [product],
    });
  }, [product]);

  const createForcedError = () => {
    socketHandler.sendGenericMessage({
      event: "Nonsense",
      feed: "Doesnt exist",
      product_ids: [product],
    });
  };

  useEffect(() => {
    socketHandler.initialize({
      onClose: handleClose,
      onError: handleError,
      onMessage: handleMessage,
      onOpen: handleOpen,
    });

    return socketHandler.terminate.bind(socketHandler);
  }, [handleClose, handleMessage, handleOpen, handleError, product]);

  return {
    isClosed,
    error,
    createForcedError,
  };
}
