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
  sendAllImages() {
    const containers = this.content.querySelectorAll('.image-preview-container');
    containers.forEach((container) => this.sendImage(container));
  }

  /**
   * Отправляет изображение на Яндекс.Диск
   * @param {HTMLElement} container - Контейнер изображения
   */
  sendImage(container) {
    const input = container.querySelector('input');
    const inputBlock = container.querySelector('.input');
    const path = input.value.trim();

    // Проверка пути к файлу на Яндекс.Диске
    if (!path) {
      inputBlock.classList.add('error');
      return;
    }

    // Блокировка поля
    inputBlock.classList.add('disabled');

    // Получение данных изображения
    const imageUrl = container.querySelector('img').src;

    // Отправка на Яндекс.Диск
    Yandex.uploadFile(path, imageUrl, (err, response) => {
      if (err) {
        console.error('Ошибка во время отправки фотографий на Яндекс.Диск из модального окна:', err);
        inputBlock.classList.remove('disabled');
      } else {
        console.log(
          new Date().toLocaleString(), 
          '\nФотографии успешно отправлены на Яндекс.Диск из модального окна:\n', 
          response
        );
        setTimeout(() => {
          container.remove()

          // Проверка оставшихся изображений
          if (!this.content.querySelector('.image-preview-container')) {
            this.close();
            setTimeout(() => {
              alert('Все изображения успешно отправлены на Яндекс.Диск.');
            }, 100)
          }
        }, 1000);
      }
    });
  }
}
