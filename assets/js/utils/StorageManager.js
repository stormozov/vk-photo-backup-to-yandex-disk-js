/**
 * Класс для работы с данными, которые хранятся в куках и localStorage
 */
class StorageManager {

  /**
   * Устанавливает куку.
   * 
   * @param {string} name Название куки
   * @param {string} value Значение куки
   * @param {number} expires Время жизни куки в миллисекундах. 
   * По умолчанию 24 часа (86 400 000 миллисекунд).
   */
  static setCookie(name, value, expires = 86_400_000) {
    const date = new Date();
    date.setTime(date.getTime() + expires);
    const expiresDate = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expiresDate + "; path=/";
  }

  /**
   * Возвращает значение куки по ее названию.
   * @param {string} name Название куки
   * @returns {string|null} Значение куки или null, если куки не существует
   */
  static getCookie(name) {
    if (!name) {
      console.warn('Метод StorageManager.getCookie() вызван без имени куки.');
      return undefined;
    }

    const escapedName = name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
    const regex = new RegExp('(?:^|; )' + escapedName + '=([^;]*)');

    const matches = document.cookie.match(regex);

    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  /**
   * Устанавливает значение в localStorage по ключу.
   * @param {string} key Ключ, по которому будет храниться значение
   * @param {string} value Значение, которое будет храниться по ключу
   */
  static setLocal(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Возвращает значение из localStorage по ключу.
   * @param {string} key Ключ, по которому храниться значение
   * @returns {string|null} Значение, которое храниться по ключу. 
   * Если ключ не найден, возвращает null
   */
  static getLocal(key) {
    return localStorage.getItem(key);
  }

  /**
   * Удаляет значение из localStorage по ключу.
   * @param {string} key Ключ, по которому храниться значение
   */
  static removeLocal(key) {
    localStorage.removeItem(key);
  }
}
