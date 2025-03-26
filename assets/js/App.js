/**
 * Класс App управляет всем приложением
 * */
class App {

  /**
   * С вызова этого метода начинается работа всего приложения
   * Он производит первоначальную настройку блоков поиска и просмотра изображений,
   * а так же всплывающих окон.
   * */
  static init() {
    this.searchBlock = new SearchBlock(document.getElementsByClassName('search-block')[0]);
    this.imageViewer = new ImageViewer(document.getElementsByClassName('images-wrapper')[0]);
    
    this.initModals();
    this.initVKAuth();
  }

  /**
   * Инициализирует всплывающее окна
   * */
  static initModals() {
    this.modals = {
      fileUploader: new FileUploaderModal($('.ui.modal.file-uploader-modal').modal({closable: false})),
      filePreviewer: new PreviewModal($('.ui.modal.uploaded-previewer-modal').modal({closable: false})),
    }
  }

   /**
   * Возвращает всплывающее окно
   * Обращается к объекту App.modals и извлекает
   * из него свойство modalName:
   * App.getModal( 'login' ); // извлекает App.modals.login
   * */
  static getModal(name) {
    return this.modals[name];
  }

  /**
   * Инициализирует всплывающее окно авторизации
   */
  static initVKAuth() {
    const modal = document.querySelector('.vk-auth-modal');
    if (!modal) return;

    const updateModalVisibility = () => {
      const hasToken = this.getCookie('vkid_token');
      modal.classList.toggle('hidden', !!hasToken);
    };

    updateModalVisibility();
    setInterval(updateModalVisibility, 1000);
  }

  /**
   * Возвращает значение куки по ее названию.
   * @param {string} name Название куки
   * @returns {string|null} Значение куки или null, если куки не существует
   */
  static getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  }
}
