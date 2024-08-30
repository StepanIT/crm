import { getTotalSum } from './calculations.js';
import { createRow } from './create.js';

export const renderGoods = (data, tbody) => {
  tbody.innerHTML = '';
  data.forEach((el) => {
    tbody.append(createRow(el));
  });
};

export const newTotalSum = (totalSumElement, data) => {
  totalSumElement.textContent = `$${getTotalSum(data)}`;
};

