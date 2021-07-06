import { useCallback, useEffect, useRef, useState } from "react";
import { CryptoResponse, WebSocketState } from "../types";
import { SOCKET_STATES, SocketHandler } from "../socketHandler";
import { BTC_PRODUCT, EVENT_TYPE, FEED_TYPE } from "../constants";

export default function useHandleWebsocketConnection(
  socketHandler: SocketHandler,
  {
    handleInitialData,
    handleTricklingData,
  }: {
    handleInitialData: Function;
    handleTricklingData: Function;
  }
): WebSocketState {
  const [isError, setIsError] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(
    socketHandler.currentSocketState !== SOCKET_STATES[SOCKET_STATES.OPEN]
  );

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
      } catch (e) {
        console.log(e);
        setIsError(true);
      }
    },
    [handleInitialData, handleTricklingData]
  );

  const handleOpen = useCallback((e) => {
    socketHandler.sendMessage({
      event: EVENT_TYPE,
      feed: FEED_TYPE,
      product_ids: [BTC_PRODUCT],
    });
  }, []);

  useEffect(() => {
    socketHandler.initialize({
      onClose: handleClose,
      onError: handleError,
      onMessage: handleMessage,
      onOpen: handleOpen,
    });

    return socketHandler.terminate.bind(socketHandler);
  }, [handleClose, handleMessage, handleOpen, handleError]);

  return {
    isClosed,
    isError,
  };
}
