import { ChangeEventHandler, MouseEventHandler } from "react";
import { OrderBookState } from "../../types";
import BookSegment from "../BookSegment";

import "./styles.css";

interface Props {
  availableGroups: number[];
  currentGroup: number;
  handleGroupChange: ChangeEventHandler;
  handleProductChange: MouseEventHandler;
  createForcedError: MouseEventHandler;
}

export default function OrderBook({
  buys,
  sells,
  availableGroups,
  currentGroup,
  handleGroupChange,
  handleProductChange,
  createForcedError,
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
        <BookSegment
          depthStartSide="right"
          data={buys}
          className="buy-container"
          barAndTextColor="red"
        />
        <BookSegment
          depthStartSide="left"
          data={sells}
          className="sell-container"
          barAndTextColor="green"
        />
      </div>
      <div className="order-book-footer">
        <button type="button" onClick={handleProductChange} className="primary">
          Toggle Feed
        </button>
        <button type="button" onClick={createForcedError} className="danger">
          Kill Feed
        </button>
      </div>
    </div>
  );
}
