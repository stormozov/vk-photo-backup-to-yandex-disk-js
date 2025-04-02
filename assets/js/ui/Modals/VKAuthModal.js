/**
 * Класс для работы с модальным окном авторизации VK.
 */
class VKAuthModal {

  #COOKIE_LIFETIME_MS = 3_600_000;
  #VISIBILITY_CHECK_INTERVAL = 1000;

  #modal;
  #buttonContainer;

  /**
   * @param {string} modal - Селектор модального окна
   * @param {string} btnContainerSelector - Селектор контейнера кнопок
   */
  constructor(modal, btnContainerSelector) {
    this.#modal = document.querySelector(modal);
    this.#buttonContainer = document.querySelector(btnContainerSelector);
  }

  /**
   * Инициализирует показ или скрытие модального окна
   */
  init() {
    if (!this.#modal) return;

    const updateModalVisibility = () => {
      const hasToken = !!StorageManager.getCookie('vkid_token');
      this.#modal.classList.toggle('hidden', hasToken);
    };

    updateModalVisibility();
    setInterval(updateModalVisibility, this.#VISIBILITY_CHECK_INTERVAL);
    this.#renderVKAuthUI();
  }

  /**
 * Рендерит кнопки VK авторизации в модальном окне
 */
  #renderVKAuthUI() {
    if ('VKIDSDK' in window) {
      const VKID = window.VKIDSDK;
      this.#initVKIDConfig(VKID);
      this.#setupOneTapWidget(VKID);
    }
  }

  /**
   * Инициализирует конфиг VKID SDK
   * @param {Object} VKID - Референс SDK
   */
  #initVKIDConfig(VKID) {
    VKID.Config.init({
      app: 53300830,
      redirectUrl: 'http://localhost',
      responseMode: VKID.ConfigResponseMode.Callback,
      source: VKID.ConfigSource.LOWCODE,
      scope: 'photos offline',
    });
  }

  /**
   * Настраивает и рендерит OneTap виджет
   * @param {Object} VKID - Референс SDK
   */
  #setupOneTapWidget(VKID) {
    const oneTap = new VKID.OneTap();

    oneTap
      .render({
        container: this.#buttonContainer,
        showAlternativeLogin: true,
        oauthList: ['ok_ru', 'mail_ru']
      })
      .on(VKID.WidgetEvents.ERROR, (error) => this.#handleVKError(error))
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload) => {
          this.#handleVKLoginSuccess(payload, VKID);
      });
  }

  /**
   * Обрабатывает успешную авторизацию
   * @param {Object} payload - Данные авторизации
   * @param {Object} VKID - Референс SDK
   */
  #handleVKLoginSuccess(payload, VKID) {
    const { code, device_id: deviceID } = payload;

    VKID.Auth.exchangeCode(code, deviceID)
      .then((data) => this.#handleVKAuthSuccess(data))
      .catch((error) => this.#handleVKError(error));
  }

  /**
   * Обрабатывает успешный обмен кода на токен
   * @param {Object} data - Данные авторизации
   */
  #handleVKAuthSuccess(data) {
    StorageManager.setCookie('vkid_token', data.access_token, this.#COOKIE_LIFETIME_MS);
    window.location.reload();
  }

  /**
   * Обрабатывает ошибки VKID SDK
   * @param {Error} error - Объект ошибки
   */
  #handleVKError(error) {
    console.error('VK Auth error:', error);
  }
}
