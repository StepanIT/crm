import { renderGoods, newTotalSum } from './render.js';
import { goods } from './control.js';
import { changeCheckbox, openModal, closeModal, addNewProduct, delProduct } from './control.js';
import { getElements } from './elements.js';
const elements = getElements();

export const init = () => {

  renderGoods(goods, elements.tableBody);
  newTotalSum(elements.totalSumElement, goods);
  changeCheckbox();
  openModal();
  closeModal();
  addNewProduct(goods);
  delProduct(elements.tableBody, goods);

};

document.addEventListener('DOMContentLoaded', init);

