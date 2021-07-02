import { useCallback, useEffect, useState } from "react";
import { CryptoResponse } from "../types";
import { SOCKET_STATES, SocketHandler } from "../socketHandler";
import { BTC_PRODUCT, EVENT_TYPE, FEED_TYPE } from "../constants";

interface WebSocketState {
  isClosed: boolean;
  isError: boolean;
  data?: object | null;
}

export default function useHandleWebsocketConnection(
  socketHandler: SocketHandler
): WebSocketState {
  const [isError, setIsError] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(
    socketHandler.currentSocketState !== SOCKET_STATES[SOCKET_STATES.OPEN]
  );
  const [data, setData] = useState<null | CryptoResponse>(null);

  const handleError = useCallback(() => setIsError(true), []);
  const handleClose = useCallback(() => setIsClosed(true), []);

  const setInitialData = useCallback((response: CryptoResponse) => {
    const { bids, asks } = response;

    setData({ bids, asks });
  }, []);

  const handleMessage = useCallback(
    (e) => {
      try {
        const response = JSON.parse(e.data);

        if (response?.feed === "book_ui_1_snapshot") {
          setInitialData(response);
        } else {
        }
      } catch {
        setIsError(true);
      }
    },
    [setInitialData]
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

    return socketHandler.terminate;
  }, [handleError, handleClose, handleMessage, handleOpen]);

  return {
    isClosed,
    isError,
    data,
  };
}
