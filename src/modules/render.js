import {getTotalSum} from './calculations.js';
import {createRow} from './create.js';
import {updateProductIcon} from './control.js';

export const renderGoods = (data, tbody) => {
  tbody.innerHTML = '';
  data.forEach((el) => {
    const productRow = createRow(el);
    updateProductIcon(productRow, el.image);
    tbody.append(productRow);
  });
};


export const newTotalSum = (totalSumElement, data) => {
  const totalPrice = getTotalSum(data);
  totalSumElement.textContent = `$${totalPrice.toFixed(0)}`;
};


