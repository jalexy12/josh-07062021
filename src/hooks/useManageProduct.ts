import { Products, ProductGroupings, GroupingData } from "../types";
import { ChangeEventHandler, useCallback, useState } from "react";

interface ProductState {
  product: Products;
  handleProductChange: Function;
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

  const handleProductChange = useCallback(
    (product: Products) => setCurrentProduct(product),
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
