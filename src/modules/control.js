import {getElements} from './elements.js';
import {getSum} from './calculations.js';
import {renderGoods, newTotalSum} from './render.js';

const elements = getElements();

export const goods = [
  {
    'id': 253842678,
    'title': 'Смартфон Xiaomi 11T 8/128GB',
    'price': 27000,
    'description': `Смартфон Xiaomi 11T
     – это представитель флагманской линейки,
      выпущенной во второй половине 2021 года.
       И он полностью соответствует такому позиционированию,
        предоставляя своим обладателям возможность пользоваться
         отличными камерами, ни в чем себя не ограничивать при запуске
          игр и других требовательных приложений.`,
    'category': 'mobile-phone',
    'discont': false,
    'count': 3,
    'units': 'шт',
    'images': {
      'small': 'img/smrtxiaomi11t-m.jpg',
      'big': 'img/smrtxiaomi11t-b.jpg',
    },
  },
  {
    'id': 296378448,
    'title': 'Радиоуправляемый автомобиль Cheetan',
    'price': 4000,
    'description': `Внедорожник на дистанционном управлении.
     Скорость 25км/ч. Возраст 7 - 14 лет`,
    'category': 'toys',
    'discont': 5,
    'count': 1,
    'units': 'шт',
    'images': {
      'small': 'img/cheetancar-m.jpg',
      'big': 'img/cheetancar-b.jpg',
    },
  },
  {
    'id': 215796548,
    'title': 'ТВ приставка MECOOL KI',
    'price': 12400,
    'description': `Всего лишь один шаг сделает ваш телевизор умным,
     Быстрый и умный MECOOL KI PRO, прекрасно спроектированный,
      сочетает в себе прочный процессор Cortex-A53 с чипом Amlogic S905D`,
    'category': 'tv-box',
    'discont': 15,
    'count': 4,
    'units': 'шт',
    'images': {
      'small': 'img/tvboxmecool-m.jpg',
      'big': 'img/tvboxmecool-b.jpg',
    },
  },
  {
    'id': 246258248,
    'title': 'Витая пара PROConnect 01-0043-3-25',
    'price': 22,
    'description': `Витая пара Proconnect 01-0043-3-25 является сетевым кабелем
     с 4 парами проводов типа UTP,
      в качестве проводника в которых используется алюминий,
       плакированный медью CCA. Такая неэкранированная витая пара
        с одножильными проводами диаметром 0.50 мм широко применяется
         в процессе сетевых монтажных работ. С ее помощью вы сможете обеспечить
          развертывание локальной сети в домашних условиях или на предприятии,
           объединить все необходимое вам оборудование в единую сеть.`,
    'category': 'cables',
    'discont': false,
    'count': 420,
    'units': 'v',
    'images': {
      'small': 'img/lan_proconnect43-3-25.jpg',
      'big': 'img/lan_proconnect43-3-25-b.jpg',
    },
  },
];

const addGoods = (item) => {
  goods.push(item);
};

const removeGoodsById = (id) => {
  const index = goods.findIndex((item) => item.id === id);
  if (index !== -1) {
    goods.splice(index, 1);
  }
};

const resetModalForm = () => {
  elements.modalForm.reset();
  elements.modaTotalPrice.value = '$0';
};

export const updateTotalPrice = () => {
  elements.modalForm.addEventListener('change', (e) => {
    const price = parseFloat(elements.modaInputPrice.value) || 0;
    const count = parseInt(elements.modaInputCount.value) || 0;
    const discont = parseFloat(elements.modaInputDiscount.value) || 0;
    elements.modaTotalPrice.value = `$${getSum(price, count, discont)}`;
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

export const productListener = (tbody, data) => {
  elements.modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProduct = {
      id: parseInt(Date.now().toString().slice(-9), 10),
      title: elements.modalForm.name.value,
      category: elements.modalForm.category.value,
      price: parseFloat(elements.modalForm.price.value),
      count: parseInt(elements.modalForm.count.value),
      units: elements.modalForm.units.value,
      discont: elements.modalCheckbox.checked ?
        parseFloat(elements.modalCheckboxInput.value) :
        false,
      images: {
        small: '',
        big: '',
      },
    };
    addGoods(newProduct);
    renderGoods(data, elements.tableBody);
    newTotalSum(elements.totalSumElement, data);
    elements.modalForm.reset();
    elements.modalDisplayFlex.style.display = 'none';
  });

  tbody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.btn-del')) {
      const row = target.closest('.table__body-item');
      const id = parseInt(row.dataset.id);
      removeGoodsById(id);
      renderGoods(data, tbody);
      newTotalSum(elements.totalSumElement, data);
    }
  });
};
