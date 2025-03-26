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
    this.setLastCallback(callback.name);

    const params = {
      owner_id: id,
      album_id: 'profile',
      access_token: this.ACCESS_TOKEN,
      v: this.API_VERSION,
      callback: this.lastCallback
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
    if (result && result.response) {
      const data = result;
      console.log(data)
    } else {
      console.error(result.error);
      alert(result.error.error_msg);
    }

    this.removeScript(this.lastRequestUrl);
    this.lastRequestUrl = null;
  }

  /**
   * Сохраняет последнюю функцию обратного вызова в свойстве lastCallback
   */
  static setLastCallback(callback) {
    this.lastCallback = callback;
    window[callback] = this.processData.bind(this);
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
