---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Безкоштовний розрахунок конструкцій онлайн"
  tagline: Накресліть балку, раму чи ферму, прикладіть навантаження й спостерігайте, як епюри оновлюються під час редагування. Повноцінні результати МСЕ у вашому браузері — без встановлення, без облікового запису й без оплати.
  image:
    src: /screenshots/uk/hero.webp
    alt: Застосунок EduBeam із розрахованою рамою
  actions:
    - theme: brand
      text: Запустити застосунок
      link: https://run.edubeam.app/?lang=uk
    - theme: alt
      text: Читати посібник
      link: /uk/guide/introduction
    - theme: alt
      text: Переглянути приклади
      link: /uk/examples/

features:
  - icon: ⚡
    title: Результати під час креслення
    details: Кнопки «Розрахувати» немає. Перетягніть вузол, позначте шарнір або змініть навантаження — і N, V, M, реакції та деформована схема оновляться одразу.
    link: /uk/essentials/results
    linkText: Читання результатів
  - icon: 🧑‍🏫
    title: Створено для навчання
    details: Покрокові перші кроки, значення під курсором, розв'язувач, який пояснює, чому конструкція є механізмом, і посилання, які можна вставити в конспект лекцій.
    link: /uk/guide/teaching
    linkText: Навчання з EduBeam
  - icon: 🌍
    title: Ваша мова, ваші одиниці
    details: 12 мов інтерфейсу, одиниці SI або американські, а також вибір осей — z донизу або «підручникові» y вгору.
    link: /uk/essentials/units-settings
    linkText: Одиниці та налаштування
  - icon: 🔗
    title: Обмін, експорт, вбудовування
    details: Надішліть усю модель як посилання, збережіть її у файл, експортуйте креслення у PNG чи SVG, а таблиці результатів — у CSV.
    link: /uk/essentials/import-export
    linkText: Файли та обмін
---

## З чого почати {#start-here}

<div class="start-grid">

**Вперше в EduBeam?** Пройдіть [10-хвилинний швидкий старт](/uk/guide/quick-start). Ви крок за кроком змоделюєте просту балку на двох опорах і перевірите кожен результат вручну.

**Знаєте, що хочете побудувати?** Перейдіть до [покрокового прикладу](/uk/tutorials/three-hinged-frame) або відкрийте готовий [приклад](/uk/examples/) і змініть його.

**Викладаєте курс?** Див. [Навчання з EduBeam](/uk/guide/teaching): посилання для завдань, вбудовуваний переглядач для слайдів і вправи.

</div>

<div class="shots">

![Ферма: поздовжні сили, розтяг додатний](/screenshots/uk/tut-truss.webp)

![Механізм наочно: EduBeam показує, чому його неможливо розрахувати](/screenshots/uk/ui-mechanism.webp)

</div>

## Що можна змоделювати {#what-you-can-model}

- **Балки, рами та ферми** у площині: нерозрізні балки, портальні рами, тришарнірні арки, шарнірно-стрижневі ферми.
- **Будь-які опори**: шарнірно-нерухомі, шарнірно-рухомі, защемлення, ковзні защемлення, повернуті опори та осідання опор.
- **Навантаження**: зосереджені сили й моменти, рівномірні та трапецієподібні розподілені навантаження, зосереджені навантаження в будь-якому місці стрижня і температура.
- **Будь-які перерізи**: з бібліотеки (IPE, HEA, AISC W, HSS, прямокутники, труби) або накреслені як багатокутник, з автоматично обчисленими характеристиками.

Докладніше — у [Вступі](/uk/guide/introduction).

<ElementariumPromo />
<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Провідний розробник і дизайнер продукту',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Розв\'язувач МСЕ, автор первісного застосунку',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>
