/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static PATH = 'https://api.vk.com/method/';
  static ACCESS_TOKEN = StorageManager.getCookie('vkid_token');
  static API_VERSION = '5.199';
  static lastCallback;
  static lastRequestUrl;

  /**
   * Получает изображения
   * */
  static get(id = '', callback) {
    this.setLastCallback(callback);

    const params = {
      owner_id: id,
      album_id: 'profile',
      access_token: this.ACCESS_TOKEN,
      v: this.API_VERSION,
      callback: 'VK.processData'
    };

    const queryString = new URLSearchParams(params).toString();
    this.lastRequestUrl = `${this.PATH}photos.get?${queryString}`;
    this.createScript(this.lastRequestUrl);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    if (!ImageManager.isValidResponse(result)) {
      console.error('Некорректная структура данных:', result);
      if (result.error) {
        if (result.error.error_code === 1) {
          alert('Ошибка: произошла неизвестная ошибка. Попробуйте повторить запрос позже.')
        }

        if (result.error.error_code === 10) {
          alert('Ошибка: произошла внутренняя ошибка сервера. Попробуйте повторить запрос позже.')
        }

        if (result.error.error_code === 15 || result.error.error_code === 18) {
          alert('Ошибка: доступ запрещен, так как пользователь деактивирован. Это может произойти, если пользователь, чьи изображения вы пытаетесь получить по его идентификатору, был удалён или заблокирован.');
        }

        if (result.error.error_code === 30) {
          alert('Ошибка: профиль является приватным. Информация, запрашиваемая о профиле, недоступна.');
        }
      }
      return;
    }

    const largestImages = ImageManager.getLargestImages(result.response.items);
    this.lastCallback(largestImages);
    this.removeScript(this.lastRequestUrl);
    this.lastRequestUrl = null;
  }

  /**
   * Сохраняет последнюю функцию обратного вызова в свойстве lastCallback
   */
  static setLastCallback(callback) {
    this.lastCallback = callback;
  }

  /**
   * Добавляет скрипт в документ для отправки API запроса к VK
   */
  static createScript(url) {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }

  static removeScript(url) {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      if (script.src === url) {
        document.body.removeChild(script);
        break;
      }
    }
  }
}
