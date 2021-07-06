import { ChangeEventHandler } from "react";
import { OrderBookState } from "../../types";
import BookSegment from "../BookSegment";

import "./styles.css";

interface Props {
  availableGroups: number[];
  currentGroup: number;
  handleGroupChange: ChangeEventHandler;
}

export default function OrderBook({
  buys,
  sells,
  availableGroups,
  currentGroup,
  handleGroupChange,
}: OrderBookState & Props): JSX.Element {
  return (
    <div className="order-book-container">
      <header>
        <h2>Order Book</h2>
        <select onChange={handleGroupChange} value={currentGroup}>
          {availableGroups.map((group) => (
            <option value={group}>Group {group}</option>
          ))}
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
