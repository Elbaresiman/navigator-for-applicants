export const questions = [
  {
    id: 1,
    text: "Как вы предпочитаете решать проблемы?",
    category: "cognitive",
    subcategories: ["analytical", "critical"],
    answers: [
      { text: "Анализирую все данные и строю логическую цепочку", weight: 5 },
      { text: "Ищу нестандартный подход", weight: 4 },
      { text: "Советуюсь с другими и принимаю решение вместе", weight: 3 },
      { text: "Действую интуитивно", weight: 2 },
      { text: "Откладываю решение", weight: 1 }
    ]
  },
  {
    id: 2,
    text: "Какую задачу вы бы выбрали для проекта?",
    category: "cognitive",
    subcategories: ["analytical"],
    answers: [
      { text: "Разработка алгоритма сортировки данных", weight: 5 },
      { text: "Создание дизайна мобильного приложения", weight: 4 },
      { text: "Организация командной работы", weight: 3 },
      { text: "Написание документации", weight: 2 },
      { text: "Тестирование готового продукта", weight: 1 }
    ]
  },
  {
    id: 3,
    text: "Как вы реагируете на критику?",
    category: "social",
    subcategories: ["emotional", "critical"],
    answers: [
      { text: "Анализирую и использую для роста", weight: 5 },
      { text: "Спокойно принимаю", weight: 4 },
      { text: "Чувствую дискомфорт, но стараюсь понять", weight: 3 },
      { text: "Расстраиваюсь", weight: 2 },
      { text: "Игнорирую", weight: 1 }
    ]
  },
  {
    id: 4,
    text: "Как часто вы используете цифровые инструменты в учёбе?",
    category: "digital",
    subcategories: ["digital_lit"],
    answers: [
      { text: "Постоянно, не представляю учёбу без них", weight: 5 },
      { text: "Регулярно", weight: 4 },
      { text: "Иногда, когда необходимо", weight: 3 },
      { text: "Редко", weight: 2 },
      { text: "Предпочитаю традиционные методы", weight: 1 }
    ]
  },
  {
    id: 5,
    text: "Как вы ведёте себя в конфликтной ситуации?",
    category: "social",
    subcategories: ["team", "emotional"],
    answers: [
      { text: "Стараюсь найти компромисс", weight: 5 },
      { text: "Выслушиваю все стороны", weight: 4 },
      { text: "Стараюсь избежать конфликта", weight: 3 },
      { text: "Настаиваю на своём", weight: 2 },
      { text: "Ухожу от обсуждения", weight: 1 }
    ]
  },
  {
    id: 6,
    text: "Что вас больше всего привлекает в IT?",
    category: "cognitive",
    subcategories: ["analytical", "critical"],
    answers: [
      { text: "Возможность создавать новые продукты", weight: 5 },
      { text: "Анализ больших данных", weight: 4 },
      { text: "Командная разработка", weight: 3 },
      { text: "Дизайн интерфейсов", weight: 2 },
      { text: "Управление проектами", weight: 1 }
    ]
  },
  {
    id: 7,
    text: "Как вы относитесь к соблюдению цифрового этикета?",
    category: "digital",
    subcategories: ["digital_ethic"],
    answers: [
      { text: "Строго соблюдаю все правила", weight: 5 },
      { text: "Стараюсь следовать основным нормам", weight: 4 },
      { text: "Соблюдаю, когда это удобно", weight: 3 },
      { text: "Не всегда обращаю внимание", weight: 2 },
      { text: "Считаю это необязательным", weight: 1 }
    ]
  },
  {
    id: 8,
    text: "Как вы предпочитаете учиться?",
    category: "cognitive",
    subcategories: ["analytical", "critical"],
    answers: [
      { text: "Самостоятельно изучаю материалы и практикуюсь", weight: 5 },
      { text: "Смотрю видеоуроки и повторяю", weight: 4 },
      { text: "Учусь в группе с обсуждением", weight: 3 },
      { text: "Нужен наставник", weight: 2 },
      { text: "Предпочитаю готовые инструкции", weight: 1 }
    ]
  },
  {
    id: 9,
    text: "Как вы оцениваете свою способность работать в команде?",
    category: "social",
    subcategories: ["team"],
    answers: [
      { text: "Отлично, я часто беру на себя лидерство", weight: 5 },
      { text: "Хорошо, легко нахожу общий язык", weight: 4 },
      { text: "Средне, зависит от команды", weight: 3 },
      { text: "Ниже среднего, предпочитаю работать один", weight: 2 },
      { text: "Плохо, мне сложно взаимодействовать", weight: 1 }
    ]
  },
  {
    id: 10,
    text: "Как часто вы задумываетесь о безопасности данных?",
    category: "digital",
    subcategories: ["digital_ethic", "digital_lit"],
    answers: [
      { text: "Всегда, это мой приоритет", weight: 5 },
      { text: "Регулярно проверяю настройки", weight: 4 },
      { text: "Иногда вспоминаю об этом", weight: 3 },
      { text: "Редко", weight: 2 },
      { text: "Никогда не задумываюсь", weight: 1 }
    ]
  },
  {
    id: 11,
    text: "Как вы реагируете на сложные задачи?",
    category: "cognitive",
    subcategories: ["critical", "analytical"],
    answers: [
      { text: "Воспринимаю как вызов и разбираюсь", weight: 5 },
      { text: "Ищу информацию и решаю поэтапно", weight: 4 },
      { text: "Прошу помощи у других", weight: 3 },
      { text: "Откладываю на потом", weight: 2 },
      { text: "Сдаюсь", weight: 1 }
    ]
  },
  {
    id: 12,
    text: "Как вы относитесь к новым технологиям?",
    category: "digital",
    subcategories: ["digital_lit"],
    answers: [
      { text: "С энтузиазмом, сразу пробую", weight: 5 },
      { text: "Интересно, изучаю постепенно", weight: 4 },
      { text: "Осторожно, жду отзывов", weight: 3 },
      { text: "Нейтрально", weight: 2 },
      { text: "Скептически", weight: 1 }
    ]
  },
  {
    id: 13,
    text: "Как вы выражаете свои эмоции?",
    category: "social",
    subcategories: ["emotional"],
    answers: [
      { text: "Открыто и конструктивно", weight: 5 },
      { text: "Стараюсь контролировать", weight: 4 },
      { text: "Делюсь только с близкими", weight: 3 },
      { text: "Скрываю", weight: 2 },
      { text: "Мне сложно выражать эмоции", weight: 1 }
    ]
  },
  {
    id: 14,
    text: "Как вы планируете своё время?",
    category: "cognitive",
    subcategories: ["analytical"],
    answers: [
      { text: "Использую тайм-менеджмент и приоритеты", weight: 5 },
      { text: "Составляю список задач", weight: 4 },
      { text: "Планирую на день вперёд", weight: 3 },
      { text: "Действую по ситуации", weight: 2 },
      { text: "Не планирую", weight: 1 }
    ]
  },
  {
    id: 15,
    text: "Как вы относитесь к многозадачности?",
    category: "social",
    subcategories: ["team", "emotional"],
    answers: [
      { text: "Легко переключаюсь между задачами", weight: 5 },
      { text: "Могу, но предпочитаю фокус", weight: 4 },
      { text: "Средне, зависит от сложности", weight: 3 },
      { text: "Сложно, теряю концентрацию", weight: 2 },
      { text: "Предпочитаю одну задачу", weight: 1 }
    ]
  },
  {
    id: 16,
    text: "Как вы проверяете информацию из интернета?",
    category: "digital",
    subcategories: ["critical", "digital_lit"],
    answers: [
      { text: "Сравниваю несколько источников", weight: 5 },
      { text: "Проверяю авторитетность источника", weight: 4 },
      { text: "Читаю комментарии и отзывы", weight: 3 },
      { text: "Верю первому результату", weight: 2 },
      { text: "Не проверяю", weight: 1 }
    ]
  },
  {
    id: 17,
    text: "Как вы относитесь к обратной связи?",
    category: "social",
    subcategories: ["emotional", "team"],
    answers: [
      { text: "Ценю и активно использую", weight: 5 },
      { text: "Принимаю конструктивную критику", weight: 4 },
      { text: "Зависит от того, кто даёт", weight: 3 },
      { text: "Чувствую дискомфорт", weight: 2 },
      { text: "Игнорирую", weight: 1 }
    ]
  },
  {
    id: 18,
    text: "Какую IT-сферу вы считаете наиболее перспективной?",
    category: "cognitive",
    subcategories: ["analytical", "critical"],
    answers: [
      { text: "Искусственный интеллект и машинное обучение", weight: 5 },
      { text: "Кибербезопасность", weight: 4 },
      { text: "Веб-разработка и дизайн", weight: 3 },
      { text: "Аналитика данных", weight: 2 },
      { text: "Управление IT-проектами", weight: 1 }
    ]
  }
];

export const specialties = {
  "09.02.07": {
    name: "09.02.07 Информационные системы и программирование",
    level: "college",
    description: "Разработка и сопровождение информационных систем"
  },
  "09.02.11": {
    name: "09.02.11 Разработка и управление программным обеспечением",
    level: "college",
    description: "Защита информации и кибербезопасность"
  },
  "09.02.12": {
    name: "09.02.12 Компьютерные сети",
    level: "college",
    description: "Проектирование и администрирование сетей"
  },
  "09.03.03": {
    name: "09.03.03 Прикладная информатика",
    level: "bachelor",
    description: "Применение IT в различных сферах"
  },
  "38.03.05": {
    name: "38.03.05 Бизнес-информатика",
    level: "bachelor",
    description: "IT в бизнесе и управлении"
  }
};

export const socialLinks = [
  { name: "Сайт ИУБиП", url: "http://iubip.ru/", icon: "globe" },
  { name: "ВКонтакте ИУБиП", url: "https://vk.com/iubipmain", icon: "vk" },
  { name: "Telegram ИУБиП", url: "https://t.me/iubip91", icon: "telegram" },
  { name: "ВКонтакте Академии", url: "https://vk.com/digital_academy_iubip", icon: "vk" },
  { name: "Telegram Академии", url: "https://t.me/iubipacademy", icon: "telegram" }
];

export const subCompetencies = {
  analytical: "Аналитическое мышление",
  critical: "Критическое мышление",
  team: "Командное взаимодействие",
  digital_lit: "Цифровая грамотность",
  digital_ethic: "Цифровой этикет",
  emotional: "Эмоциональный интеллект"
};

export const maxScores = {
  cognitive: 30,
  social: 30,
  digital: 30,
  analytical: 15,
  critical: 15,
  team: 15,
  digital_lit: 15,
  digital_ethic: 10,
  emotional: 15
};
