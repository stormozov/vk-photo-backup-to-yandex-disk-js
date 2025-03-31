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

  let requestUrl = url;
  if (Object.keys(data).length > 0) {
    if (data.path && method === 'POST') data.path = `backup_vk_${data.path}.jpg`;
    requestUrl += `?${new URLSearchParams(data).toString()}`;
  }

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
