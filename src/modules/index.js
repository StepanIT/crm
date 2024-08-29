import {getElements} from './elements.js';
import {calculateTotalPrice, updateTotalSum} from './calculations.js';
import {goods, addGoods, removeGoodsById} from './control.js';
import {renderGoods} from './render.js';

const elements = getElements();

const init = () => {
  elements.modalDisplayFlex.style.display = 'none';

  elements.btnOpenModal.addEventListener('click', () => {
    elements.modalDisplayFlex.style.display = 'flex';
    calculateTotalPrice();
  });

  elements.modalOverlay.addEventListener('click', e => {
    const target = e.target;
    if (target === elements.modalOverlay || target.closest('.modal__close')) {
      elements.modalDisplayFlex.style.display = 'none';
    }
  });

  elements.modalCheckbox.addEventListener('change', () => {
    if (elements.modalCheckbox.checked) {
      elements.modalCheckboxInput.disabled = false;
    } else {
      elements.modalCheckboxInput.disabled = true;
      elements.modalCheckboxInput.value = '';
    }
    calculateTotalPrice();
  });

  elements.modalForm.addEventListener('submit', e => {
    e.preventDefault();

    const newProduct = {
      id: parseInt(Date.now().toString().slice(-9), 10),
      title: elements.modalForm.name.value,
      category: elements.modalForm.category.value,
      price: parseFloat(elements.modalForm.price.value),
      count: parseInt(elements.modalForm.count.value),
      units: elements.modalForm.units.value,
      discont:
       elements.modalCheckbox.checked ?
        parseFloat(elements.modalCheckboxInput.value) : false,
      images: {
        small: '',
        big: '',
      },
    };

    addGoods(newProduct);
    renderGoods(goods);
    elements.modalForm.reset();
    elements.modalDisplayFlex.style.display = 'none';
  });

  elements.tableBody.addEventListener('click', e => {
    const target = e.target;
    if (target.closest('.btn-del')) {
      const row = target.closest('.table__body-item');
      const id = parseInt(row.dataset.id);
      removeGoodsById(id);
      row.remove();
      updateTotalSum();
    }
  });

  renderGoods(goods);
};

document.addEventListener('DOMContentLoaded', init);
