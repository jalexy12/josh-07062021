interface Props {
  headerTitle: string;
  listItems: Array<string> | Array<number>;
}

export default function ListWithHeader({ headerTitle, listItems = [] }: Props) {
  return (
    <>
      <h3>{headerTitle}</h3>
      <ol>
        {listItems.map(item => <li>{item}</li>)}
      </ol>
    </>
  )
}