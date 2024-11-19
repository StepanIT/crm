import {fetchGoods, addProductToServer, deleteProductFromServer, showErrorModal}
  from './api.js';
import {getElements} from './elements.js';
import {getSum} from './calculations.js';
import {renderGoods, newTotalSum} from './render.js';
import {showModal} from './modal.js';

const elements = getElements();
let elementsShow;


const resetModalForm = () => {
  if (elementsShow && elementsShow.modalForm) {
    elementsShow.modalForm.reset();
    elementsShow.modalTotalPrice.value = '$0';
    elementsShow.imagePreview.style.display = 'none';
    elementsShow.imageContainer.classList.remove('active');
    elementsShow.imageError.style.display = 'none';
  }
};

const activeErrorImg = () => {
  elementsShow.imageError.style.display = 'flex';
  elementsShow.imageContainer.classList.remove('active');
};
const activeContainerImg = () => {
  elementsShow.imagePreview.style.display = 'block';
  elementsShow.imageContainer.classList.add('active');
  elementsShow.imageError.style.display = 'none';
  elementsShow.modalFormError.style.marginBottom = '30px';
};

export const updateTotalPrice = () => {
  if (elementsShow && elementsShow.modalForm) {
    elementsShow.modalForm.addEventListener('change', () => {
      const price = parseFloat(elementsShow.modalInputPrice.value) || 0;
      const count = parseInt(elementsShow.modalInputCount.value) || 0;
      const discount = parseFloat(elementsShow.modalCheckboxInput.value) || 0;
      const totalPrice = getSum(price, count, discount);
      elementsShow.modalTotalPrice.value = `$${totalPrice.toFixed(0)}`;
    });
  }
};

const cyrillicAndSpace = (e) => {
  const input = e.target;
  const value = input.value;
  const regex = /^[А-Яа-яЁё\s]*$/;

  if (!regex.test(value)) {
    input.value = value.replace(/[^А-Яа-яЁё\s]/g, '');
  }
};

const preventSpaceInput = (e) => {
  if (e.key === ' ') {
    e.preventDefault();
  }
};

const validateCyrillic = (e) => {
  const input = e.target;
  const value = input.value;

  const validCyrillic = /^[а-яА-ЯёЁ]*$/;


  if (!validCyrillic.test(value)) {
    input.value = value.replace(/[^а-яА-ЯёЁ\s]/g, '');
  }
};

const validateNumber = (e) => {
  const input = e.target;
  const value = input.value;

  input.value = value.replace(/[^0-9]/g, '');
};

export const modalListener = async () => {
  elementsShow = await showModal();
  if (!elementsShow || !elementsShow.modalForm) {
    console.error('elementsShow или modalForm не инициализированы');
  }

  const modalName = elementsShow.modalForm.name;
  const modalCategory = elementsShow.modalForm.category;
  const modalDescription = elementsShow.modalForm.description;
  const modalCount = elementsShow.modalForm.count;
  const modalDiscount = elementsShow.modalCheckboxInput;
  const modalPrice = elementsShow.modalInputPrice;

  const validateForm = () => {
    const nameFilled = modalName.value.trim() !== '';
    const categoryFilled = modalCategory.value.trim() !== '';
    const descriptionFilled = modalDescription.value.trim().length >= 80;
    const quantityFilled = modalCount.value.trim() !== '';
    const priceFilled = modalPrice.value.trim() !== '';

    return (
      nameFilled &&
      categoryFilled &&
      descriptionFilled &&
      quantityFilled &&
      priceFilled
    );
  };

  if (modalName) {
    modalName.addEventListener('input', cyrillicAndSpace);
  }
  if (modalCategory) {
    modalCategory.addEventListener('input', cyrillicAndSpace);
  }
  if (modalDescription) {
    modalDescription.addEventListener('input', cyrillicAndSpace);
  }

  if (!elementsShow || !elementsShow.modalForm) {
    console.error('elementsShow или modalForm не инициализированы');
    return;
  }

  const modalUnits = elementsShow.modalForm.units;

  if (modalUnits) {
    modalUnits.addEventListener('keydown', preventSpaceInput);
    modalUnits.addEventListener('input', validateCyrillic);
  }


  if (!elementsShow || !elementsShow.modalForm) {
    console.error('elementsShow или modalForm не инициализированы');
    return;
  }


  if (modalCount) {
    modalCount.addEventListener('input', validateNumber);
  } else {
    console.error('Поле количества не найдено');
  }

  if (modalDiscount) {
    modalDiscount.addEventListener('input', validateNumber);
  } else {
    console.error('Поле дисконта не найдено');
  }

  if (modalPrice) {
    modalPrice.addEventListener('input', validateNumber);
  }


  elementsShow.submit.addEventListener('click', (e) => {
    if (!validateForm()) {
      e.preventDefault();
      showErrorModal(`Описание должно содержать минимум 80 символов.`);
      return;
    }
  });

  elements.btnOpenModal.addEventListener('click', () => {
    if (elementsShow) {
      elementsShow.overlay.style.display = 'flex';
      resetModalForm();
      updateTotalPrice();
    }
  });

  if (elementsShow) {
    elementsShow.overlay.addEventListener('click', (e) => {
      const target = e.target;
      if (target === elementsShow.overlay ||
        target.closest('.modal__close')) {
        elementsShow.overlay.style.display = 'none';
        resetModalForm();
      }
    });

    elementsShow.imageContainer.addEventListener('click', (e) => {
      e.preventDefault();
      elementsShow.imageContainer.classList.remove('active');
      elementsShow.imagePreview.style.display = 'none';
    });

    elementsShow.modalCheckbox.addEventListener('change', () => {
      elementsShow.modalCheckboxInput.disabled =
       !elementsShow.modalCheckbox.checked;
      if (!elementsShow.modalCheckbox.checked) {
        elementsShow.modalCheckboxInput.value = '';
      }
      updateTotalPrice();
    });
  }
};

const displayErrorMessage = (message) => {
  if (elementsShow && elementsShow.modalForm) {
    const errorBlock = document.createElement('div');
    errorBlock.className = 'error-message';
    errorBlock.textContent = message;
    elementsShow.modalForm.insertBefore(
        errorBlock, elementsShow.modalForm.querySelector('.modal__buttons'));
  } else {
    console.error('elementsShow не инициализирован. Ошибка:', message);
  }
};


export const productListener = async (tbody) => {
  const initialGoods = await fetchGoods();
  renderGoods(initialGoods, tbody);
  newTotalSum(elements.totalSumElement, initialGoods);


  if (elementsShow && elementsShow.modalForm) {
    const file = elementsShow.modalInputFile;
    const preview = elementsShow.imagePreview;


    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('loadend', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', err => {
        reject(err);
      });

      reader.readAsDataURL(file);
    });


    file.addEventListener('change', async () => {
      const maxSizeImg = 1048576;

      if (file.files.length > 0) {
        const uploadedFile = file.files[0];

        if (uploadedFile.size > maxSizeImg) {
          activeErrorImg();
          return;
        }

        const src = URL.createObjectURL(file.files[0]);
        preview.src = src;
        activeContainerImg();
        await toBase64(file.files[0]);
      }
    });

    elementsShow.modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();


      const uploadedFile = elementsShow.modalInputFile.files[0];
      let base64Image = '';

      if (uploadedFile) {
        base64Image = await toBase64(uploadedFile);
      }

      const newProduct = {
        title: elementsShow.modalForm.name.value,
        category: elementsShow.modalForm.category.value,
        price: parseFloat(elementsShow.modalForm.price.value),
        description: elementsShow.modalForm.description.value,
        count: parseInt(elementsShow.modalForm.count.value),
        units: elementsShow.modalForm.units.value,
        discount: elementsShow.modalCheckbox.checked ?
           parseFloat(elementsShow.modalCheckboxInput.value) : false,
        image: base64Image,
      };

      try {
        await addProductToServer(newProduct);
        const updatedGoods = await fetchGoods();
        renderGoods(updatedGoods, tbody);
        newTotalSum(elements.totalSumElement, updatedGoods);
        if (elementsShow) {
          elementsShow.overlay.style.display = 'none';
        }
      } catch (error) {
        displayErrorMessage(error.message);
      }
      updateTotalPrice();
    });
  }

  document.querySelector('.table__body').addEventListener('click', async (e) => {
    const target = e.target;
    if (target.closest('.btn-image')) {
      const row = target.closest('.table__body-item');
      const productId = row.dataset.id;

      const response = await fetch(`https://amplified-watery-watch.glitch.me/api/goods/${productId}`);
      if (response.ok) {
        const product = await response.json();

        const baseUrl = 'https://amplified-watery-watch.glitch.me/';
        const imgUrl = `${baseUrl}${product.image}`;
        
        open(imgUrl, '', `width=600,height=600,top=${(screen.height - 700) / 2},
      left=${(screen.width - 700) / 2}`);
      }
    }
  });
  


  document.querySelector('.table__body').addEventListener('click',
      async (e) => {
        const target = e.target;
        if (target.closest('.btn-edit')) {
          const row = target.closest('.table__body-item');
          const id = row.dataset.id;
          try {
            const response = await fetch(`https://amplified-watery-watch.glitch.me/api/goods/${id}`);
            if (response.ok) {
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

              const baseUrl = 'https://amplified-watery-watch.glitch.me/';
              if (product.image) {
                elementsShow.imagePreview.src = `${baseUrl}${product.image}`;
                elementsShow.imagePreview.style.display = 'block';
                elementsShow.imageContainer.classList.add('active');
              } else {
                elementsShow.imagePreview.style.display = 'none';
                elementsShow.imageContainer.classList.remove('active');
              }


              updateTotalPrice();
              elementsShow.overlay.style.display = 'flex';
              elementsShow.modalFormError.style.marginBottom = '30px';
            } else {
              throw new Error('Ошибка при получении данных товара');
            }
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
