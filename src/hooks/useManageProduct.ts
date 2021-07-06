import { GroupingData, ProductGroupings, Products } from "../types";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

interface ProductState {
  product: Products;
  handleProductChange: MouseEventHandler;
  handleGroupingChange: ChangeEventHandler;
  groupingData: GroupingData;
}

export default function useManageProduct(
  defaultProduct: Products
): ProductState {
  const [currentProduct, setCurrentProduct] = useState(defaultProduct);

  const [currentGrouping, setCurrentGrouping] = useState(
    ProductGroupings[currentProduct][0]
  );

  useEffect(
    () => setCurrentGrouping(ProductGroupings[currentProduct][0]),
    [currentProduct]
  );

  const handleProductChange: MouseEventHandler = useCallback(
    () =>
      setCurrentProduct((currentProduct) => {
        return currentProduct === Products.BTC_PRODUCT
          ? Products.ETH_PRODUCT
          : Products.BTC_PRODUCT;
      }),
    []
  );

  const handleGroupingChange = useCallback(
    (e) => setCurrentGrouping(Number(e.target.value)),
    []
  );

  const groupingData: GroupingData = {
    groupSize: currentGrouping,
    defaultForProduct: ProductGroupings[currentProduct][0],
  };

  return {
    product: currentProduct,
    groupingData,
    handleProductChange,
    handleGroupingChange,
  };
}
