import { BookSideState, CryptoResponse, OrderBookState } from "../types";
import { useRef } from "react";

function massageCoinData(
  prospectiveValues: number[][],
  currentData: BookSideState
): BookSideState {
  const copiedData = { ...currentData };

  prospectiveValues.forEach((bid: number[]) => {
    const [value, size] = bid;

    if (size > 0) {
      copiedData[value] = size;
    } else {
      delete copiedData[value];
    }
  });

  return copiedData;
}

export default function useMassageCoinData(
  data: CryptoResponse | null | undefined
): OrderBookState {
  const bids = useRef<BookSideState>({});
  const asks = useRef<BookSideState>({});

  if (!data) {
    return { sells: {}, buys: {} };
  }

  bids.current = massageCoinData(data.bids, bids.current);
  asks.current = massageCoinData(data.asks, asks.current);

  return { sells: asks.current, buys: bids.current };
}
