# Место — доска объявлений

Фронтенд на React и TypeScript для просмотра и публикации объявлений через API.

## Запуск локально

```bash
npm ci
npm run dev
```

Проверка TypeScript и production-сборка:

```bash
npm run build
```

## Публикация на GitHub Pages

Workflow `.github/workflows/deploy.yml` собирает проект и публикует его на GitHub Pages при каждом push в `main`. Сборка выполняется из TypeScript исходников Vite без Babel.

В настройках репозитория откройте **Settings → Pages** и выберите **GitHub Actions** в качестве источника публикации. После этого дождитесь завершения workflow **Build and deploy to GitHub Pages** во вкладке **Actions**. Vite автоматически использует имя репозитория для базового пути Pages.

## API

- `GET https://inai-col1.fishrungames.com/ads` — список объявлений.
- `POST https://inai-col1.fishrungames.com/ads` — публикация объявления в формате `multipart/form-data`.
