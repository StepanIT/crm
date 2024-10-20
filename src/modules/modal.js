import {loadStyles} from './loadStyle.js';

export const showModal = async (err, data) => {
  await loadStyles('css/modal.css');
  const overlay = document.createElement('div');
  const overlayModal = document.createElement('div');
  const modalClose = document.createElement('button');
  const modalTop = document.createElement('div');
  const modalTitle = document.createElement('h2');
  const modalVendorCode = document.createElement('div');
  const vendorCodeWrapper = document.createElement('p');
  const vendorCodeId = document.createElement('span');
  const modalForm = document.createElement('form');


  overlay.classList.add('overlay');
  overlayModal.classList.add('overlay__modal', 'modal');
  modalClose.classList.add('modal__close');
  modalClose.insertAdjacentHTML('beforeend', `
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m2 2 20 20M2 22 22 2" stroke="currentColor"
           stroke-width="3" stroke-linecap="round" />
    </svg>
    `);
  modalTop.classList.add('modal_top');
  modalTitle.classList.add('modal__title');
  modalTitle.textContent = 'Добавить товар';
  modalVendorCode.classList.add('modal__vendor-code');
  vendorCodeWrapper.classList.add('vendor-code__wrapper');
  vendorCodeWrapper.textContent = 'id:';
  vendorCodeId.classList.add('vendor-code__id');
  vendorCodeId.textContent = '201910241';


  modalForm.classList.add('modal__form');
  modalForm.insertAdjacentHTML('beforeend', `
    <fieldset class="modal__fieldset">
          <label class="modal__label modal__label_name" for="name">
            <span class="modal__text">Наименование</span>
            <input class="modal__input" type="text"
             name="name" id="name" required>
          </label>
          <label class="modal__label modal__label_category" for="category">
            <span class="modal__text">Категория</span>
            <input class="modal__input" type="text"
             name="category" id="category" required>
          </label>
          <label class="modal__label modal__label_description"
           for="description">
            <span class="modal__text">Описание</span>
            <textarea class="modal__input modal__input_textarea"
             name="description" id="description" required></textarea>
          </label>
          <label class="modal__label modal__label_units" for="units">
            <span class="modal__text">Единицы измерения</span>
            <input class="modal__input" type="text" name="units"
             id="units" required>
          </label>
          <div class="modal__label modal__label_discount">
            <label class="modal__text" for="discount">Дисконт</label>
            <div class="modal__checkbox-wrapper">
              <input class="modal__checkbox" type="checkbox"
               name="discount" id="discount">
              <input class="modal__input modal__input_discount"
               type="text" name="discount_count" disabled>
            </div>
          </div>
          <label class="modal__label modal__label_count" for="count">
            <span class="modal__text">Количество</span>
            <input class="modal__input modal__input_count"
             type="number" name="count" id="count" required>
          </label>
          <label class="modal__label modal__label_price" for="price">
            <span class="modal__text">Цена</span>
            <input class="modal__input modal__input_price"
             type="number" name="price" id="price" required>
          </label>
          <label tabindex="0" for="image"
           class="modal__label modal__label_file">Добавить изображение</label>
          <input class="modal__file visually-hidden"
           tabindex="-1" type="file" name="image" id="image">
        </fieldset>
        <div class="modal__footer">
          <label class="modal__total">Итоговая стоимость:
            <output class="modal__total-price" name="total">$ 0</output>
          </label>
          <button class="modal__submit" type="submit">Добавить товар</button>
        </div>
    `);


  overlay.append(overlayModal);
  overlayModal.append(modalClose, modalTop, modalForm);
  modalTop.append(modalTitle, modalVendorCode);
  modalVendorCode.append(vendorCodeWrapper);
  vendorCodeWrapper.append(vendorCodeId);


  const modalError = document.createElement('div');
  const modalErrorContent = document.createElement('div');
  const modalErrorClose = document.createElement('div');
  const modalErrorContentBlock = document.createElement('div');
  const modalErrorCross = document.createElement('p');
  const modalErrorMessage = document.createElement('p');


  modalError.classList.add('modal__error');
  modalError.id = 'errorModal';
  modalErrorContent.classList.add('modal__error-content');
  modalErrorClose.classList.add('modal__error-close');
  modalErrorClose.id = 'closeErrorModal';
  modalErrorClose.insertAdjacentHTML('beforeend', `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L22 22" stroke="#6E6893" stroke-width="3"
           stroke-linecap="round" />
          <path d="M2 22L22 2" stroke="#6E6893" stroke-width="3"
           stroke-linecap="round" />
        </svg>
    `);
  modalErrorContentBlock.classList.add('modal__error-content__block');
  modalErrorCross.classList.add('modal__error-cross');
  modalErrorCross.insertAdjacentHTML('beforeend', `
    <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L92 92" stroke="#D80101" stroke-width="3"
             stroke-linecap="round" />
            <path d="M2 92L92 2" stroke="#D80101" stroke-width="3"
             stroke-linecap="round" />
      </svg>
    `);
  modalErrorMessage.classList.add('modal__error-message');
  modalErrorMessage.id = 'errorMessage';
  modalErrorMessage.textContent = 'Что-то пошло не так';


  modalError.append(modalErrorContent);
  modalErrorContent.append(modalErrorClose, modalErrorContentBlock);
  modalErrorContentBlock.append(modalErrorCross, modalErrorMessage);


  document.body.append(overlay, modalError);

  const formModal = document.querySelector('.modal__form');

  const modalCheckbox = formModal.querySelector('.modal__checkbox');
  const modalCheckboxInput =
  formModal.querySelector('.modal__input_discount');
  const modalInputCount = formModal.querySelector('.modal__input_count');
  const modalInputPrice = formModal.querySelector('.modal__input_price');
  const modalTotalPrice = formModal.querySelector('.modal__total-price');
  const modalSubmit = document.querySelector('.modal__submit');

  return {
    overlay,
    modalForm,
    modalTitle,
    modalCheckbox,
    modalCheckboxInput,
    modalTotalPrice,
    modalInputPrice,
    modalInputCount,
    modalSubmit,
    formModal,
  };
};
