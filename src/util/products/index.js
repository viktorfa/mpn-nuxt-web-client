import { dealerLogos } from "../../constants/images";
import { SHOPGUN_URL } from "../../constants";

export const formatPrice = (price, suffix = ",-") => {
  if (price && price.toFixed) {
    return `${price.toFixed(2).replace(".", ",")}${suffix}`;
  } else {
    return price;
  }
};

export const getValueString = ({ amount, unit }) => {
  if (!amount.max) {
    return "";
  }
  if (unit) {
    return `${formatPrice(amount.max, "")} kr/${unit.symbol}`;
  }
  return `${formatPrice(amount.max, "")} kr/stk`;
};

export const calculateValue = ({ amount, unit, pricing }) => {
  if (unit && unit.si) {
    return {
      amount: {
        max: pricing.price / (amount.max * unit.si.factor),
        min: pricing.price / (amount.min * unit.si.factor),
      },
      unit: unit.si,
    };
  }
  return {
    amount: {
      max: pricing.price / amount.max,
      min: pricing.price / amount.min,
    },
    unit,
  };
};

export const getProductSize = ({ quantity }) => {
  try {
    if (quantity.size.unit) {
      const unit = quantity.size.unit.si.symbol;
      return `${quantity.size.amount.min *
        quantity.size.unit.si.factor} ${unit}`;
    } else {
      const unit = quantity.size.unit.symbol;
      return `${quantity.size.amount.min} ${unit}`;
    }
  } catch (e) {
    return "";
  }
};

export const getProductValue = ({ quantity, value, pricing }) => {
  if (value) {
    if (value.size && value.size.amount && value.size.amount.max) {
      return getValueString(value.size);
    } else if (value.pieces && value.pieces.amount && value.pieces.amount.max) {
      return getValueString(value.pieces);
    }
  }
  if (pricing) {
    if (quantity) {
      if (quantity.size && quantity.size.amount && quantity.size.amount.max) {
        return getValueString(calculateValue({ ...quantity.size, pricing }));
      } else if (
        quantity.pieces &&
        quantity.pieces.amount &&
        quantity.pieces.amount.max
      ) {
        return getValueString(calculateValue({ ...quantity.pieces, pricing }));
      }
    }
  }
  return "";
};

export const getDealerLogoSrc = (dealerName) => {
  return dealerLogos[dealerName];
};

export const getAmpShareUrlForProduct = ({ id }) =>
  `https://allematpriser.no/tilbud/${id}`;

export const getShopgunOfferCatalogUrl = ({ catalog_id, catalog_page }) =>
  `${SHOPGUN_URL}/publications/paged/${catalog_id}/pages/${catalog_page}`;

export const isProductUri = (string) => /\w+:product:\w+/gi.test(string);
