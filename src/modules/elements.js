import {showModal} from './modal.js';

export const getElements = () => ({
  tableBody: document.querySelector('.table__body'),
  totalSumElement: document.querySelector('.cms__total-price'),
  btnOpenModal: document.querySelector('.panel__add-products'),

});
showModal();
export const getElementsShowModal = () => ({
  modalOverlay: document.querySelector('.overlay'),
  modaClose: document.querySelector('.modal__close'),
  modaInputPrice: document.querySelector('.modal__input_price'),
  modaInputDiscount: document.querySelector('.modal__input_discount'),
  modaInputCount: document.querySelector('.modal__input_count'),
  modaTotalPrice: document.querySelector('.modal__total-price'),
  modalCheckbox: document.querySelector('.modal__checkbox'),
  modalCheckboxInput: document.querySelector('.modal__input_discount'),
  modalForm: document.querySelector('.modal__form'),
  modalSubmit: document.querySelector('.modal__submit'),
  modalErrorMessage: document.querySelector('#errorMessage'),
});


