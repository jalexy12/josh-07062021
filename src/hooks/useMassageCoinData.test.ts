import { renderHook, act } from "@testing-library/react-hooks";
import useMassageCoinData from "./useMassageCoinData";
import { CryptoResponse, GroupingData } from "../types";

const DEFAULT_GROUP: GroupingData = { groupSize: 0.5, defaultForProduct: 0.5 };
const FAKE_INITIAL_DATA: CryptoResponse = {
  asks: [
    [1, 2],
    [3, 4],
  ],
  bids: [
    [1, 2],
    [3, 4],
  ],
};

const FAKE_INITIAL_DATA_RESULTS = {
  sells: [
    [1, 2, 2],
    [3, 4, 6],
  ],
  buys: [
    [1, 2, 2],
    [3, 4, 6],
  ],
};

describe("useMassageCoinData", () => {
  test("it should render with an empty initial state", () => {
    const { result } = renderHook(() => useMassageCoinData(DEFAULT_GROUP));

    expect(result.current.sells).toStrictEqual([]);
    expect(result.current.buys).toStrictEqual([]);
  });

  test("it should insert and tabulate a batch of original data", () => {
    const { result } = renderHook(() => useMassageCoinData(DEFAULT_GROUP));

    act(() => {
      result.current.handleInitialData(FAKE_INITIAL_DATA);
    });

    expect(result.current.sells).toStrictEqual(FAKE_INITIAL_DATA_RESULTS.sells);
    expect(result.current.buys).toStrictEqual(FAKE_INITIAL_DATA_RESULTS.buys);
  });

  test("it should merge new items after initial insertion", () => {
    const { result } = renderHook(() => useMassageCoinData(DEFAULT_GROUP));

    act(() => {
      result.current.handleInitialData(FAKE_INITIAL_DATA);
      result.current.handleTricklingData({
        asks: [],
        bids: [[5, 6]],
      });
    });

    expect(result.current.buys).toHaveLength(3);
    expect(result.current.buys).toStrictEqual([
      ...FAKE_INITIAL_DATA_RESULTS.buys,
      [5, 6, 12],
    ]);
  });

  test("it should merge and retabulate a replacement value", () => {
    const { result } = renderHook(() => useMassageCoinData(DEFAULT_GROUP));

    act(() => {
      result.current.handleInitialData(FAKE_INITIAL_DATA);
      result.current.handleTricklingData({
        asks: [],
        bids: [[1, 22]],
      });
    });

    expect(result.current.sells).toStrictEqual(FAKE_INITIAL_DATA_RESULTS.sells);
    expect(result.current.buys).toStrictEqual([
      [1, 22, 22],
      [3, 4, 26],
    ]);
  });
});
