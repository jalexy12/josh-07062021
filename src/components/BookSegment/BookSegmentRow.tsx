import React from "react";
import classNames from "classnames";

interface Props {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
  originationClass: "left" | "right";
  barAndTextColor: "red" | "green";
}

function BookSegmentRow({
  total,
  price,
  size,
  depthPercent,
  originationClass = "left",
  barAndTextColor = "red",
}: Props) {
  return (
    <div className={classNames("book-segment-row", barAndTextColor)}>
      <svg className={originationClass}>
        <rect
          width={`${depthPercent * 100}%`}
          height="100%"
          fill={barAndTextColor === "red" ? "#B7383B" : "#0DA073"}
          fillOpacity="0.5"
          strokeOpacity="0"
        />
      </svg>
      <div className="book-segment-info">
        <div className="total">{total}</div>
        <div className="size">{size}</div>
        <div className="price">{price}</div>
      </div>
    </div>
  );
}

export default React.memo(BookSegmentRow);
