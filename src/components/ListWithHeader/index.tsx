import classNames from "classnames";
import "./styles.css";

interface Props {
  headerTitle: string;
  listItems: string[] | number[];
  className?: string;
}

export default function ListWithHeader({
  headerTitle,
  listItems = [],
  className = "",
}: Props): JSX.Element {
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
