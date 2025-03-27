/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {

  /**
   * @param {HTMLElement} imgViewerWrapper - DOM-элемент, в котором находится блок изображений
   */
  constructor(imgViewerWrapper) {
    // Получаем DOM-элементы
    this.imgListOutput = imgViewerWrapper.querySelector('.images-list .row');
    this.imgPreview = imgViewerWrapper.querySelector('.images-prev img');
    this.buttonSelectAll = imgViewerWrapper.querySelector('button.select-all');
    this.buttonSend = imgViewerWrapper.querySelector('button.send');

    // Подписываемся на события
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    // События на изображениях
    this.oneClickHandler();
    this.doubleClickHandler();

    // События на кнопках управления
    this.selectAllHandler();
  }

  /**
   * Обработчик клика по изображению.
   * При клике изображение меняет класс активности
   */
  oneClickHandler() {
    this.imgListOutput.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('selected');
        this.checkButtonText();
      }
    });
  }

  /**
   * Обработчик двойного клика по изображению.
   * При двойном клике изображение отображается в блоке предпросмотра
   */
  doubleClickHandler() {
    this.imgListOutput.addEventListener('dblclick', (e) => {
      if (e.target.tagName === 'IMG') this.imgPreview.src = e.target.src;
    });
  }

  selectAllHandler() {
    this.buttonSelectAll.addEventListener('click', () => {
      const images = this.imgListOutput.querySelectorAll('img');

      const hasSelected = [...images].some(img => img.classList.contains('selected'));

      if (hasSelected) {
        // Снимаем выделение со всех
        images.forEach(img => img.classList.remove('selected'));
      } else {
        // Выделяем все
        images.forEach(img => img.classList.add('selected'));
      }

      this.checkButtonText();
    });
  }

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
   * Контролирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const images = this.imgListOutput.querySelectorAll('img');
    const hasSelected = [...images].some(img => img.classList.contains('selected'));

    this.buttonSelectAll.textContent = hasSelected ? 'Снять выделение' : 'Выбрать всё';
    this.buttonSend.classList.toggle('disabled', !hasSelected);
  }
}