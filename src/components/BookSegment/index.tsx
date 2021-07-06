import { BookSideState, BookSideStateItem } from "../../types";
import "./styles.css";
import classNames from "classnames";
import BookSegmentRow from "./BookSegmentRow";

interface Props {
  data: BookSideState;
  className?: string;
  depthStartSide: "left" | "right";
  barAndTextColor: "red" | "green";
}

export default function BookSegment({
  data,
  className = "",
  depthStartSide,
  barAndTextColor,
}: Props): JSX.Element {
  return (
    <div className={classNames("book-segment", className)}>
      <header>
        <h3 className="total">Total</h3>
        <h3 className="size">Size</h3>
        <h3 className="price">Price</h3>
      </header>
      <div className="book-segment-body">
        {data.map((dataPoint: BookSideStateItem) => {
          const [price, size, total] = dataPoint;
          const [, , highestTotal] = data[data.length - 1];

          return (
            <BookSegmentRow
              key={price}
              price={price}
              size={size}
              total={total}
              depthPercent={total / highestTotal}
              originationClass={depthStartSide}
              barAndTextColor={barAndTextColor}
            />
          );
        })}
      </div>
    </div>
  );
}
