export const setDiscount = (discont) => (discont ? (100 - discont) / 100 : 1);

export const getSum = (price, count, discont) => {
  if (price <= 0 || count <= 0) return 0;
  return price * count * setDiscount(discont);
};

export const getTotalSum = (prices = []) => prices.reduce(
    (acc, {count, price, discont}) => acc + getSum(price, count, discont),
    0,
);
