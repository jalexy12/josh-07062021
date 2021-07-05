import {
  BookSideState,
  BookDeltaResponse,
  CryptoResponse,
  OrderBookState,
  OrderBookStateHandlers,
  BookSideStateItem,
} from "../types";
import { useCallback, useState, useRef } from "react";
import ReactDOM from "react-dom";

function tabulateBook(itemsToMerge: { [key: number]: number } = {}) {
  return (
    newData: BookSideState,
    dataPoint: BookDeltaResponse | BookSideStateItem,
    index: number
  ): BookSideState => {
    const previousItem = newData[index - 1];
    const prevTotal = previousItem ? previousItem[2] : 0;

    const [price, size] = dataPoint;
    const newSize: number | null =
      itemsToMerge && itemsToMerge[price] && Number(itemsToMerge[price]);

    if (size > 0 || (newSize && newSize > 0)) {
      if (newSize) {
        return newData.concat([[price, newSize, prevTotal + newSize]]);
      } else {
        return newData.concat([[price, size, prevTotal + size]]);
      }
    }

    return newData;
  };
}

function initialInsertion(prospectiveValues: BookDeltaResponse[]) {
  return prospectiveValues.reduce(tabulateBook(), []);
}

function massageCoinData(
  prospectiveValues: BookDeltaResponse[],
  currentData: BookSideState
): BookSideState {
  const valuesToInsert = prospectiveValues.reduce(
    (memo: { [key: number]: number }, itemToMemo: BookDeltaResponse) => {
      const [price, size] = itemToMemo;
      memo[price] = size;
      return memo;
    },
    {}
  );

  return currentData.reduce(tabulateBook(valuesToInsert), []);
}

export default function useMassageCoinData(): OrderBookState &
  OrderBookStateHandlers {
  const lastUpdate = useRef(new Date());
  const waitingForFlush = useRef<CryptoResponse>({ asks: [], bids: [] });
  const [bids, setBids] = useState<BookSideState>([]);
  const [asks, setAsks] = useState<BookSideState>([]);

  const handleInitialData = useCallback((data: CryptoResponse): void => {
    setBids(initialInsertion(data.bids));
    setAsks(initialInsertion(data.asks));
  }, []);

  const handleTricklingData = useCallback((data: CryptoResponse): void => {
    const dateComparator = new Date();
    const shouldUpdate: boolean =
      dateComparator.getTime() - lastUpdate.current.getTime() > 1000;

    if (shouldUpdate) {
      ReactDOM.unstable_batchedUpdates(() => {
        console.log(waitingForFlush.current);
        setBids((currentBids) =>
          massageCoinData(
            [...waitingForFlush.current.bids, ...data.bids],
            currentBids
          )
        );
        setAsks((currentAsks) =>
          massageCoinData(
            [...waitingForFlush.current.asks, ...data.asks],
            currentAsks
          )
        );
      });

      waitingForFlush.current = { asks: [], bids: [] };
      lastUpdate.current = new Date();
    } else {
      waitingForFlush.current = {
        asks: waitingForFlush.current.asks.concat(data.asks),
        bids: waitingForFlush.current.bids.concat(data.bids),
      };
    }
  }, []);
  console.log(bids.length, asks.length);
  return { sells: asks, buys: bids, handleInitialData, handleTricklingData };
}
