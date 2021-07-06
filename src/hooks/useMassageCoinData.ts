import {
  BookSideState,
  BookDeltaResponse,
  CryptoResponse,
  OrderBookState,
  OrderBookStateHandlers,
  BookSideStateItem,
  GroupingData,
} from "../types";
import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

export default function useMassageCoinData(
  groupData: GroupingData
): OrderBookState & OrderBookStateHandlers {
  const [bids, setBids] = useState<BookSideState>([]);
  const [asks, setAsks] = useState<BookSideState>([]);

  const handleInitialData = useCallback(
    (data: CryptoResponse): void => {
      setBids(initialInsertion(data.bids, groupData));
      setAsks(initialInsertion(data.asks, groupData));
    },
    [groupData]
  );

  const handleTricklingData = useCallback(
    (data: CryptoResponse): void => {
      ReactDOM.unstable_batchedUpdates(() => {
        setBids((currentBids) =>
          massageCoinData(data.bids, currentBids, groupData)
        );
        setAsks((currentAsks) =>
          massageCoinData(data.asks, currentAsks, groupData)
        );
      });
    },
    [groupData]
  );

  return { sells: asks, buys: bids, handleInitialData, handleTricklingData };
}

function tabulateBook(
  newData: BookSideState,
  dataPoint: BookDeltaResponse | BookSideStateItem,
  index: number
): BookSideState {
  const [price, size] = dataPoint;

  if (size > 0) {
    const previousItem = newData[index - 1];
    const prevTotal = previousItem ? previousItem[2] : 0;

    return newData.concat([[price, size, prevTotal + size]]);
  }

  return newData;
}

function initialInsertion(
  prospectiveValues: BookDeltaResponse[],
  groupingData: GroupingData
) {
  const sorted = prospectiveValues.sort(sortByPrice);

  if (groupingData.groupSize === groupingData.defaultForProduct) {
    return sorted.reduce(tabulateBook, []);
  }

  return groupData(sorted, groupingData.groupSize).reduce(tabulateBook, []);
}

function sortByPrice(
  firstItem: BookSideStateItem | BookDeltaResponse,
  secondItem: BookSideStateItem | BookDeltaResponse
) {
  return firstItem[0] > secondItem[0] ? 1 : -1;
}

function groupData(
  list: BookDeltaResponse[],
  groupSize: number
): BookDeltaResponse[] {
  const groupedList: BookDeltaResponse[] = [];

  let forwardPointer = 0;
  let currentGroup = 0;

  while (forwardPointer < list.length) {
    const previousItem = groupedList[currentGroup];
    const [price, size] = list[forwardPointer];

    if (!previousItem) {
      const priceRounded = groupSize % 1 === 0 ? Math.floor(price) : price;
      groupedList.push([priceRounded, size]);
      forwardPointer++;
      continue;
    }

    const [prevPrice, prevSize] = previousItem;

    if (Math.abs(prevPrice - price) <= groupSize) {
      groupedList[currentGroup] = [prevPrice, prevSize + size];
      forwardPointer++;
    } else {
      currentGroup++;
    }
  }
  return groupedList;
}

function massageCoinData(
  prospectiveValues: BookDeltaResponse[],
  currentData: BookSideState,
  groupingData: GroupingData
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

  const toMerge: string[] = Object.keys(valuesToInsert);

  const sorted: BookDeltaResponse[] = toMerge
    .map(
      (price): BookDeltaResponse => [
        Number(price),
        valuesToInsert[Number(price)],
      ]
    )
    .sort(sortByPrice);

  if (groupingData.groupSize === groupingData.defaultForProduct) {
    const startIndex = toMerge.length > 25 ? toMerge.length - 25 : 0;
    return sorted.slice(startIndex, toMerge.length).reduce(tabulateBook, []);
  }

  const grouped = groupData(sorted, groupingData.groupSize);
  const startIndex = grouped.length > 25 ? grouped.length - 25 : 0;

  return groupData(grouped, groupingData.groupSize)
    .slice(startIndex, grouped.length)
    .reduce(tabulateBook, []);
}
