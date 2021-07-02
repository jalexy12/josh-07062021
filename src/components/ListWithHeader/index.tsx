import classNames from "classnames";
import "./styles.css";

interface Props {
  headerTitle: string;
  listItems: Array<string> | Array<number>;
  className?: string;
}

export default function ListWithHeader({
  headerTitle,
  listItems = [],
  className = "",
}: Props) {
  return (
    <div className={classNames("list-with-header", className)}>
      <h3>{headerTitle}</h3>
      <ol>
        {listItems.map((item) => (
          <li>{item}</li>
        ))}
      </ol>
    </div>
  );
}
