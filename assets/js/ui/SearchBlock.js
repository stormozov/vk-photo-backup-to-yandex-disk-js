/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {

  /**
   * @param {HTMLElement} searchContainer - DOM-элемент, в котором находится строка ввода 
   * и кнопка поиска
   * @param {ImageViewer} imageViewer - экземпляр класса ImageViewer
   */
  constructor(searchContainer, imageViewer) {
    // Получаем DOM-элементы
    this.userInput = searchContainer.querySelector('input');
    this.addButton = searchContainer.querySelector('.add');

    // Сохраняем экземпляр ImageViewer
    this.imageViewer = imageViewer;

    // Подписываемся на события
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные 
   * ранее изображения
   */
  registerEvents() {
    this.addPhotoButtonHandler();
  }

  addPhotoButtonHandler() {
    this.addButton.addEventListener('click', () => {
      const query = this.userInput.value.trim();
      if (query) VK.get(query, (images) => this.imageViewer.drawImages(images));
    });
  }
}