/**
 * Вспомогательный класс для работы с изображениями
 */
class ImageManager {

  /**
   * Проверяет, является ли ответ от API корректным
   * @param {Object} result Ответ от API, который нужно проверить
   * @returns {boolean} Является ли ответ корректным
   */
  static isValidResponse(result) {
    return result && result.response && Array.isArray(result.response.items);
  }

  /**
   * Получает массив самых больших изображений
   * @param {Array} images Массив изображений, которые нужно обработать
   * @returns {Array} Массив самых больших изображений
   */
  static getLargestImages(images) {
    return images.map(image => {
      const { url, width, height } = this.getLargestSize(image.sizes);
      return {
        id: image.id,
        url: url,
        width: width,
        height: height
      };
    });
  }

  /**
   * Находит самый большой размер изображения
   * @param {Array} sizes Массив размеров изображений
   * @returns {Object} Объект самого большого размера
   */
  static getLargestSize(sizes) {
    return sizes.reduce((prev, current) => {
      const prevArea = prev.width * prev.height;
      const currentArea = current.width * current.height;
      return currentArea > prevArea ? current : prev;
    });
  }
}
