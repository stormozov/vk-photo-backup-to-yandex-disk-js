/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.userInput = this.element.querySelector('input');
    this.addButton = this.element.querySelector('.add');

    // Подписываемся на события
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    this.addPhotoButtonHandler();
  }

  addPhotoButtonHandler() {
    this.addButton.addEventListener('click', () => {
      const query = this.userInput.value.trim();
      if (query) VK.get(query, (images) => new ImageViewer().drawImages(images));
    });
  }
}