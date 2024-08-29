import {updateTotalSum} from './calculations.js';
import {createRow} from './create.js';
import {goods} from './control.js';


export const renderGoods = (goods) => {
  const newTbody = document.querySelector('.table__body');
  newTbody.innerHTML = '';
  goods.map((el) => {
    newTbody.append(createRow(el));
  });
  updateTotalSum();
  console.log(goods);
};

renderGoods(goods);
