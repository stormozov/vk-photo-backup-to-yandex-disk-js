/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {

  /**
   * @param {HTMLElement} imgViewerWrapper - DOM-элемент, в котором находится блок изображений
   */
  constructor(imgViewerWrapper) {
    this.imgListOutput = imgViewerWrapper.querySelector('.images-list .row');
    this.imgPreview = imgViewerWrapper.querySelector('.images-prev img');
    this.buttonSelectAll = imgViewerWrapper.querySelector('.select-all');
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {}

  /**
   * Очищает отрисованные изображения
   */
  clear() {}

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    console.log(images);
    if (images.length !== 0) {
      this.buttonSelectAll.classList.remove('disabled');
      images.forEach(image => {
        const imgWrapper = document.createElement('div');
        const img = document.createElement('img');

        imgWrapper.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
        img.src = image.url;

        imgWrapper.appendChild(img);
        this.imgListOutput.appendChild(imgWrapper);
      });
    } else {
      this.buttonSelectAll.classList.add('disabled');
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {}
}