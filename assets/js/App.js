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
    this.imageViewer = new ImageViewer(document.getElementsByClassName('images-wrapper')[0]);
    this.searchBlock = new SearchBlock(document.getElementsByClassName('search-block')[0], this.imageViewer);
    
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
      vkAuth: new VKAuthModal('.vk-auth-modal', '.vk-auth-modal__buttons'),
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
    const modal = this.getModal('vkAuth');
    modal.init();
  }
}
