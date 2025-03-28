/**
 * Основная функция для совершения запросов по Yandex API.
 */
const createRequest = (options = {}) => {
  const {
    method = 'GET',
    url,
    headers = {},
    data = {},
    callback
  } = options;

  // Создаем объект XMLHttpRequest
  const xhr = new XMLHttpRequest();

  // Формируем URL с параметрами, если метод GET и есть данные
  let requestUrl = Object.keys(data).length > 0
    ? `${url}?${new URLSearchParams(data).toString()}`
    : url;

  // Настраиваем запрос
  xhr.open(method, requestUrl);

  // Устанавливаем заголовки
  for (const [key, value] of Object.entries(headers)) {
    xhr.setRequestHeader(key, value);
  }

  // Устанавливаем тип ответа
  xhr.responseType = 'json';

  // Обработка успешного ответа
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      callback(
        new Error(
          `\n— Запрос завершился с ошибкой ${xhr.status}.\n` 
          + `— Текст ошибки: ${xhr.response.message}.\n` 
          + `— Описание: ${xhr.response.description}.\n` 
          + `— Ошибка: ${xhr.response.error}.`
        ), 
        null
      );
    }
  };

  // Обработка ошибок сети
  xhr.onerror = () => callback(new Error('Network error'), null);

  // Отправка запроса
  try {
    xhr.send();
  } catch (err) {
    callback(err, null);
  }
};
