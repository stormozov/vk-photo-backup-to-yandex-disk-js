/**
 * Основная функция для совершения запросов по Yandex API.
 */
const createRequest = (options = {}) => {
  const ALLOWED_METHODS = ['GET', 'POST', 'DELETE'];

  const {
    method = 'GET',
    url,
    headers = {},
    data = {},
    callback
  } = options;

  if (ALLOWED_METHODS.indexOf(method.toUpperCase()) === -1) {
    throw new Error(`Используется неправильный метод для запроса к API Яндекс.Диска.
      Допустимые методы: ${ALLOWED_METHODS}.
      Метод, который вы пытаетесь использовать: ${method}.`
    );
  }

  const xhr = new XMLHttpRequest();

  let requestUrl = url;
  if (Object.keys(data).length > 0) {
    if (data.path && method === 'POST') data.path = `backup_vk_${data.path}.jpg`;
    requestUrl += `?${new URLSearchParams(data).toString()}`;
  }

  xhr.open(method, requestUrl);

  for (const [key, value] of Object.entries(headers)) {
    xhr.setRequestHeader(key, value);
  }

  xhr.responseType = 'json';

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

  xhr.onerror = () => callback(new Error('Network error'), null);

  try {
    xhr.send();
  } catch (err) {
    callback(err, null);
  }
};
