import {fetchGoods,
  addProductToServer,
  deleteProductFromServer,
  showErrorModal,
  fetchGoodsWithSearch}
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

export const updateProductIcon = (productRow, imageUrl) => {
  const svgImage = productRow.querySelector('.svg-image');
  const svgNotImage = productRow.querySelector('.svg-not_image');

  if (imageUrl === 'image/notimage.jpg' || !imageUrl) {
    svgImage.style.display = 'none';
    svgNotImage.style.display = 'block';
  }
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

  document.querySelector('.table__body')
      .addEventListener('click', async (e) => {
        const target = e.target;
        if (target.closest('.btn-image')) {
          const row = target.closest('.table__body-item');
          const productId = row.dataset.id;

          try {
            const response = await fetch(`https://amplified-watery-watch.glitch.me/api/goods/${productId}`);
            if (response.ok) {
              const product = await response.json();

              const baseUrl = 'https://amplified-watery-watch.glitch.me/';
              const imgUrl = `${baseUrl}${product.image}`;

              if (product.image && product.image !== 'image/notimage.jpg') {
                open(imgUrl, '', `width=600,
                  height=600,top=${(screen.height - 700) / 2},
               left=${(screen.width - 700) / 2}`);
              } else {
                const imgStub = target.closest('.btn-image').dataset.pic;
                open(imgStub, '', `width=600,
                  height=600,top=${(screen.height - 700) / 2},
               left=${(screen.width - 700) / 2}`);
              }
            } else {
              console.error('Ошибка при получении данных товара.');
            }
          } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
          }
        }
      });


  document.querySelector('.table__body').addEventListener('click',
      async (e) => {
        const target = e.target;
        if (target.closest('.btn-edit')) {
          const row = target.closest('.table__body-item');
          const id = row.dataset.id;
          elementsShow.modalForm.dataset.id = id;

          elementsShow.submit.style.display = 'none';
          elementsShow.editCard.style.display = 'block';

          try {
            const response = await fetch(`https://amplified-watery-watch.glitch.me/api/goods/${id}`);
            console.log(response);
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
              console.log(baseUrl);
              if (product.image && product.image !== 'image/notimage.jpg') {
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

  elementsShow.editCard.addEventListener('click', async (e) => {
    e.preventDefault();

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

      const uploadedFile = elementsShow.modalInputFile.files[0];
      let base64Image = '';

      if (uploadedFile) {
        base64Image = await toBase64(uploadedFile);
      }


      const id = elementsShow.modalForm.dataset.id;
      if (!id) {
        console.error('ID товара не найден');
        return;
      }

      const updatedData = {
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
        const response = await fetch(`https://amplified-watery-watch.glitch.me/api/goods/${id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error('Ошибка обновления товара');

        const updatedGoods = await fetchGoods();
        renderGoods(updatedGoods, tbody);
        newTotalSum(elements.totalSumElement, updatedGoods);

        elementsShow.overlay.style.display = 'none';
      } catch (error) {
        console.error('Ошибка обновления товара:', error);
        showErrorModal('Не удалось обновить товар, попробуйте снова.');
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

const searchInput = document.querySelector('.panel__input');
const tableBody = document.querySelector('.table__body');
let debounceTimer;

export const updateTable = (goods) => {
  tableBody.innerHTML = '';
  goods.forEach((good) => {
    const row = document.createElement('tr');
    row.classList.add('table__body-item');
    const totalPrice = getSum(good.price, good.count, good.discount);
    row.innerHTML = `
       <td class="table__body-item__ID">${good.id}</td>
    <td class="table__body-item__name">${good.title}</td>
    <td class="table__body-item__category">${good.category}</td>
    <td class="table__body-item__units">${good.units}</td>
    <td class="table__body-item__quantity">${good.count}</td>
    <td class="table__body-item__price">$${good.price}</td>
    <td class="table__body-item__total">$${totalPrice.toFixed(0)}</td>
    <td class="table__body-item-icons">
      <button class="table__body-item-icons__btn btn-image"
       data-pic="../../img/not-image.png">
        <svg width="20" height="20" viewBox="0 0 20 20"
        fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.75 2.13375L17.8663 1.25L1.25
          17.8663L2.13375 18.75L3.38375 17.5H16.25C16.5814
          17.4995 16.899 17.3676 17.1333 17.1333C17.3676
          16.899 17.4995 16.5814 17.5 16.25V3.38375L18.75
          2.13375ZM16.25 16.25H4.63375L9.50437 11.3794L10.9913
          12.8663C11.2257 13.1006 11.5435 13.2322 11.875
          13.2322C12.2065 13.2322 12.5243 13.1006 12.7587
          12.8663L13.75 11.875L16.25 14.3731V16.25ZM16.25
          12.605L14.6337 10.9888C14.3993 10.7544 14.0815
          10.6228 13.75 10.6228C13.4185 10.6228 13.1007
          10.7544 12.8663 10.9888L11.875 11.98L10.3894
          10.4944L16.25 4.63375V12.605Z" fill="#6E6893"/>
          <path d="M3.75 13.75V11.875L6.875 8.75187L7.73313
          9.61062L8.61812 8.72563L7.75875 7.86625C7.52434
          7.63191 7.20646 7.50027 6.875 7.50027C6.54354
          7.50027 6.22566 7.63191 5.99125 7.86625L3.75
          10.1075V3.75H13.75V2.5H3.75C3.41858 2.50033
          3.10083 2.63213 2.86648 2.86648C2.63213 3.10083
          2.50033 3.41858 2.5 3.75V13.75H3.75Z" fill="#6E6893"/>
        </svg>
      </button>
      <button class="table__body-item-icons__btn btn-edit">
        <svg width="18" height="19" viewBox="0 0 18 19"
        fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5629 3.86078L15.6394 5.93629L13.5629
          3.86078ZM14.8982 2.03233L9.28343 7.64709C8.99332
          7.9368 8.79546 8.3059 8.7148 8.70789L8.19617
          11.304L10.7923 10.7844C11.1942 10.704 11.5629
          10.5069 11.8531 10.2167L17.4678 4.60196C17.6366
          4.43324 17.7704 4.23293 17.8617 4.01248C17.953
          3.79203 18 3.55576 18 3.31714C18 3.07853 17.953
          2.84225 17.8617 2.6218C17.7704 2.40136 17.6366
          2.20105 17.4678 2.03233C17.2991 1.8636 17.0988
          1.72976 16.8784 1.63845C16.6579 1.54714 16.4216
          1.50014 16.183 1.50014C15.9444 1.50014 15.7081
          1.54714 15.4877 1.63845C15.2672 1.72976 15.0669
          1.8636 14.8982 2.03233V2.03233Z" stroke="#6E6893"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16.0394 13.2648V16.206C16.0394 16.726
          15.8328 17.2248 15.4651 17.5925C15.0973 17.9602
          14.5986 18.1668 14.0786 18.1668H3.29415C2.77411
          18.1668 2.27537 17.9602 1.90765 17.5925C1.53993
          17.2248 1.33334 16.726 1.33334 16.206V5.42157C1.33334
          4.90154 1.53993 4.4028 1.90765 4.03508C2.27537 3.66735
          2.77411 3.46077 3.29415 3.46077H6.23535" stroke="#6E6893"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="table__body-item-icons__btn btn-del">
        <svg width="20" height="20" viewBox="0 0 20 20"
        fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.03125 3.59375H6.875C6.96094 3.59375
          7.03125 3.52344 7.03125 3.4375V3.59375H12.9688V3.4375C12.9688
          3.52344 13.0391 3.59375 13.125
          3.59375H12.9688V5H14.375V3.4375C14.375
          2.74805 13.8145 2.1875 13.125 2.1875H6.875C6.18555 2.1875
          5.625 2.74805 5.625 3.4375V5H7.03125V3.59375ZM16.875
          5H3.125C2.7793 5 2.5 5.2793 2.5 5.625V6.25C2.5 6.33594
          2.57031 6.40625 2.65625 6.40625H3.83594L4.31836
          16.6211C4.34961 17.2871 4.90039 17.8125 5.56641
          17.8125H14.4336C15.1016 17.8125 15.6504 17.2891
          15.6816 16.6211L16.1641 6.40625H17.3438C17.4297
          6.40625 17.5 6.33594 17.5 6.25V5.625C17.5 5.2793
          17.2207 5 16.875 5ZM14.2832
          16.4062H5.7168L5.24414 6.40625H14.7559L14.2832
          16.4062Z" fill="#6E6893"/>
        </svg>
      </button>
    </td>
    `;
    tableBody.appendChild(row);
  });
};

searchInput.addEventListener('input', (event) => {
  const query = event.target.value;

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    fetchGoodsWithSearch(query);
  }, 300);
});

