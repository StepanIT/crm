import {getSum} from './calculations.js';

export const createRow =
 ({id, title, category, units, count, price, images, discont}) => {
   const newTr = document.createElement('tr');

   newTr.classList.add('table__body-item');
   newTr.dataset.id = id;

   newTr.innerHTML = `
    <td class="table__body-item__ID">${id}</td>
    <td class="table__body-item__name">${title}</td>
    <td class="table__body-item__category">${category}</td>
    <td class="table__body-item__units">${units}</td>
    <td class="table__body-item__quantity">${count}</td>
    <td class="table__body-item__price">$${price}</td>
    <td class="table__body-item__total">
    $${getSum(price, count, discont)}</td>
    <td class="table__body-item-icons">
      <button class="table__body-item-icons__btn btn-image" data-pic="https://blog.100ct.by/wp-content/uploads/2023/02/1-7.webp"">
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
      <button class="table__body-item-icons__btn">
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

   return newTr;
 };