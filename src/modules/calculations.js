export const setDiscount = (discount) => (discount ? (100 - discount) / 100 : 1);

export const getSum = (price, count, discount) => {
  if (price <= 0 || count <= 0) return 0;
  return price * count * setDiscount(discount);
};

export const getTotalSum = (prices = []) => prices.reduce(
    (acc, {count, price, discount}) => acc + getSum(price, count, discount),
    0,
);
