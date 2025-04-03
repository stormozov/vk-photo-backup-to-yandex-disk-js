document.addEventListener('DOMContentLoaded', () => {
  /**
   * Отображение уведомления о использовании cookies
   */
  const cookieNotice = () => {
    const LS_KEY = 'cookiesConfirmed';
    const EXPIRES_DAYS = 5;
    const notice = document.getElementById('cookieNotice');
    const confirmBtn = document.getElementById('confirmCookies');

    const setDisplayValue = (value) => notice.style.display = value;

    // Проверка срока действия
    const savedData = StorageManager.getLocal(LS_KEY);
    if (savedData) {
      setDisplayValue('none');
      const { expires } = JSON.parse(savedData);
      if (Date.now() < expires) return;
      StorageManager.removeLocal(LS_KEY);
    }

    // Проверка наличия куки. Если куки нет, то показываем уведомление
    if (!StorageManager.getLocal(LS_KEY)) setDisplayValue('block');

    confirmBtn.addEventListener('click', () => {
      const expirationDate = Date.now() + (EXPIRES_DAYS * 24 * 60 * 60 * 1000);

      StorageManager.setLocal(LS_KEY, JSON.stringify({
        accepted: true,
        expires: expirationDate
      }));

      setDisplayValue('none');
    });
  }

  cookieNotice();
});
