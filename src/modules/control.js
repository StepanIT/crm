import { fetchGoods, addProductToServer, deleteProductFromServer } from './api.js';
import { getElements } from './elements.js';
import { getSum } from './calculations.js';
import { renderGoods, newTotalSum } from './render.js';

const elements = getElements();

const resetModalForm = () => {
  elements.modalForm.reset();
  elements.modaTotalPrice.value = '$0';
};

export const updateTotalPrice = () => {
  elements.modalForm.addEventListener('change', () => {
    const price = parseFloat(elements.modaInputPrice.value) || 0;
    const count = parseInt(elements.modaInputCount.value) || 0;
    const discount = parseFloat(elements.modaInputDiscount.value) || 0;
    elements.modaTotalPrice.value = `$${getSum(price, count, discount)}`;
  });
};

export const modalListener = () => {
  elements.btnOpenModal.addEventListener('click', () => {
    elements.modalDisplayFlex.style.display = 'flex';
    resetModalForm();
    updateTotalPrice();
  });

  elements.modalOverlay.addEventListener('click', (e) => {
    const target = e.target;
    if (target === elements.modalOverlay || target.closest('.modal__close')) {
      elements.modalDisplayFlex.style.display = 'none';
    }
  });

  elements.modalCheckbox.addEventListener('change', () => {
    elements.modalCheckboxInput.disabled = !elements.modalCheckbox.checked;
    if (!elements.modalCheckbox.checked) {
      elements.modalCheckboxInput.value = '';
    }
    updateTotalPrice();
  });
};

const displayErrorMessage = (message) => {
  const errorBlock = document.createElement('div');
  errorBlock.className = 'error-message';
  errorBlock.textContent = message;
  elements.modalForm.insertBefore(
    errorBlock, elements.modalForm.querySelector('.modal__buttons'));
};

export const productListener = async (tbody) => {
  const initialGoods = await fetchGoods();
  renderGoods(initialGoods, tbody);
  newTotalSum(elements.totalSumElement, initialGoods);

  elements.modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newProduct = {
      title: elements.modalForm.name.value,
      category: elements.modalForm.category.value,
      price: parseFloat(elements.modalForm.price.value),
      description: elements.modalForm.description.value,
      count: parseInt(elements.modalForm.count.value),
      units: elements.modalForm.units.value,
      discount: elements.modalCheckbox.checked ?
        parseFloat(elements.modalCheckboxInput.value) : false,
      images: {
        small: '',
        big: '',
      },
    };

    try {
      const savedProduct = await addProductToServer(newProduct);
      const updatedGoods = await fetchGoods();
      renderGoods(updatedGoods, tbody);
      newTotalSum(elements.totalSumElement, updatedGoods);
      elements.modalDisplayFlex.style.display = 'none';
    } catch (error) {
      displayErrorMessage(error.message);
    }
  });

  tbody.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.closest('.btn-del')) {
      const row = target.closest('.table__body-item');
      const id = parseInt(row.dataset.id);

      const confirmation = confirm('Вы уверены, что хотите удалить этот товар?');
      if (!confirmation) return;

      try {
        const isDeleted = await deleteProductFromServer(id);
        if (isDeleted) {
          const updatedGoods = await fetchGoods();
          renderGoods(updatedGoods, tbody);
          newTotalSum(elements.totalSumElement, updatedGoods);
        }
      } catch (error) {
        alert('Не удалось удалить товар. Попробуйте снова.');
      }
    }
  });
};
