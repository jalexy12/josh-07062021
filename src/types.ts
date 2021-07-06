export interface CryptoResponse {
  asks: BookDeltaResponse[];
  bids: BookDeltaResponse[];
  event?: string;
  feed?: string;
}

export type BookDeltaResponse = [price: number, size: number];
export type BookSideStateItem = [price: number, size: number, total: number];
export type BookSideState = BookSideStateItem[];

export interface OrderBookState {
  sells: BookSideState;
  buys: BookSideState;
}

export interface OrderBookStateHandlers {
  handleInitialData: Function;
  handleTricklingData: Function;
}

export interface WebSocketState {
  isClosed: boolean;
  isError: boolean;
}

export type GroupingData = {
  groupSize: number;
  defaultForProduct: number;
};

export enum Products {
  BTC_PRODUCT = "PI_XBTUSD",
  ETH_PRODUCT = "PI_ETHUSD",
}

export const ProductGroupings = {
  [Products.BTC_PRODUCT]: [0.5, 1, 2.5],
  [Products.ETH_PRODUCT]: [0.05, 0.1, 0.25],
};
