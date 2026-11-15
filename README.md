# Pulse — групповой чат

Учебный проект: React + TypeScript + Vite, авторизация через готовый REST API и групповой чат через WebSocket.

## Требования

- Node.js LTS (рекомендуется Node.js 22)
- npm
- Visual Studio Code

## Запуск на компьютере

1. Распакуй архив.
2. Открой папку `group-chat` в Visual Studio Code.
3. Открой терминал: **Terminal → New Terminal**.
4. Выполни:

```powershell
npm install
npm run dev
```

5. Открой адрес, который появится в терминале, обычно `http://localhost:5173/`.

Если PowerShell блокирует `npm.ps1`, используй команды `npm.cmd install` и `npm.cmd run dev`.

## Как проверить

1. Зарегистрируй нового пользователя или войди под существующим.
2. После успешного входа приложение подключится к `wss://inai-col3.fishrungames.com/chat/`.
3. В статусе сверху должно появиться «В сети».
4. Открой сайт в другом браузере/окне и войди под другим пользователем, чтобы проверить групповой обмен сообщениями.

## API

- `POST https://inai-col3.fishrungames.com/api/register/`
- `POST https://inai-col3.fishrungames.com/api/login/`
- `POST https://inai-col3.fishrungames.com/api/logout/`
- `GET https://inai-col3.fishrungames.com/api/profile/`
- `POST https://inai-col3.fishrungames.com/api/token/refresh/`
- WebSocket: `wss://inai-col3.fishrungames.com/chat/`

Access token хранится в `sessionStorage` на время вкладки. Refresh token обрабатывается браузером как HttpOnly cookie и не читается JavaScript-кодом.

## Публикация на GitHub Pages

1. Создай на GitHub новый публичный репозиторий с именем `group-chat`.
2. Загрузи содержимое этой папки в корень репозитория (не саму папку целиком).
3. Убедись, что GitHub Actions включён: **Settings → Actions → General → Allow all actions**.
4. Открой **Settings → Pages** и выбери **Deploy from a branch** не нужно — публикацию выполняет workflow из `.github/workflows/deploy.yml`.
5. В **Settings → Pages → Build and deployment** выбери **GitHub Actions**, если такой выбор отображается.
6. Перейди во вкладку **Actions**, дождись успешного выполнения `Deploy to GitHub Pages`.
7. Адрес сайта будет `https://ТВОЙ-ЛОГИН.github.io/group-chat/`.

Vite автоматически подставляет имя репозитория при сборке через GitHub Actions.

## Важно про авторизацию и WebSocket

Для локального и опубликованного сайта backend должен разрешать CORS-запросы с origin приложения, а для login/refresh/logout — credentialed requests. Для HttpOnly refresh-cookie backend также должен выставлять подходящие `SameSite`/`Secure` атрибуты. Браузер не позволит frontend-коду обойти эти ограничения. Если API или WebSocket отклоняет origin, это нужно исправить на стороне backend.

Приложение отправляет `AUTH` сразу после открытия WebSocket и не разрешает отправку сообщений до `AUTH_SUCCESS`.
