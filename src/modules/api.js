export const fetchGoods = async () => {
    try {
      const response = await fetch('https://amplified-watery-watch.glitch.me/api/goods/');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных: ' + response.statusText);
      }
      const data = await response.json();
      return data; // Убедитесь, что это массив
    } catch (error) {
      console.error('Ошибка:', error);
      return []; // Возвращаем пустой массив в случае ошибки
    }
  };