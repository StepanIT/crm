import {fetchGoods, addProductToServer, deleteProductFromServer}
  from './api.js';
import {getElements, getElementsShowModal} from './elements.js';
import {getSum} from './calculations.js';
import {renderGoods, newTotalSum} from './render.js';
import {showModal} from './modal.js';

const elements = getElements();
const elementsShow = getElementsShowModal();


const resetModalForm = () => {
  elementsShow.modalForm.reset();
  elementsShow.modaTotalPrice.value = '$0';
};

export const updateTotalPrice = () => {
  elementsShow.modalForm.addEventListener('change', () => {
    const price = parseFloat(elementsShow.modaInputPrice.value) || 0;
    const count = parseInt(elementsShow.modaInputCount.value) || 0;
    const discount = parseFloat(elementsShow.modaInputDiscount.value) || 0;
    const totalPrice = getSum(price, count, discount);
    elementsShow.modaTotalPrice.value = `$${totalPrice.toFixed(0)}`;
  });
};

export const modalListener = () => {
  elements.btnOpenModal.addEventListener('click', () => {
    elementsShow.modalOverlay.style.display = 'flex';
    showModal();
    resetModalForm();
    updateTotalPrice();
  });

  elementsShow.modalOverlay.addEventListener('click', (e) => {
    const target = e.target;
    if (target === elementsShow.modalOverlay ||
      target.closest('.modal__close')) {
      elementsShow.modalOverlay.style.display = 'none';
    }
  });

  elementsShow.modalCheckbox.addEventListener('change', () => {
    elementsShow.modalCheckboxInput.disabled =
     !elementsShow.modalCheckbox.checked;
    if (!elementsShow.modalCheckbox.checked) {
      elementsShow.modalCheckboxInput.value = '';
    }
    updateTotalPrice();
  });
};

const displayErrorMessage = (message) => {
  const errorBlock = document.createElement('div');
  errorBlock.className = 'error-message';
  errorBlock.textContent = message;
  elementsShow.modalForm.insertBefore(
      errorBlock, elementsShow.modalForm.querySelector('.modal__buttons'));
};

export const productListener = async (tbody) => {
  const initialGoods = await fetchGoods();
  renderGoods(initialGoods, tbody);
  newTotalSum(elements.totalSumElement, initialGoods);

  elementsShow.modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newProduct = {
      title: elementsShow.modalForm.name.value,
      category: elementsShow.modalForm.category.value,
      price: parseFloat(elementsShow.modalForm.price.value),
      description: elementsShow.modalForm.description.value,
      count: parseInt(elementsShow.modalForm.count.value),
      units: elementsShow.modalForm.units.value,
      discount: elementsShow.modalCheckbox.checked ?
        parseFloat(elementsShow.modalCheckboxInput.value) : false,
      images: {
        small: '',
        big: '',
      },
    };

    try {
      await addProductToServer(newProduct);
      const updatedGoods = await fetchGoods();
      renderGoods(updatedGoods, tbody);
      newTotalSum(elements.totalSumElement, updatedGoods);
      elementsShow.modalOverlay.style.display = 'none';
    } catch (error) {
      displayErrorMessage(error.message);
    }
    updateTotalPrice();
  });

  document.querySelector('.table__body').addEventListener('click', e => {
    const target = e.target;
    if (target.closest('.btn-image')) {
      const imgUrl = target.closest('.btn-image').dataset.pic;
      open(imgUrl, '', `width=600,height=600,top=${(screen.height - 700) / 2},
        left=${(screen.width - 700) / 2}`);
    }
  });

  document.querySelector('.table__body').addEventListener('click',
      async (e) => {
        const target = e.target;
        if (target.closest('.btn-edit')) {
          const row = target.closest('.table__body-item');
          const id = row.dataset.id;
          console.log('id:', id);
          try {
            const response = await fetch(`https://amplified-watery-watch.glitch.me/api/goods/${id}`);
            if (response.ok) {
              elementsShow.modalOverlay.style.display = 'flex';
            } else if (!response.ok) {
              throw new Error('Ошибка при получении данных товара');
            }
            const product = await response.json();


            elementsShow.modalForm.name.value = product.title;
            elementsShow.modalForm.category.value = product.category;
            elementsShow.modalForm.price.value = product.price;
            elementsShow.modalForm.description.value = product.description;
            elementsShow.modalForm.count.value = product.count;
            elementsShow.modalForm.units.value = product.units;

            const totalPrice =
             getSum(product.price, product.count, product.discount);
            elementsShow.modalForm.total.value = `$${totalPrice.toFixed(0)}`;

            if (product.discount) {
              elementsShow.modalCheckbox.checked = true;
              elementsShow.modalCheckboxInput.disabled = false;
              elementsShow.modalCheckboxInput.value = product.discount;
            } else {
              elementsShow.modalCheckbox.checked = false;
              elementsShow.modalCheckboxInput.disabled = true;
              elementsShow.modalCheckboxInput.value = '';
            }
            updateTotalPrice();

            showModal();
          } catch (error) {
            console.error('Ошибка при получении данных товара:', error);
            alert('Ошибка при получении данных товара');
          }
        }
      });


  tbody.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.closest('.btn-del')) {
      const row = target.closest('.table__body-item');
      const id = row.dataset.id;

      const confirmation =
       confirm('Вы уверены, что хотите удалить этот товар?');
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
