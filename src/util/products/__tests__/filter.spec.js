import { filterProducts, getFilterFunctions, getEnumFunction } from "../filter";

const defaultFilterOptions = {
  dealers: {
    key: "dealers",
    type: "enum",
    path: ["provenance"],
    items: [
      { key: "holdbart.no", text: "holdbart" },
      { key: "gottebiten.se", text: "gottebiten" },
      { key: "swecandy.se", text: "swecandy" },
      { key: "yoolando.com", text: "yoolando" },
    ],
  },
  price: {
    key: "price",
    type: "number",
    path: ["pricing", "price"],
  },
  promoted: {
    key: "promoted",
    type: "boolean",
    path: ["is_promoted"],
  },
  category: {
    key: "category",
    type: "include",
    path: ["categories"],
    items: [{ key: "snacks", text: "Snacks", value: "Snacks" }],
  },
};

describe("filterProducts", () => {
  it("should filter products", () => {
    const products = [
      {
        provenance: "kolonial",
        id: 1,
      },
      {
        provenance: "ikea",
        id: 2,
      },
    ];
    const actual = filterProducts(products, [(x) => x.provenance === "ikea"]);
    expect(actual[0].id).toBe(2);
    expect(actual[0].provenance).toBe("ikea");
    expect(actual.length).toBe(1);
  });
});

describe("getFilterFunctions", () => {
  it("should return a list of functions", () => {
    const selectedOptions = { "dealers.holdbart.no": true };
    const filterOptions = defaultFilterOptions;
    const actual = getFilterFunctions({ selectedOptions, filterOptions });
    expect(actual.length).toBe(1);
    expect(typeof actual[0]).toBe("function");
    expect(actual[0]({ provenance: "holdbart.no" })).toBeTruthy();
    expect(actual[0]({ provenance: "ikea.no" })).toBeFalsy();
  });
});

describe("getFunctionOfType", () => {
  it("getEnumFunction should work", () => {});
});
