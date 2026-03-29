# Aqbobek Lyceum Portal

Полноценный MVP школьного портала с локальным сервером, SQLite-хранилищем, ролевыми дашбордами и AI endpoint.

## Запуск

1. `cd c:\Users\Student.DESKTOP-63MBTI0\Downloads\akbobek`
2. `node server.js`
3. Открыть `http://localhost:3000`

или

1. `npm start`
2. Открыть `http://localhost:3000`

## AI API

1. Скопируйте `.env.example` в `.env`
2. Для Gemini вставьте `GEMINI_API_KEY`
3. При желании задайте `GEMINI_MODEL`
4. Либо используйте `OPENAI_API_KEY` и `AI_MODEL`

Приоритет такой:

- если задан `GEMINI_API_KEY`, портал использует Gemini
- если Gemini не задан, но есть `OPENAI_API_KEY`, используется OpenAI
- если ключей нет, AI-блок работает в fallback-режиме

## Что уже реализовано

- разные дашборды для `student`, `teacher`, `parent`, `admin`
- регистрация и вход для `student`, `teacher`, `parent`, `admin`
- хранение данных в SQLite базе `school.db`
- автоматическая миграция из `users.json` и `school-data.json`, если база ещё не создана
- честные пустые состояния без заранее подставленных оценок
- добавление оценок, посещаемости и достижений учителем
- добавление объявлений, событий и стенгазеты администратором
- AI endpoint `/api/ai-advice`
- поддержка Gemini через серверный endpoint
- kiosk mode для стенгазеты
