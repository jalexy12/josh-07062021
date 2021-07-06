import {
  BookSideState,
  BookDeltaResponse,
  CryptoResponse,
  OrderBookState,
  OrderBookStateHandlers,
  BookSideStateItem,
} from "../types";
import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

function tabulateBook(
  newData: BookSideState,
  dataPoint: BookDeltaResponse | BookSideStateItem,
  index: number
) {
  const [price, size] = dataPoint;

  if (size > 0) {
    const previousItem = newData[index - 1];
    const prevTotal = previousItem ? previousItem[2] : 0;

    return newData.concat([[price, size, prevTotal + size]]);
  }

  return newData;
}

function initialInsertion(prospectiveValues: BookDeltaResponse[]) {
  return prospectiveValues.reduce(tabulateBook, []);
}

function massageCoinData(
  prospectiveValues: BookDeltaResponse[],
  currentData: BookSideState
): BookSideState {
  const valuesToInsert = [...currentData, ...prospectiveValues].reduce(
    (
      memo: { [key: number]: number },
      itemToMemo: BookDeltaResponse | BookSideStateItem
    ) => {
      const [price, size] = itemToMemo;

      if (size > 0) {
        memo[price] = size;
      }

      return memo;
    },
    {}
  );

  const mergedData: BookDeltaResponse[] = Object.keys(valuesToInsert).map(
    (price) => [Number(price), valuesToInsert[Number(price)]]
  );

  return mergedData.reduce(tabulateBook, []).slice(0, 25);
}

export default function useMassageCoinData(): OrderBookState &
  OrderBookStateHandlers {
  const [bids, setBids] = useState<BookSideState>([]);
  const [asks, setAsks] = useState<BookSideState>([]);

  const handleInitialData = useCallback((data: CryptoResponse): void => {
    setBids(initialInsertion(data.bids));
    setAsks(initialInsertion(data.asks));
  }, []);

  const handleTricklingData = useCallback((data: CryptoResponse): void => {
    ReactDOM.unstable_batchedUpdates(() => {
      setBids((currentBids) => massageCoinData(data.bids, currentBids));
      setAsks((currentAsks) => massageCoinData(data.asks, currentAsks));
    });
  }, []);

  return { sells: asks, buys: bids, handleInitialData, handleTricklingData };
}
