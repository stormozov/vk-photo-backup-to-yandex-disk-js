/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {

  /**
   * @param {HTMLElement} element - Семантический элемент
   */
  constructor(element) {
    // Сохраняем семантический элемент и DOM элемент
    this.semanticElement = element; // Предполагаем, что это семантический элемент
    this.domElement = element[0]; // Предполагаем, что DOM элемент находится на нулевой позиции
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    if (this.semanticElement) this.semanticElement.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    if (this.semanticElement) this.semanticElement.modal('hide');
  }
}
