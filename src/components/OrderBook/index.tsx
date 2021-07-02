import "./styles.css";
import ListWithHeader from "../ListWithHeader";

const randomArray = (
  length: number,
  min: number,
  max: number
): Array<number> => {
  const items = [];

  for (let i = 0; i < length; i++) {
    items.push(Math.floor(Math.random() * max + min));
  }

  return items;
};

export default function OrderBook() {
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
        <div className="buy-container">
          <ListWithHeader
            className="total"
            headerTitle="Total"
            listItems={randomArray(17, 2000, 200000)}
          />
          <ListWithHeader
            className="size"
            headerTitle="Size"
            listItems={randomArray(17, 2000, 50000)}
          />
          <ListWithHeader
            className="price"
            headerTitle="Price"
            listItems={randomArray(17, 47000, 47000)}
          />
        </div>
        <div className="sell-container">
          <ListWithHeader
            headerTitle="Price"
            listItems={randomArray(17, 47000, 47000)}
          />
          <ListWithHeader
            headerTitle="Size"
            listItems={randomArray(17, 2000, 50000)}
          />
          <ListWithHeader
            headerTitle="Total"
            listItems={randomArray(17, 2000, 200000)}
          />
        </div>
      </div>
      <div className="order-book-footer">
        <button className="primary">Toggle Feed</button>
        <button className="danger">Kill Feed</button>
      </div>
    </div>
  );
}
