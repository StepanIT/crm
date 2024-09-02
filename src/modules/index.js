import {renderGoods, newTotalSum} from './render.js';
import {goods} from './control.js';
import {productListener, modalListener} from './control.js';
import {getElements} from './elements.js';
const elements = getElements();

export const init = () => {
  renderGoods(goods, elements.tableBody);
  newTotalSum(elements.totalSumElement, goods);
  modalListener();
  productListener(elements.tableBody, goods);
};

document.addEventListener('DOMContentLoaded', init);

