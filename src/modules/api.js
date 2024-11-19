import {updateTable} from './control.js';

const URL = 'https://amplified-watery-watch.glitch.me/api/goods/';

export const fetchGoods = async () => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error('Ошибка при получении данных: ' + response.statusText);
    }
    const data = await response.json();
    return data.goods;
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
};

export const showErrorModal = (message) => {
  const errorModal = document.getElementById('errorModal');
  const errorMessage = document.getElementById('errorMessage');

  errorMessage.textContent = message;
  errorModal.style.display = 'block';
  const closeErrorModal = document.getElementById('closeErrorModal');
  closeErrorModal.onclick = () => {
    errorModal.style.display = 'none';
  };
  window.onclick = (event) => {
    if (event.target === errorModal) {
      errorModal.style.display = 'none';
    }
  };
};

export const addProductToServer = async (newProduct) => {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || 'Что-то пошло не так...';
      showErrorModal(errorMessage);
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Error:', error);
    showErrorModal('Что-то пошло не так...');
    throw error;
  }
};

export const deleteProductFromServer = async (id) => {
  try {
    const response = await fetch(`${URL}${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Что-то пошло не так...');
    }

    return response.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchGoodsWithSearch = async (query) => {
  const url = `https://amplified-watery-watch.glitch.me/api/goods?search=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Ошибка при получении данных');
    }
    const data = await response.json();
    updateTable(data.goods);
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch('https://amplified-watery-watch.glitch.me/api/categories/');
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error);
    return [];
  }
};

export const populateDatalist = async () => {
  const categoryList = document.getElementById('category-list');

  if (!categoryList) {
    console.error('Элемент с ID "category-list" не найден.');
    return;
  }

  const categories = await fetchCategories();

  if (categories.length === 0) {
    console.warn('Категории не найдены.');
    return;
  }

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    categoryList.append(option);
  });
};
