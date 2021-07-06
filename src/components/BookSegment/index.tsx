import { BookSideState, BookSideStateItem } from "../../types";
import "./styles.css";
import classNames from "classnames";
import BookSegmentRow from "./BookSegmentRow";

interface Props {
  data: BookSideState;
  className?: string;
}

export default function BookSegment({
  data,
  className = "",
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

          return (
            <BookSegmentRow
              key={price}
              price={price}
              size={size}
              total={total}
            />
          );
        })}
      </div>
    </div>
  );
}
