import React from "react";

interface Props {
  price: number;
  size: number;
  total: number;
}

function BookSegmentRow({ total, price, size }: Props) {
  return (
    <div className="book-segment-row">
      <div className="total">{total}</div>
      <div className="size">{size}</div>
      <div className="price">{price}</div>
    </div>
  );
}

export default React.memo(BookSegmentRow);