import { fetchGoods } from './api.js'; // Импортируем функцию
import { renderGoods, newTotalSum } from './render.js';
import { productListener, modalListener } from './control.js';
import { getElements } from './elements.js';

const elements = getElements();

export const init = async () => {
  const responseData = await fetchGoods();
  const initialGoods = Array.isArray(responseData) ? responseData : responseData.goods; // Проверяем, что это массив
  renderGoods(initialGoods, elements.tableBody);
  newTotalSum(elements.totalSumElement, initialGoods);
  modalListener();
  productListener(elements.tableBody, initialGoods);
};

document.addEventListener('DOMContentLoaded', init);


