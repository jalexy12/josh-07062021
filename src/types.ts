export interface CryptoResponse {
  asks: number[][];
  bids: number[][];
}

export interface BookSideState {
  [key: number]: number;
}

export interface OrderBookState {
  sells: BookSideState | {};
  buys: BookSideState | {};
}

export interface WebSocketState {
  isClosed: boolean;
  isError: boolean;
  data?: CryptoResponse | null;
}
