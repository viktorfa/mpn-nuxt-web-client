import { provenanceTypes } from "~/util/enums";
import { getProductValue } from "~/util/products";


export const getStandardProduct = (product) => {
  switch (product.provenance) {
    case provenanceTypes.CUSTOM:
      return {
        title: product.heading,
        price: product.pricing.price || product.pricing.text || "",
        subtitle: product.dealer,
        dealer: product.dealer,
        description: product.description,
        href: "#",
        image_url: product.image_url,
        id: product.uri || product._id,
      };
    default:
      return {
        title: product.heading,
        price: product.pricing.price,
        subtitle: product.description,
        description: product.description,
        dealer: product.dealer,
        provenance: product.provenance,
        href: product.href,
        image_url: product.image_url,
        id: product.uri,
        value: getProductValue(product),
      };
  }
};
