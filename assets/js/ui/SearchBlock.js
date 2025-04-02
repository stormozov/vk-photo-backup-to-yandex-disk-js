/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {

  #userInput;
  #addButton;
  #replaceButton;
  #displayedImages;
  #imageViewer;

  /**
   * @param {HTMLElement} searchContainer - DOM-элемент, в котором находится строка ввода 
   * и кнопка поиска
   * @param {ImageViewer} imageViewer - экземпляр класса ImageViewer
   */
  constructor(searchContainer, imageViewer) {
    // Получаем DOM-элементы
    this.#userInput = searchContainer.querySelector('input');
    this.#addButton = searchContainer.querySelector('.add');
    this.#replaceButton = searchContainer.querySelector('.replace');
    
    // Коллекция для хранения уникальных изображений
    this.#displayedImages = new Set();

    // Сохраняем экземпляр ImageViewer
    this.#imageViewer = imageViewer;

    // Подписываемся на события
    this.#registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные 
   * ранее изображения
   */
  #registerEvents() {
    this.#addPhotoButtonHandler();
    this.#replacePhotoButtonHandler();
  }

  /**
   * Добавляет обработчик клика по кнопке "Добавить"
   * При клике выполняет запрос на получение изображений
   */
  #addPhotoButtonHandler() {
    this.#addButton.addEventListener('click', () => {
      this.#handleUserInput(this.#addImages.bind(this));
    });
  }

  /**
   * Добавляет обработчик клика по кнопке "Заменить"
   * При клике выполняет запрос на получение изображений
   */
  #replacePhotoButtonHandler() {
    this.#replaceButton.addEventListener('click', () => {
      this.#handleUserInput(this.#replaceImages.bind(this));
    });
  }

  /**
   * Обрабатывает ввод пользователя
   * @param {Function} callback - функция обратного вызова
   */
  #handleUserInput(callback) {
    const query = this.#userInput.value.trim();
    if (query) {
      if (/^\d+$/.test(query)) {
        const userId = parseInt(query, 10);
        VK.get(userId, (images) => callback(images));
      } else {
        this.#userInput.value = '';
        alert('Идентификатор должен быть целым числом (например: 123456).');
      }
    }
  }

  /**
   * Добавляет новые уникальные изображения
   * @param {Array} images - массив изображений
   */
  #addImages(images) {
    const newImages = images.filter((image) => !this.#displayedImages.has(image.id));

    if (newImages.length > 0) {
      newImages.forEach((image) => this.#displayedImages.add(image.id));
      this.#imageViewer.drawImages(newImages);
    } else {
      alert('Нет новых изображений для отображения.');
    }
  }

  /**
   * Заменяет все изображения
   * @param {Array} images - массив изображений
   */
  #replaceImages(images) {
    this.#displayedImages.clear();
    this.#imageViewer.clear();
    images.forEach((image) => this.#displayedImages.add(image.id));
    this.#imageViewer.drawImages(images);
  }
}
