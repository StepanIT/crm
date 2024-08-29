import {getElements} from './elements.js';
import {goods} from './control.js';
const elements = getElements();

export const calculateTotalPrice = () => {
  const price = parseFloat(elements.modaInputPrice.value) || 0;
  const count = parseInt(elements.modaInputCount.value) || 0;
  const discont = parseFloat(elements.modaInputDiscount.value) || 0;

  let totalPrice = price * count;

  if (discont > 0) {
    totalPrice -= totalPrice * (discont / 100);
  }
  elements.modaTotalPrice.value = `$${totalPrice}`;
};

elements.modaInputPrice.addEventListener('change', calculateTotalPrice);
elements.modaInputCount.addEventListener('change', calculateTotalPrice);
elements.modaInputDiscount.addEventListener('change', calculateTotalPrice);


export const updateTotalSum = () => {
  const totalSum = goods.reduce((sum, item) => {
    let itemTotal = item.price * item.count;

    if (item.discont > 0) {
      itemTotal -= itemTotal * (item.discont / 100);
    }
    return sum + itemTotal;
  }, 0);

  elements.totalSumElement.textContent = `$${totalSum}`;
};
