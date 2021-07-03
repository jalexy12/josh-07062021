import { BookSideState } from "../../types";
import "./styles.css";
import classNames from "classnames";

interface Props {
  data: BookSideState;
  className?: string;
}

export default function BookSegment({
  data,
  className = "",
}: Props): JSX.Element {
  console.log(data);
  return (
    <div className={classNames("book-segment", className)}>
      <header>
        <h3 className="total">Total</h3>
        <h3 className="size">Size</h3>
        <h3 className="price">Price</h3>
      </header>
      <div className="book-segment-body">
        {Object.keys(data).map((dataPoint) => (
          <div className="book-segment-row">
            <div className="total">1</div>
            <div className="size">{data[Number(dataPoint)]}</div>
            <div className="price">{dataPoint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
