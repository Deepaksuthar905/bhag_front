import { Product } from "@/lib/types";

const formatCurrency = (value: number): string => `₹${value.toLocaleString("en-IN")}`;

export const formatProductListingPrice = (product: Product): string => {
  const minPrice = product.priceMin;
  const maxPrice = product.priceMax;

  const hasRange =
    typeof minPrice === "number" &&
    typeof maxPrice === "number" &&
    minPrice > 0 &&
    maxPrice > 0;

  if (hasRange) {
    if (minPrice === maxPrice) {
      return formatCurrency(minPrice);
    }

    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
  }

  if (typeof product.price === "number" && product.price > 0) {
    return formatCurrency(product.price);
  }

  return formatCurrency(0);
};
