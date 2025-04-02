/**
 * Класс Yandex
 * Используется для управления облаком.
 * */
class Yandex {

  static #HOST = 'https://cloud-api.yandex.net/v1/disk';
  static #LS_KEY = 'yandexToken';

  /**
   * Метод формирования и сохранения токена для Yandex API.
   * Получает токен из локального хранилища (`localStorage`).
   * Если токен отсутствует, запрашивает его у пользователя через prompt 
   * и сохраняет в `localStorage`.
   * 
   * @returns {string} Токен для доступа к API Яндекс.Диска.
   */
  static #getToken() {
    let token = StorageManager.getLocal(this.#LS_KEY);
    
    if (!token) {
      token = prompt('Введите ваш OAuth токен для Яндекс.Диска:');
      token 
        ? StorageManager.setLocal(this.#LS_KEY, token)
        : alert('Токен не был введен.');
    }

    return token;
  }

  /**
   * Метод загрузки файла в облако.
   * Выполняет POST-запрос для загрузки файла на Яндекс.Диск.
   * 
   * @param {string} path Использует путь (path) для указания файла, который нужно загрузить.
   * @param {string} url Использует URL (url) для указания ссылки на файл.
   * @param {function} callback Функция-обработчик, которая будет вызвана после загрузки файла.
   */
  static uploadFile(path, url, callback) {
    createRequest({
      method: 'POST',
      url: `${this.#HOST}/resources/upload`,
      headers: {
        'Authorization': `OAuth ${this.#getToken()}`,
      },
      data: {
        path: path,
        url: url,
      },
      callback: callback,
    });
  }

  /**
   * Метод удаления файла из облака.
   * Выполняет DELETE-запрос для удаления файла с Яндекс.Диска.
   * 
   * @param {string} path Использует путь (path) для указания файла, который нужно удалить.
   * @param {function} callback Функция-обработчик, которая будет вызвана после удаления файла.
   */
  static removeFile(path, callback) {
    createRequest({
      method: 'DELETE',
      url: `${this.#HOST}/resources`,
      headers: {
        'Authorization': `OAuth ${this.#getToken()}`,
      },
      data: {
        path: path,
      },
      callback: callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке.
   * Выполняет GET-запрос для получения списка всех загруженных файлов.
   * 
   * @param {function} callback Функция-обработчик, которая будет вызвана после 
   * получения списка файлов.
   */
  static getUploadedFiles(callback) {
    createRequest({
      method: 'GET',
      url: `${this.#HOST}/resources/last-uploaded`,
      headers: {
        'Authorization': `OAuth ${this.#getToken()}`,
      },
      data: {
        limit: 100,
        'media_type': 'image',        
      },
      callback: callback,
    });
  }

  /**
   * Метод скачивания файлов по URL.
   * Создает временную ссылку для скачивания файла по указанному URL.
   * Инициирует клик по ссылке для начала скачивания.
   * 
   * @param {string} url Использует URL (url) для указания ссылки на файл.
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a');

    link.href = url;
    link.download = url.split('/').pop();

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
