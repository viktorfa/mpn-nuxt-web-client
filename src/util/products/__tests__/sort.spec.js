import { getSortedProducts, getRealQuantity, getSortFunction } from "../sort";

test("getSortedProducts", () => {
  expect(getSortedProducts([])).toEqual([]);
});

test("getRealQuantity", () => {
  expect(getRealQuantity(2)).toEqual(2);
  expect(
    getRealQuantity({
      amount: { min: 20 },
      unit: { si: { factor: 0.1 } },
    }),
  ).toEqual(20 * 0.1);
  expect(
    getRealQuantity({
      amount: { min: 20 },
      unit: null,
    }),
  ).toEqual(20);
});

describe("getSortFunction", () => {
  it("should work with path config", () => {
    const actual = getSortFunction({
      selectedOption: { key: "price", desc: false },
      sortOptions: {
        price: {
          key: "price",
          type: "number",
          path: ["pricing", "price"],
        },
      },
    });
    expect(typeof actual).toBe("function");
    const list = [{ pricing: { price: 2 } }, { pricing: { price: 1 } }];
    list.sort(actual);
    expect(list).toEqual([
      { pricing: { price: 1 } },
      { pricing: { price: 2 } },
    ]);
  });
  it("should work with path config and desc", () => {
    const actual = getSortFunction({
      selectedOption: { key: "price", desc: true },
      sortOptions: {
        price: {
          key: "size",
          type: "number",
          path: ["quantity", "size"],
        },
      },
    });
    expect(typeof actual).toBe("function");
    const list = [
      { quantity: { size: { amount: { min: 2 } } } },
      { quantity: { size: { amount: { min: 20 } } } },
    ];
    list.sort(actual);
    expect(list).toEqual([
      { quantity: { size: { amount: { min: 20 } } } },
      { quantity: { size: { amount: { min: 2 } } } },
    ]);
  });
  it("should work with calculation config", () => {
    const actual = getSortFunction({
      selectedOption: { key: "value", desc: false },
      sortOptions: {
        value: {
          key: "value",
          text: "Verdi",
          calculation: {
            op1: ["pricing", "price"],
            operand: "/",
            op2: ["quantity", "size"],
          },
        },
      },
    });
    expect(typeof actual).toBe("function");
    const list = [
      {
        pricing: { price: 2 },
        quantity: {
          size: { amount: { min: 1000 }, unit: { si: { factor: 0.001 } } },
        },
      },
      {
        pricing: { price: 2 },
        quantity: {
          size: { amount: { min: 1.1 }, unit: { si: { factor: 1 } } },
        },
      },
    ];
    list.sort(actual);
    expect(list).toEqual([
      {
        pricing: { price: 2 },
        quantity: {
          size: { amount: { min: 1.1 }, unit: { si: { factor: 1 } } },
        },
      },
      {
        pricing: { price: 2 },
        quantity: {
          size: { amount: { min: 1000 }, unit: { si: { factor: 0.001 } } },
        },
      },
    ]);
  });
});
