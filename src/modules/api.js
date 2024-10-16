export const fetchGoods = async () => {
  try {
    const response = await fetch('https://amplified-watery-watch.glitch.me/api/goods/');
    if (!response.ok) {
      throw new Error('Ошибка при получении данных: ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
};

export const addProductToServer = async (newProduct) => {
  try {
    const response = await fetch('https://amplified-watery-watch.glitch.me/api/goods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Что-то пошло не так...');
    }

    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteProductFromServer = async (id) => {
  try {
    const response = await fetch(`https://amplified-watery-watch.glitch.me/api/goods/${id}`, {
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
