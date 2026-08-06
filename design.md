# Астерия — Design System

Документ фиксирует визуальный язык сайта юридического агентства Астерия. Источник правды в коде: `app/globals.css`, `app/layout.tsx`, `components/services/ui.tsx`.

---

## Принципы

1. **Editorial, не UI-kit.** Страница читается как журнал: крупные заголовки, hairline-разделители, асимметричные сетки. Не дашборд и не набор карточек с тенями.
2. **Контраст поверх декора.** Основной приём — смена плоскости (`ivory` / `cream` / `wine` / `ink`), а не glow, градиентные кнопки или скруглённые «пилюли».
3. **Одна работа у секции.** Eyebrow → заголовок → короткий lead (по необходимости) → контент. Без стат-полос и промо-стикеров в первом экране.
4. **Острые углы.** По умолчанию без `border-radius`. Исключения — кастомный курсор и scrollbar thumb.
5. **Русский текст — плотнее.** На service-страницах заголовки чуть компактнее, с `text-wrap: balance` / `pretty`.

---

## Цвета

Токены Tailwind / CSS (`@theme` в `globals.css`):

| Токен | Hex | Роль |
|-------|-----|------|
| `ink` | `#161310` | Основной текст, тёмные фоны, сильные границы |
| `ivory` | `#fbf8f1` | Базовый фон страницы, текст на wine/ink |
| `cream` | `#f5f1e8` | Чередование секций, панели, service-shell |
| `wine` | `#431c26` | Акцент, CTA, eyebrow, selection |
| `wine-deep` | `#2c1119` | Глубокие акцентные секции, hover у кнопок |

### Прозрачности (типичные)

| Использование | Класс |
|---------------|--------|
| Вторичный текст | `text-ink/70`, `text-ink/60`, `text-ink/55`, `text-ink/45` |
| Приглушённые лейблы | `text-ink/40`, `text-ink/35`, `text-ink/30` |
| Hairline на светлом | `border-ink/15`, `border-ink/12`, `border-ink/10` |
| Текст на тёмном | `text-ivory`, `text-ivory/85`, `text-ivory/70`, `text-ivory/55` |
| Hairline на тёмном | `border-ivory/20`, `border-ivory/15` |
| Eyebrow light | `text-ivory/55` |

### Selection

```css
::selection {
  background: wine;
  color: ivory;
}
```

---

## Типографика

**Шрифт:** Inter (Google Fonts), веса `400` / `500` / `600`, подмножества `cyrillic` + `latin`.  
CSS-переменная: `--font-inter`. Алиасы `--font-display`, `--font-hero`, `--font-sans`, `--font-mono` указывают на тот же Inter.

Курсив отключён глобально (`em`, `i`, `.italic` → `font-style: normal`).

### База body

- Размер: `1.0625rem` (17px)
- Line-height: `1.65`
- Letter-spacing: `-0.03em`
- Сглаживание: antialiased

### Шкала классов

| Класс | Назначение | Ключевые параметры |
|-------|------------|-------------------|
| `.type-hero-brand` / `.type-hero-title` | Герой главной | `clamp(48px → 92px)`, lh `1`, tracking `-0.06em`, w `400` |
| `.service-hero-title` | H1 на страницах услуг | `clamp(2.5rem → 5.25rem)`, lh `0.98`, tracking `-0.055em` |
| `.type-section-title` | H2 секций | `clamp(42px → 72px)`; на `.service-page` чуть плотнее |
| `.type-stat` / `.type-stat-step` | Крупные цифры / номера | `clamp(32px → 60px)`, tracking `-0.06em` |
| `.type-card-title` / `.type-service-title` | Заголовки пунктов | `clamp(1.1875rem → 1.5rem)`, w `500`, tracking `-0.035em` |
| `.type-feature-name` | Имена фич | `clamp(1.375rem → 1.75rem)`, w `500` |
| `.type-body` | Основной абзац | `1.0625rem` / lh `1.65` |
| `.type-body-sm` | Вторичный текст | `0.975rem` → `1rem` от `md` |
| `.type-body-lg` | Укрупнённый абзац | `1.125rem` / lh `1.7` |
| `.type-label` / `.eyebrow` | Лейблы секций, CTA-текст | `0.75rem`, uppercase, tracking `0.04em` |
| `.type-micro` | Футер / микрокопирайт | `0.6875rem` |
| `.type-nav-mobile` | Пункты мобильного меню | `clamp(1.5rem → 2rem)` |

### Утилиты шрифта

- `.font-display` — tracking `-0.06em`, weight `400`
- `.font-mono` — для лейблов/нумерации (визуально тот же Inter, tracking `-0.03em`)
- `.eyebrow` — uppercase mono-лейбл секции

### Длина строки

Ограничивайте заголовки через `max-w-[Nch]` (часто `10–16ch`). Абзацы — `max-w-[36ch]` … `max-w-[54ch]`.

---

## Сетка и отступы

### Контейнер

```html
<div class="container-x mx-auto max-w-[1440px]">
```

Горизонтальный padding `.container-x`:

| Breakpoint | Padding |
|------------|---------|
| default | `20px` |
| `sm` ≥640 | `32px` |
| `lg` ≥1024 | `48px` |
| `≥1440` | `72px` |

### Вертикальный ритм секций

Типичный паттерн: `py-16 sm:py-20 md:py-28` (на главной иногда `lg:py-32`).

Между заголовком и контентом: `mt-10` … `mt-16` (`md:mt-14` / `md:mt-16`).

### Breakpoints (ориентиры)

Используются стандартные Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Для service hero — доп. порог `479px`.

---

## Поверхности и секции

Чередование плоскостей задаёт ритм страницы:

| Фон | Когда |
|-----|--------|
| `bg-ivory` | База, светлые блоки |
| `bg-cream` | Соседняя светлая секция / service shell |
| `bg-wine` | Акцент: пакеты, CTA-финал, сравнение «за» |
| `bg-wine-deep` | Глубокий акцент (последствия, аудитория) |
| `bg-ink` | Тёмный editorial-блок (база знаний, процесс) |

### Декор сетки на тёмных секциях

Вертикальные линии:

```css
background-image: linear-gradient(
  to right,
  rgba(251, 248, 241, 0.035–0.04) 1px,
  transparent 1px
);
background-size: clamp(5rem, 9vw, 10rem) 100%;
opacity: ~0.3–0.4;
```

На светлых — аналог с `rgba(22, 19, 16, 0.04)`.

Опционально: `SectionConstellation` (точечное созвездие), `ContactSky` в финальных wine-блоках.

---

## Границы и разделители

- Сильные: `border-ink` (герой услуги, breadcrumb-зона)
- Рабочие: `border-ink/15`, `border-ink/12`
- Сетка «карточек» без радиуса: `gap-px` + `bg-ink/12` + ячейки `bg-ivory` / `bg-cream`
- На тёмном: `border-ivory/15`, `border-ivory/20`
- Акцентная врезка: `border-l` / `border-l-2 border-wine`

**Не использовать** по умолчанию: `rounded-*`, многослойные `shadow-*`, `rounded-full` на кнопках.

---

## Компоненты UI

### Section eyebrow

`SectionEyebrow` — `Star` (2.5×2.5) + uppercase текст.

- Светлый фон: `text-wine`
- Тёмный фон: `light` → `text-ivory/55`

### Primary CTA — MessengerButton

- Фон `bg-wine`, текст `text-ivory`, uppercase `.type-label` + `.font-mono`
- Высота ≥ `min-h-12`, padding `px-5` / `sm:px-6`
- Стрелка `Arrow` с `group-hover:translate-x-1`
- Инверсия на wine: `bg-ivory text-wine`
- Контур на wine: `border border-ivory/30 bg-transparent text-ivory`

База — `MagneticButton` (`inline-flex gap-3 group`).

### Text link

`TextLink` — uppercase label + Arrow.  
Светлый: `text-ink/45 hover:text-wine`. Тёмный: `light` → `text-ivory/70 hover:text-ivory`.

### Нумерация

`pad(index)` → `"01"`, `"02"`, …  
Крупно: `.type-stat` с низкой opacity (`text-ink/30`, `text-ivory/25`).  
Мелко: `.type-label.font-mono`.

### Breadcrumb услуг

`Услуги / {category} / {title}` — `.eyebrow`, `text-ink/40` … `text-ink/55`.

### Аккордеон

`AccordionPanel` — `grid-template-rows` 0fr→1fr, duration `500ms`, easing `cubic-bezier(0.22, 1, 0.36, 1)`.

### Маркеры списка

Квадрат `h-1.5 w-1.5 bg-wine`, не круги и не эмодзи.

### Ссылки с подчёркиванием

`.link-underline` — анимированная линия `0% → 100%` за `0.45s` с тем же easing.

### Обводка цифр

`.text-stroke-wine` / `.text-stroke-ivory` — transparent fill + 1px stroke.

---

## Паттерны секций (service pages)

1. **Hero** — border-y `border-ink`, 2 колонки: title+lead | side panel (бонус / промисы) + CTA.
2. **Pillars / advantages** — список с hairline `border-b`, сетка `[номер | title | text]`.
3. **Comparison** — split cream | wine, номера в рядах.
4. **Audience / matrix** — `gap-px` grid на тёмном или светлом.
5. **Packages** — wine-секция, featured-ячейка `bg-ivory text-ink`, остальные на wine.
6. **Tables / inclusions** — mono-шапка колонок, tabular-nums на `.service-page table`.
7. **Process** — тёмный фон, крупные номера, три колонки.
8. **FAQ** — sticky левая колонка с CTA + аккордеон справа.
9. **Finale** — `bg-wine` + ContactSky, dual CTA, текстовая ссылка на статью.
10. **Page footer bar** — название услуги + «Наверх ↑».

Анимации появления: `Reveal`, `RevealStagger` (`data-reveal-item`).

---

## Motion

| Параметр | Значение |
|----------|----------|
| Основной easing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Hover стрелки | `translate-x-1`, `duration-300` |
| Аккордеон | `500ms` |
| Marquee | `55s` linear infinite (отключается при `prefers-reduced-motion`) |
| Scroll | Lenis (`SmoothScroll`) |
| Курсор | Custom dot + ring на desktop (`hover: hover` + `pointer: fine`) |

При `prefers-reduced-motion: reduce` анимации и переходы схлопываются.

---

## Фокус и a11y

- Ссылки: `outline: 2px solid wine`, offset `3px`
- Формы / кнопки / contenteditable: кольца сняты глобально (кроме явных `focus-visible:ring-*` на CTA)
- Admin / public content inputs: тонкая `border-ink/12` при фокусе
- Интерактивные панели: `aria-expanded`, `inert` у закрытого аккордеона

---

## Иконография и бренд-маркеры

- **Star** — маркер eyebrow (не декоративный эмодзи)
- **Arrow** — CTA и текстовые ссылки
- Логотип «A» в шапке / футере
- Соцсети — монохромные SVG (`brightness-0`, на тёмном + `invert`)

---

## CMS / BlockNote

Редактор наследует палитру Астерии (`.asteria-blocknote`):

- Фон редактора `ivory`, акцент `wine` / `wine-deep`
- Радиус `--bn-border-radius: 2px` (единственное осознанное скругление в CMS)
- Заголовки редактора повторяют display-шкалу сайта

---

## Анти-паттерны

Не делать на публичных страницах:

- Фиолетовые / indigo градиенты, glow, glassmorphism
- Карточки с тенью и большим radius в hero
- Pill-кластеры, стат-полосы, floating badges поверх медиа
- Inter как «дефолтный AI-look» с кремовым + terracotta — у Астерии своя wine-палитра; кремовый фон допустим, но акцент только wine
- Плоский одноцветный лендинг без чередования плоскостей
- Новые цвета вне пяти токенов без обновления этого документа и `@theme`

---

## Чеклист новой секции

1. Фон из палитры; соседняя секция контрастирует.
2. `SectionEyebrow` + `.type-section-title.font-display` + опциональный `.type-body-sm`.
3. Контейнер `container-x mx-auto max-w-[1440px]`.
4. Разделители hairline, без radius/shadow.
5. Нумерация через `pad()`, CTA через `MessengerButton` / `TextLink`.
6. На тёмном — `SectionEyebrow light` и ivory-прозрачности.
7. Обернуть в `Reveal` / `RevealStagger`.
8. Проверить мобильный стек (одна колонка → grid от `md`/`lg`).
