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
  data: OrderBookState;
}
