# Программа по резервному копированию фотографий (аватарок) из профиля пользователя VK в облачное хранилище Яндекс.Диск

Программа написана на JavaScript.

## То, что нужно для работы:

1. ID пользователя VK (Пользователь может ввести его на странице в инпуте).
2. Токен VK (Будет получен автоматически после авторизации VK ID в обязательном модальном окне).
3. Токен Яндекс.Диска. При отсутствии токена во время попытки загрузить выбранные фото на Яндекс.Диск, программа будет запрашивать его.


## Реализованный функционал

- **Получение изображений из социальной сети ВКонтакте**
    
    Возможно просматривать изображения из профиля любой открытой страницы.

- **Предпросмотр загружаемых изображений**

    Перед отправкой можно предварительно просмотреть каждое изображение.

- **Загрузка выбранных изображений**

    Загрузка реализована в отдельном модальном окне. Можно одним нажатием кнопки загрузить все фотографии сразу или загружать их по одной вручную.

- **Авто заполнение названий фото**

    Для каждой загружаемой фотографии необходимо написать название. Без указания названия фотографии, отправка на Диск не является возможной. В случае если название не имеет важной роли, либо загружаемых фотографий много, добавлена кнопка, которая автоматически сгенерирует название для каждого фото в формате «YYYY-MM-DD_HH-MM_N».

- **Просмотр загруженных изображений**

    Просмотр реализован в отдельном модальном окне. Можно получить информацию о фотографиях, включая само изображение, его название, дату создания и размер в килобайтах. Помимо этого есть возможность удалить или скачать выбранное изображение. Если необходимо удалить все загруженные фотографии, можно воспользоваться специальной кнопкой для этой цели.

- **Предпросмотр фотографии по двойному клику**

    После ввода индентификатора пользователя в строку поиска и получения фотографий, можно нажать на нужную фотографию двойным кликом. После этого фотография в большем разрешении будет показано справа в блоке предпросмотра.


## Линейный процесс взаимодействия пользователя с программой с ветвлениями 

```
graph TD
    A[Авторизация] --> B[Модальное окно ВК]
    B --> C{Форма заполнена?}
    C -->|Да| D[Доступ к программе]
    C -->|Нет| B

    D --> E[Ввод ID пользователя ВК]
    E --> F{Проверка профиля:}
    F -->|Открыт + фото доступны| G[Показать фотографии]
    F -->|Закрыт/нет фото| H[Ошибка]

    G --> I[Выбор фотографий]
    I --> J{Действия:}
    J -->|Одинарный клик| K[Выбрать фото]
    J -->|Двойной клик| L[Предпросмотр]
    J -->|Выбрать все| M[Выделить все фото]

    K --> N{Выбрано ≥1?}
    M --> N
    N -->|Да| O[Активация кнопки загрузки]
    N -->|Нет| I

    O --> P[Клик по загрузке]
    P --> Q[Модальное окно предпросмотра]
    Q --> R[Ввод названий/автогенерация]
    R --> S{Способ загрузки:}
    
    S -->|Все сразу| CheckToken1{Токен есть?}
    CheckToken1 -->|Да| T[Загрузить на Диск]
    CheckToken1 -->|Нет| GetToken1[Запросить токен через prompt]
    GetToken1 --> SaveToken1[Сохранить токен] --> T

    S -->|По отдельности| CheckToken2{Токен есть?}
    CheckToken2 -->|Да| U[Индивидуальная загрузка]
    CheckToken2 -->|Нет| GetToken2[Запросить токен через prompt]
    GetToken2 --> SaveToken2[Сохранить токен] --> U

    T --> V[Успешный alert]
    U --> V
    V --> W

    W --> X[Просмотр загруженных]
    X --> Y{Найдены фото?}
    Y -->|Да| Z[Список фотографий]
    Y -->|Нет| AA[Сообщение об отсутствии]

    Z --> AB[Управление фото]
    AB --> AC{Действия:}
    AC -->|Просмотр информации| AD[Показать метаданные]
    AC -->|Удалить/скачать| AE[Действие с файлом]
    AC -->|Множество фото| AF[Кнопка удалить все]
```


## Tech Stack

**Клиент:** Нативный JavaScript, jQuery v3.1.1, [semantic-ui](https://semantic-ui.com/)


## Документация по используемым сторонним API

### VK API

- [Работа с токенами в VK ID](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/tokens/about)

- [Авторизация по кнопке One Tap для Web](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/elements/onetap-button/onetap-web)

- [Создание и настройка приложения](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/create-application)

- [Как установить VK ID SDK для Web](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/start-integration/web/install)

- Метод [photos.get](https://dev.vk.com/ru/method/photos.get)

        Возвращает список фотографий в альбоме. В проекте используется индентификатор альбома "profile" для получения фотографий профиля.


### API Яндекс Диска

- [Полигон](https://yandex.ru/dev/disk/poligon) со всеми методами Диска.

- Метод [POST /v1/disk/resources/upload](https://dev.yandex.net/disk-polygon/?lang=ru&tld=ru#!/v147disk47resources/UploadExternalResource)

        Загружает файл в Диск по URL.

- Метод [GET /v1/disk/resources/last-uploaded](https://dev.yandex.net/disk-polygon/?lang=ru&tld=ru#!/v147disk47resources/GetLastUploadedFilesList)

        Получает упорядоченный по дате загрузки список файлов. Как альтернативу можно использовать метод `GET /v1/disk/resources/files`.

- Метод [DELETE /v1/disk/resources](https://dev.yandex.net/disk-polygon/?lang=ru&tld=ru#!/v147disk47resources/DeleteResource)

        Удаляет файл или папку.


## Что можно реализовать дополнительно

- Возможность выбора альбома.
- Подключение мгновенной авторизации Яндекса ([документация](https://yandex.ru/dev/id/doc/ru/suggest-connection)) вместо ручного ввода токена.
- Загрузку фотографий в отдельно созданную папку.
- Вывод информационных сообщений (например, закрытый профиль или удаленная страница) в кастомные всплывающие окна, реализованные на HTML и CSS. Сейчас используются alert.
- Проверку на работоспособность JavaScript и Cookie у пользователя. Без них программа и API не будут работать.


## Автор

- [@stormozov](https://github.com/stormozov)

