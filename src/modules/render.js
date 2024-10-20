import {getTotalSum} from './calculations.js';
import {createRow} from './create.js';

export const renderGoods = (data, tbody) => {
  tbody.innerHTML = '';
  data.forEach((el) => {
    tbody.append(createRow(el));
  });
};

export const newTotalSum = (totalSumElement, data) => {
  const totalPrice = getTotalSum(data);
  totalSumElement.textContent = `$${totalPrice.toFixed(0)}`;
};


