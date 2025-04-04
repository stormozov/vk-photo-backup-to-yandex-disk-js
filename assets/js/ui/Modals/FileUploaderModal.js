/**
 * Класс, отвечающий за модальное окно загрузки изображений.
 * @extends BaseModal - Наследуется от класса BaseModal
 */
class FileUploaderModal extends BaseModal {

  /**
   * @param {HTMLElement} contentOutput - Элемент, в котором выводится содержимое 
   * модального окна
   */
  constructor(contentOutput) {
    super(contentOutput);

    // Получаем DOM-элементы
    this.content = this.domElement.querySelector('.content');
    this.closeElements = [
      this.domElement.querySelector('.x.icon'),
      this.domElement.querySelector('.close.button'),
    ]
    this.useDatesButton = this.domElement.querySelector('.use-dates.button');
    this.sendAllButton = this.domElement.querySelector('.send-all.button');

    // Подписываемся на события
    this.registerEvents();
  }

  /**
   * Регистрирует обработчики событий
   */
  registerEvents() {
    this.closeHandler();
    this.sendAllHandler();
    this.#initializeDateHandler();
    this.delegateEventsHandler();
  }

  /**
   * Обработчик закрытия модального окна
   */
  closeHandler() {
    this.closeElements.forEach((element) => {
      element.addEventListener('click', () => this.close());
    });
  }

  /**
   * Обработчик отправки всех изображений
   */
  sendAllHandler() {
    this.sendAllButton.addEventListener('click', () => this.sendAllImages());
  }

  /**
   * Инициализация обработчика кнопки "Исп. даты для названий".
   * При нажатии заполняет все поля ввода названий файлов датой в формате "YYYY-MM-DD_HH-MM_N".
   */
  #initializeDateHandler() {
    this.useDatesButton.addEventListener('click', () => this.#applyDatesToInputs());
  }

  /**
   * Заполняет все поля ввода названий файлов датой в формате "YYYY-MM-DD_HH-MM_N".
   */
  #applyDatesToInputs() {
    const previewContainers = this.content.querySelectorAll('.image-preview-container');
    let counter = 1;

    previewContainers.forEach((container) => {
      const dateTimeString = this.#getFormattedDateTime();
      const paddedCounter = String(counter++).padStart(4, '0');
      container.querySelector('input').value = `${dateTimeString}_${paddedCounter}`;
    });
  }

  /**
   * Получает текущую дату и время в формате "YYYY-MM-DD_HH-MM".
   * @returns {string} Дата и время в формате "YYYY-MM-DD_HH-MM".
   */
  #getFormattedDateTime() {
    const date = new Date();
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}_${hour}-${minute}`;
  }

  /**
   * Обработчик делегирования событий
   */
  delegateEventsHandler() {
    this.content.addEventListener('click', (e) => {
      const target = e.target;

      // Обработка поля ввода
      if (target.closest('.input')) {
        target.closest('.input').classList.remove('error');
      }

      // Обработка кнопки отправки
      if (target.closest('.upload-button')) {
        const container = target.closest('.image-preview-container');
        this.sendImage(container);
      }
    });
  }

  /**
   * Отображает изображения в модальном окне
   * @param {Array} images - Массив объектов изображений
   */
  showImages(images) {
    this.content.innerHTML = images
      .reverse()
      .map((image) => this.getImageHTML(image))
      .join('');
  }

  /**
   * Возвращает HTML-код для отображения изображения
   * @param {Object} img - Объект изображения
   * @returns {string} HTML-код
   */
  getImageHTML(img) {
    return `
      <div class="image-preview-container">
        <img src="${img.currentSrc}">
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button upload-button">
            <i class="upload icon"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Отправляет все изображения на Яндекс.Диск
   */
  async sendAllImages() {
    const containers = this.content.querySelectorAll('.image-preview-container');

    const uploadPromises = [...containers].map((container) => this.#sendImage(container));

    try {
      await Promise.all(uploadPromises);
    } catch (err) {
      console.error('Ошибка при загрузке изображений:', err);
      alert('Некоторые изображения не были загружены.');
    }
  }

  /**
   * Отправляет выбранное изображение на Яндекс.Диск
   * @param {HTMLElement} container - Контейнер изображения
   */
  async #sendImage(container) {
    const input = container.querySelector('input');
    const inputBlock = container.querySelector('.input');
    const path = input.value.trim();

    if (!this.#validatePath(path, inputBlock)) return;
    this.#toggleInputBlock(inputBlock, true);

    const imageUrl = container.querySelector('img').src;

    try {
      const response = await this.#uploadFile(path, imageUrl);
      this.#handleUploadSuccess(container, response);
    } catch (err) {
      this.#handleUploadError(err, inputBlock);
    }
  }

  /**
   * Оборачивает вызов Yandex.uploadFile в промис.
   * 
   * @param {string} path - Путь к файлу.
   * @param {string} imageUrl - URL изображения.
   * 
   * @returns {Promise} - Промис, который разрешается с ответом или отклоняется с ошибкой.
   */
  #uploadFile(path, imageUrl) {
    return new Promise((resolve, reject) => {
      Yandex.uploadFile(path, imageUrl, (err, response) => {
        err ? reject(err) : resolve(response);
      });
    });
  }

  /**
 * Проверяет путь к файлу и добавляет класс ошибки, если путь некорректен.
 * 
 * @param {string} path - Путь к файлу.
 * @param {HTMLElement} inputBlock - Элемент блока ввода.
 * 
 * @returns {boolean} - Возвращает true, если путь корректен, иначе false.
 */
  #validatePath(path, inputBlock) {
    if (!path) {
      inputBlock.classList.add('error');
      return false;
    }
    return true;
  }

  /**
   * Включает или отключает блок ввода.
   * @param {HTMLElement} inputBlock - Элемент блока ввода.
   * @param {boolean} isDisabled - Флаг, указывающий, нужно ли отключить блок.
   */
  #toggleInputBlock(inputBlock, isDisabled) {
    inputBlock.classList.toggle('disabled', isDisabled);
  }

  /**
   * Обрабатывает ошибку загрузки.
   * @param {Error} err - Ошибка загрузки.
   * @param {HTMLElement} inputBlock - Элемент блока ввода.
   */
  #handleUploadError(err, inputBlock) {
    console.error('Ошибка во время отправки фотографий на Яндекс.Диск из модального окна:', err);
    this.#toggleInputBlock(inputBlock, false);
  }

  /**
   * Обрабатывает успешную загрузку.
   * @param {HTMLElement} container - Контейнер изображения.
   * @param {Object} response - Ответ от сервера.
   */
  #handleUploadSuccess(container, response) {
    console.log(
      new Date().toLocaleString(),
      '\nФотографии успешно отправлены на Яндекс.Диск из модального окна:\n',
      response
    );

    container.remove();

    // Проверка оставшихся изображений
    if (!this.content.querySelector('.image-preview-container')) {
      this.close();
      setTimeout(() => {
        alert('Все изображения успешно отправлены на Яндекс.Диске.');
      });
    }
  }
}
