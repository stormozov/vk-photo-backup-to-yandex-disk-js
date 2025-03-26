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
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
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
}
