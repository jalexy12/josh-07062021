import "./styles.css";

interface Props {
  headerTitle: string;
  listItems: Array<string> | Array<number>;
}

export default function ListWithHeader({ headerTitle, listItems = [] }: Props) {
  return (
    <div className="list-with-header">
      <h3>{headerTitle}</h3>
      <ol>
        {listItems.map((item) => (
          <li>{item}</li>
        ))}
      </ol>
    </div>
  );
}
