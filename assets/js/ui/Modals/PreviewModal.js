/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {

  constructor(element) {
    super(element);

    this.element = element;
    this.closeButton = this.domElement.querySelector('.x.icon');
    this.content = this.domElement.querySelector('.content');

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.closeModalHandler();
    this.deleteDownloadHandler()
  }

  /**
   * Обработчик закрытия модального окна
   */
  closeModalHandler() {
    this.closeButton.addEventListener('click', () => this.closeModal());
  }

  /**
   * Закрывает модальное окно и возвращает иконку загрузки
   */
  closeModal() {
    this.close();
    setTimeout(() => {
      this.content.innerHTML = `<i class="asterisk loading icon massive"></i>`;
    }, 500);
  }

  /**
   * Обработчик удаления и скачивания изображения
   */
  deleteDownloadHandler() {
    this.content.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        this.deleteSelectedImageHandler(e);
      }
    });
  }

  /**
   * Обработчик удаления выбранного изображения
   * @param {Event} e - Объект события клика
   */
  deleteSelectedImageHandler(e) {
    const container = e.target.closest('.image-preview-container');
    const path = container.querySelector('.ui.button.delete').dataset.path;

    Yandex.removeFile(path, (error) => {
      if (error) {
        console.error(
          new Date().toLocaleString(), 
          '\nТип операции: DELETE',
          '\nОшибка во время удаления фотографий из облака:', 
          error
        );
      } else {
        container.classList.add('deleted');
        setTimeout(() => {
          container.remove();

          if (this.content.children.length === 0) {
            this.closeModal();
          }

          console.log(
            new Date().toLocaleString(),
            '\nТип операции: DELETE',
            `\nВыбранная фотография (${path}) была успешно удалена с Яндекс.Диска`,
          );
        }, 500);
      }
    });
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна.
   * Если изображения отсутствуют, то отображается сообщение об этом.
   * 
   * @param {Array} data - Массив с данными изображений
   */
  showImages(data) {
    console.log(data)
    setTimeout(() => {
      if (data.length > 0) {
        this.content.innerHTML = data
          .reverse()
          .map((image) => this.getImageInfo(image))
          .join('');
      } else {
        this.content.innerHTML = 'Загруженные фотографии отсутствуют';
      }
    }, 500);
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00
   * @param {string} date - Дата в формате 2021-12-30T20:40:02+00:00
   * @returns {string} Форматированная дата в формате 30 декабря 2021 г. в 23:40
   * */
  formatDate(date) {
    return new Date(date).toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения 
   * и кнопок контроллеров (удаления и скачивания)
   * 
   * @param {Object} item - Объект изображения, данные которого необходимо отобразить
   * @returns {string} HTML разметка контейнера изображения с заполненными данными
   */
  getImageInfo(item) {
    console.log(item)
    return `
      <div class="image-preview-container">
        <img src='${item.sizes[0].url}' />
        <table class="ui celled table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Создано</th>
            <th>Размер</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${item.name}</td>
            <td>${this.formatDate(item.created)}</td>
            <td>${item.size} Кб</td>
          </tr>
        </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>
    `;
  }
}
