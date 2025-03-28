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
