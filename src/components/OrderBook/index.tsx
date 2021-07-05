import { OrderBookState } from "../../types";
import BookSegment from "../BookSegment";

import "./styles.css";

export default function OrderBook({
  buys,
  sells,
}: OrderBookState): JSX.Element {
  return (
    <div className="order-book-container">
      <header>
        <h2>Order Book</h2>
        <select>
          <option>Group 0.50</option>
          <option>Group 1</option>
          <option>Group 2.5</option>
        </select>
      </header>
      <div className="order-book-body">
        <BookSegment data={buys} className="buy-container" />
        <BookSegment data={sells} className="sell-container" />
      </div>
      <div className="order-book-footer">
        <button className="primary">Toggle Feed</button>
        <button className="danger">Kill Feed</button>
      </div>
    </div>
  );
}
