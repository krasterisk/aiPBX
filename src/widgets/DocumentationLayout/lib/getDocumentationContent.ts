export interface DocumentationSection {
    heading?: string
    subheading?: string
    content?: string
    list?: string[]
    steps?: string[]
    image?: string
    imageAlt?: string
    imageCaption?: string
    note?: string
    code?: string
    language?: string
    component?: string
    tip?: string
    warning?: string
    table?: { headers: string[]; rows: string[][] }
}

export interface DocumentationPage {
    title: string
    sections: DocumentationSection[]
}

export const getDocumentationContent = (sectionId: string, language: string): DocumentationPage => {
    // This function returns structured documentation content
    // Content keys will be translated via i18n

    switch (sectionId) {
        case 'getting-started':
            return {
                title: 'Getting Started',
                sections: [
                    {
                        content: 'getting-started-intro'
                    },
                    {
                        heading: 'getting-started-what-is-heading',
                        content: 'getting-started-what-is-content'
                    },
                    {
                        heading: 'getting-started-key-features-heading',
                        list: [
                            'getting-started-feature-1',
                            'getting-started-feature-2',
                            'getting-started-feature-3',
                            'getting-started-feature-4',
                            'getting-started-feature-5',
                            'getting-started-feature-6'
                        ]
                    },
                    {
                        heading: 'getting-started-quick-start-heading',
                        steps: [
                            'getting-started-step-1',
                            'getting-started-step-2',
                            'getting-started-step-3',
                            'getting-started-step-4',
                            'getting-started-step-5'
                        ]
                    }
                ]
            }

        case 'dashboard-overview':
            return {
                title: 'Dashboard Overview',
                sections: [
                    {
                        content: 'dashboard-overview-intro'
                    },
                    {
                        heading: 'dashboard-overview-metrics-heading',
                        list: [
                            'dashboard-overview-metric-1',
                            'dashboard-overview-metric-2',
                            'dashboard-overview-metric-3',
                            'dashboard-overview-metric-4'
                        ]
                    },
                    {
                        image: '/docs/screenshots/dashboard-placeholder.png',
                        imageAlt: 'Dashboard Screenshot',
                        imageCaption: 'dashboard-screenshot-caption'
                    }
                ]
            }

        case 'dashboard-metrics':
            return {
                title: 'Dashboard Metrics',
                sections: [
                    {
                        content: 'dashboard-metrics-intro'
                    },
                    {
                        subheading: 'dashboard-metrics-calls-heading',
                        content: 'dashboard-metrics-calls-content'
                    },
                    {
                        subheading: 'dashboard-metrics-duration-heading',
                        content: 'dashboard-metrics-duration-content'
                    },
                    {
                        subheading: 'dashboard-metrics-tokens-heading',
                        content: 'dashboard-metrics-tokens-content'
                    },
                    {
                        subheading: 'dashboard-metrics-cost-heading',
                        content: 'dashboard-metrics-cost-content'
                    }
                ]
            }

        case 'dashboard-navigation':
            return {
                title: 'Dashboard Navigation',
                sections: [
                    {
                        content: 'dashboard-navigation-intro'
                    },
                    {
                        list: [
                            'dashboard-navigation-item-1',
                            'dashboard-navigation-item-2',
                            'dashboard-navigation-item-3',
                            'dashboard-navigation-item-4',
                            'dashboard-navigation-item-5',
                            'dashboard-navigation-item-6'
                        ]
                    }
                ]
            }

        case 'assistants-create':
            return {
                title: 'Creating Your First Assistant',
                sections: [
                    {
                        content: 'assistants-create-intro'
                    },
                    {
                        heading: 'assistants-create-step-by-step-heading',
                        steps: [
                            'assistants-create-step-1',
                            'assistants-create-step-2',
                            'assistants-create-step-3',
                            'assistants-create-step-4',
                            'assistants-create-step-5',
                            'assistants-create-step-6'
                        ]
                    },
                    {
                        image: '/docs/screenshots/assistant-create-placeholder.png',
                        imageAlt: 'Create Assistant Dialog',
                        imageCaption: 'assistant-create-screenshot-caption'
                    },
                    {
                        note: 'assistants-create-note'
                    }
                ]
            }

        case 'assistants-config':
            return {
                title: 'Assistant Configuration',
                sections: [
                    {
                        content: 'assistants-config-intro'
                    },
                    {
                        heading: 'assistants-config-main-heading',
                        content: 'assistants-config-main-content',
                        list: [
                            'assistants-config-main-name',
                            'assistants-config-main-model',
                            'assistants-config-main-voice',
                            'assistants-config-main-comment'
                        ]
                    },
                    {
                        heading: 'assistants-config-prompts-heading',
                        content: 'assistants-config-prompts-content',
                        list: [
                            'assistants-config-prompts-welcome',
                            'assistants-config-prompts-system'
                        ]
                    },
                    {
                        heading: 'assistants-config-parameters-heading',
                        content: 'assistants-config-parameters-content'
                    },
                    {
                        heading: 'assistants-config-publication-heading',
                        content: 'assistants-config-publication-content'
                    }
                ]
            }

        case 'assistants-fields':
            return {
                title: 'Field Descriptions',
                sections: [
                    {
                        content: 'assistants-fields-intro'
                    },
                    {
                        heading: 'assistants-fields-main-heading',
                        table: {
                            headers: ['assistants-fields-th-field', 'assistants-fields-th-description', 'assistants-fields-th-example'],
                            rows: [
                                ['assistants-fields-name-field', 'assistants-fields-name-desc', 'assistants-fields-name-example'],
                                ['assistants-fields-model-field', 'assistants-fields-model-desc', 'assistants-fields-model-example'],
                                ['assistants-fields-voice-field', 'assistants-fields-voice-desc', 'assistants-fields-voice-example'],
                                ['assistants-fields-tools-field', 'assistants-fields-tools-desc', 'assistants-fields-tools-example'],
                                ['assistants-fields-analytics-field', 'assistants-fields-analytics-desc', 'assistants-fields-analytics-example'],
                                ['assistants-fields-comment-field', 'assistants-fields-comment-desc', 'assistants-fields-comment-example']
                            ]
                        }
                    },
                    {
                        heading: 'assistants-fields-prompt-heading',
                        table: {
                            headers: ['assistants-fields-th-field', 'assistants-fields-th-description', 'assistants-fields-th-example'],
                            rows: [
                                ['assistants-fields-instruction-field', 'assistants-fields-instruction-desc', 'assistants-fields-instruction-example'],
                                ['assistants-fields-generator-field', 'assistants-fields-generator-desc', 'assistants-fields-generator-example']
                            ]
                        }
                    },
                    {
                        heading: 'assistants-fields-params-heading',
                        table: {
                            headers: ['assistants-fields-th-field', 'assistants-fields-th-description', 'assistants-fields-th-example'],
                            rows: [
                                ['assistants-fields-temperature-field', 'assistants-fields-temperature-desc', 'assistants-fields-temperature-example'],
                                ['assistants-fields-vad-threshold-field', 'assistants-fields-vad-threshold-desc', 'assistants-fields-vad-threshold-example'],
                                ['assistants-fields-vad-prefix-field', 'assistants-fields-vad-prefix-desc', 'assistants-fields-vad-prefix-example'],
                                ['assistants-fields-vad-silence-field', 'assistants-fields-vad-silence-desc', 'assistants-fields-vad-silence-example'],
                                ['assistants-fields-idle-timeout-field', 'assistants-fields-idle-timeout-desc', 'assistants-fields-idle-timeout-example']
                            ]
                        }
                    },
                    {
                        heading: 'assistants-fields-advanced-heading',
                        content: 'assistants-fields-advanced-intro',
                        table: {
                            headers: ['assistants-fields-th-field', 'assistants-fields-th-description'],
                            rows: [
                                ['assistants-fields-max-tokens-field', 'assistants-fields-max-tokens-desc'],
                                ['assistants-fields-stt-model-field', 'assistants-fields-stt-model-desc'],
                                ['assistants-fields-stt-lang-field', 'assistants-fields-stt-lang-desc'],
                                ['assistants-fields-tts-model-field', 'assistants-fields-tts-model-desc'],
                                ['assistants-fields-tts-lang-field', 'assistants-fields-tts-lang-desc'],
                                ['assistants-fields-audio-format-field', 'assistants-fields-audio-format-desc'],
                                ['assistants-fields-noise-field', 'assistants-fields-noise-desc'],
                                ['assistants-fields-vad-type-field', 'assistants-fields-vad-type-desc'],
                                ['assistants-fields-semantic-eagerness-field', 'assistants-fields-semantic-eagerness-desc']
                            ]
                        },
                        warning: 'assistants-fields-advanced-warning'
                    }
                ]
            }

        case 'assistants-prompting':
            return {
                title: 'Prompting Guide',
                sections: [
                    {
                        content: 'assistants-prompting-intro'
                    },
                    {
                        heading: 'assistants-prompting-what-heading',
                        content: 'assistants-prompting-what-content'
                    },
                    {
                        heading: 'assistants-prompting-structure-heading',
                        content: 'assistants-prompting-structure-intro',
                        list: [
                            'assistants-prompting-structure-role',
                            'assistants-prompting-structure-context',
                            'assistants-prompting-structure-tasks',
                            'assistants-prompting-structure-constraints',
                            'assistants-prompting-structure-tone'
                        ]
                    },
                    {
                        heading: 'assistants-prompting-tips-heading',
                        list: [
                            'assistants-prompting-tip-1',
                            'assistants-prompting-tip-2',
                            'assistants-prompting-tip-3',
                            'assistants-prompting-tip-4',
                            'assistants-prompting-tip-5'
                        ],
                        tip: 'assistants-prompting-tips-advice'
                    },
                    {
                        heading: 'assistants-prompting-example1-heading',
                        subheading: 'assistants-prompting-example1-subtitle',
                        code: 'Ты — оператор сервисного центра по ремонту бытовой техники «ТехноМастер».\n\nТвоя задача:\n1. Приветствовать клиента и выяснить, какая техника вышла из строя.\n2. Уточнить марку и модель устройства.\n3. Узнать характер неисправности (не включается, шумит, протекает и т.д.).\n4. Предложить удобное время для визита мастера.\n5. Записать контактные данные клиента (имя, телефон, адрес).\n\nОграничения:\n- Не называй стоимость ремонта — скажи, что мастер определит на месте.\n- Если техника старше 15 лет, вежливо предложи рассмотреть покупку новой.\n- Работай только с бытовой техникой. На другие вопросы — \"Это не в моей компетенции\".\n\nТон: дружелюбный, профессиональный. Обращайся на \"вы\".',
                        language: 'text'
                    },
                    {
                        heading: 'assistants-prompting-example2-heading',
                        subheading: 'assistants-prompting-example2-subtitle',
                        code: 'Ты — оператор пиццерии «Пицца Белла». Принимаешь заказы по телефону.\n\nТвоя задача:\n1. Приветствовать клиента.\n2. Принять заказ: узнать какую пиццу, размер (25см / 30см / 35см), и количество.\n3. Предложить дополнительно: напитки, соусы, десерты.\n4. Уточнить способ получения: доставка или самовывоз.\n5. При доставке — узнать адрес, подъезд, этаж, домофон.\n6. Назвать итоговую сумму и время ожидания.\n\nМеню (используй функцию get_menu для получения актуального меню).\n\nОграничения:\n- Минимальная сумма заказа на доставку — 500 руб.\n- Радиус доставки — 5 км. Если адрес дальше, предложи самовывоз.\n- Время доставки: 40-60 минут.\n\nТон: весёлый, энергичный. Обращайся на \"ты\".',
                        language: 'text'
                    },
                    {
                        heading: 'assistants-prompting-example3-heading',
                        subheading: 'assistants-prompting-example3-subtitle',
                        code: 'Ты — администратор стоматологической клиники «Дентал Плюс».\n\nТвоя задача:\n1. Узнать, первичный это визит или повторный.\n2. Уточнить причину обращения (боль, профилактика, отбеливание и т.д.).\n3. Предложить свободные даты и время (используй функцию check_schedule).\n4. Записать пациента (используй функцию book_appointment).\n5. Напомнить о необходимости взять паспорт и полис ОМС.\n\nВажно:\n- Если пациент описывает острую боль — предложи ближайшее доступное время.\n- Не ставь диагнозы и не давай медицинских рекомендаций.\n- Если спрашивают о ценах — назови диапазон и уточни, что точную стоимость определит врач.\n\nТон: спокойный, заботливый, профессиональный.',
                        language: 'text'
                    },
                    {
                        heading: 'assistants-prompting-example4-heading',
                        subheading: 'assistants-prompting-example4-subtitle',
                        code: 'Ты — ресепшн-бот отеля «Grand Palace Hotel».\n\nТвоя задача:\n1. Приветствовать гостя и узнать цель звонка.\n2. Если бронирование — узнать даты заезда/выезда, количество гостей, тип номера.\n3. Проверить доступность (используй функцию check_availability).\n4. Озвучить стоимость за период и условия (завтрак включён, Wi-Fi бесплатный).\n5. Оформить бронирование (используй функцию create_booking).\n\nТипы номеров:\n- Стандарт (от 4500 руб/ночь)\n- Комфорт (от 6500 руб/ночь)\n- Люкс (от 12000 руб/ночь)\n\nОграничения:\n- Заезд с 14:00, выезд до 12:00. Ранний заезд/поздний выезд — за доп. плату.\n- Дети до 7 лет — бесплатно на существующем месте.\n- Отмена бронирования бесплатно за 48 часов.\n\nТон: элегантный, гостеприимный. Обращайся на \"Вы\" с большой буквы.',
                        language: 'text'
                    },
                    {
                        heading: 'assistants-prompting-example5-heading',
                        subheading: 'assistants-prompting-example5-subtitle',
                        code: 'Ты — специалист первой линии техподдержки SaaS-платформы «CloudBase».\n\nТвоя задача:\n1. Идентифицировать пользователя (запросить email аккаунта).\n2. Узнать суть проблемы.\n3. Попытаться решить типовые проблемы:\n   - Не могу войти → предложить сброс пароля (функция reset_password).\n   - Медленная работа → уточнить браузер, предложить очистить кеш.\n   - Ошибка при оплате → проверить статус платежа (функция check_payment).\n4. Если проблема нетиповая — создать тикет (функция create_ticket) и сообщить номер.\n\nОграничения:\n- Не имеешь доступа к паролям пользователей.\n- Не можешь отменять подписки — только переводить на отдел продаж.\n- Время ответа тикета: до 24 часов в будни.\n\nТон: терпеливый, технически грамотный. Избегай сложных терминов.',
                        language: 'text'
                    }
                ]
            }

        case 'assistants-models':
            return {
                title: 'Model Selection',
                sections: [
                    {
                        content: 'assistants-models-intro'
                    },
                    {
                        heading: 'assistants-models-available-heading',
                        content: 'assistants-models-available-content'
                    },
                    {
                        heading: 'assistants-models-choosing-heading',
                        list: [
                            'assistants-models-choose-1',
                            'assistants-models-choose-2',
                            'assistants-models-choose-3'
                        ]
                    }
                ]
            }

        case 'assistants-voices':
            return {
                title: 'Voice Options',
                sections: [
                    {
                        content: 'assistants-voices-intro'
                    },
                    {
                        heading: 'assistants-voices-selection-heading',
                        content: 'assistants-voices-selection-content'
                    },
                    {
                        heading: 'assistants-voices-languages-heading',
                        content: 'assistants-voices-languages-content'
                    }
                ]
            }

        case 'assistants-speech':
            return {
                title: 'Speech Settings',
                sections: [
                    {
                        content: 'assistants-speech-intro'
                    },
                    {
                        subheading: 'assistants-speech-recognition-heading',
                        content: 'assistants-speech-recognition-content',
                        list: [
                            'assistants-speech-recognition-model',
                            'assistants-speech-recognition-language'
                        ]
                    },
                    {
                        subheading: 'assistants-speech-synthesis-heading',
                        content: 'assistants-speech-synthesis-content'
                    },
                    {
                        subheading: 'assistants-speech-vad-heading',
                        content: 'assistants-speech-vad-content',
                        list: [
                            'assistants-speech-vad-threshold',
                            'assistants-speech-vad-silence',
                            'assistants-speech-vad-included',
                            'assistants-speech-vad-semantic'
                        ]
                    },
                    {
                        subheading: 'assistants-speech-audio-heading',
                        content: 'assistants-speech-audio-content'
                    }
                ]
            }

        case 'assistants-publish':
            return {
                title: 'Publishing Your Assistant',
                sections: [
                    {
                        content: 'assistants-publish-intro'
                    },
                    {
                        heading: 'assistants-publish-sip-heading',
                        content: 'assistants-publish-sip-content',
                        steps: [
                            'assistants-publish-sip-step-1',
                            'assistants-publish-sip-step-2',
                            'assistants-publish-sip-step-3',
                            'assistants-publish-sip-step-4'
                        ]
                    },
                    {
                        image: '/docs/screenshots/assistant-publish-sip-placeholder.png',
                        imageAlt: 'SIP Publication',
                        imageCaption: 'assistant-publish-sip-screenshot-caption'
                    },
                    {
                        heading: 'assistants-publish-webrtc-heading',
                        content: 'assistants-publish-webrtc-content',
                        note: 'assistants-publish-webrtc-note'
                    },
                    {
                        heading: 'assistants-publish-forwarding-heading',
                        content: 'assistants-publish-forwarding-content'
                    }
                ]
            }

        case 'tools-understanding':
            return {
                title: 'Understanding Tools',
                sections: [
                    {
                        content: 'tools-understanding-intro'
                    },
                    {
                        heading: 'tools-understanding-what-heading',
                        content: 'tools-understanding-what-content'
                    },
                    {
                        heading: 'tools-understanding-use-cases-heading',
                        list: [
                            'tools-understanding-use-case-1',
                            'tools-understanding-use-case-2',
                            'tools-understanding-use-case-3',
                            'tools-understanding-use-case-4',
                            'tools-understanding-use-case-5'
                        ]
                    }
                ]
            }

        case 'tools-create':
            return {
                title: 'Creating Tools',
                sections: [
                    {
                        content: 'tools-create-intro'
                    },
                    {
                        heading: 'tools-create-types-heading',
                        subheading: 'tools-create-function-heading',
                        content: 'tools-create-function-content'
                    },
                    {
                        subheading: 'tools-create-webhook-heading',
                        content: 'tools-create-webhook-content'
                    },
                    {
                        subheading: 'tools-create-mcp-heading',
                        content: 'tools-create-mcp-content'
                    },
                    {
                        heading: 'tools-create-steps-heading',
                        steps: [
                            'tools-create-step-1',
                            'tools-create-step-2',
                            'tools-create-step-3',
                            'tools-create-step-4',
                            'tools-create-step-5'
                        ]
                    },
                    {
                        image: '/docs/screenshots/tool-create-placeholder.png',
                        imageAlt: 'Create Tool Dialog',
                        imageCaption: 'tool-create-screenshot-caption'
                    }
                ]
            }

        case 'tools-config':
            return {
                title: 'Tool Configuration',
                sections: [
                    {
                        content: 'tools-config-intro'
                    },
                    {
                        heading: 'tools-config-basic-heading',
                        list: [
                            'tools-config-basic-name',
                            'tools-config-basic-description',
                            'tools-config-basic-type'
                        ]
                    },
                    {
                        heading: 'tools-config-parameters-heading',
                        content: 'tools-config-parameters-content',
                        steps: [
                            'tools-config-parameters-step-1',
                            'tools-config-parameters-step-2',
                            'tools-config-parameters-step-3',
                            'tools-config-parameters-step-4'
                        ]
                    },
                    {
                        note: 'tools-config-note'
                    }
                ]
            }

        case 'tools-fc-examples':
            return {
                title: 'Function Calling Examples',
                sections: [
                    {
                        content: 'tools-fc-examples-intro'
                    },
                    {
                        heading: 'tools-fc-examples-booking-heading',
                        content: 'tools-fc-examples-booking-desc',
                        code: `{
  "name": "book_appointment",
  "description": "Записывает клиента на приём. Вызывается после сбора всей необходимой информации.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "client_name": {
        "type": "string",
        "description": "ФИО клиента"
      },
      "phone": {
        "type": "string",
        "description": "Номер телефона клиента"
      },
      "date": {
        "type": "string",
        "description": "Дата приёма в формате YYYY-MM-DD"
      },
      "time": {
        "type": "string",
        "description": "Время приёма в формате HH:MM"
      },
      "service_type": {
        "type": "string",
        "description": "Тип услуги: осмотр, консультация, процедура"
      }
    },
    "required": ["client_name", "phone", "date", "time"]
  }
}`,
                        language: 'json'
                    },
                    {
                        heading: 'tools-fc-examples-order-heading',
                        content: 'tools-fc-examples-order-desc',
                        code: `{
  "name": "check_order_status",
  "description": "Проверяет статус заказа по его номеру. Используй, когда клиент спрашивает о своём заказе.",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "Номер заказа (например, ORD-12345)"
      }
    },
    "required": ["order_id"]
  }
}`,
                        language: 'json'
                    },
                    {
                        heading: 'tools-fc-examples-ticket-heading',
                        content: 'tools-fc-examples-ticket-desc',
                        code: `{
  "name": "create_ticket",
  "description": "Создаёт тикет в службе поддержки. Вызывай, если не можешь решить проблему самостоятельно.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "user_email": {
        "type": "string",
        "description": "Email пользователя для связи"
      },
      "subject": {
        "type": "string",
        "description": "Краткое описание проблемы"
      },
      "description": {
        "type": "string",
        "description": "Подробное описание проблемы"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high", "critical"],
        "description": "Приоритет тикета"
      }
    },
    "required": ["user_email", "subject", "description"]
  }
}`,
                        language: 'json'
                    },
                    {
                        tip: 'tools-fc-examples-tip'
                    }
                ]
            }

        case 'tools-builtin':
            return {
                title: 'Built-in Functions',
                sections: [
                    {
                        content: 'tools-builtin-intro'
                    },
                    {
                        heading: 'tools-builtin-hangup-heading',
                        content: 'tools-builtin-hangup-desc',
                        code: `// hangup_call — не требует параметров
// Ассистент вызывает эту функцию, когда диалог завершён
// Работает только при интеграции через Asterisk (SIP)

{
  "name": "hangup_call",
  "description": "Завершает текущий телефонный звонок"
}`,
                        language: 'json',
                        note: 'tools-builtin-hangup-note'
                    },
                    {
                        heading: 'tools-builtin-transfer-heading',
                        content: 'tools-builtin-transfer-desc',
                        code: `{
  "name": "transfer_call",
  "description": "Переводит звонок на другой номер или контекст",
  "parameters": {
    "type": "object",
    "properties": {
      "context": {
        "type": "string",
        "description": "Контекст диалплана Asterisk для перевода"
      },
      "extension": {
        "type": "string",
        "description": "Номер или extension для перевода звонка"
      }
    },
    "required": ["extension"]
  }
}`,
                        language: 'json',
                        tip: 'tools-builtin-transfer-tip'
                    },
                    {
                        warning: 'tools-builtin-warning'
                    }
                ]
            }

        case 'tools-auth':
            return {
                title: 'Authentication',
                sections: [
                    {
                        content: 'tools-auth-intro'
                    },
                    {
                        subheading: 'tools-auth-none-heading',
                        content: 'tools-auth-none-content'
                    },
                    {
                        subheading: 'tools-auth-bearer-heading',
                        content: 'tools-auth-bearer-content'
                    },
                    {
                        subheading: 'tools-auth-basic-heading',
                        content: 'tools-auth-basic-content'
                    }
                ]
            }

        case 'tools-mcp':
            return {
                title: 'MCP Servers',
                sections: [
                    {
                        content: 'tools-mcp-intro'
                    },
                    {
                        heading: 'tools-mcp-config-heading',
                        content: 'tools-mcp-config-content',
                        list: [
                            'tools-mcp-config-url',
                            'tools-mcp-config-method',
                            'tools-mcp-config-auth',
                            'tools-mcp-config-headers'
                        ]
                    }
                ]
            }

        case 'playground-testing':
            return {
                title: 'Testing Assistants',
                sections: [
                    {
                        content: 'playground-testing-intro'
                    },
                    {
                        heading: 'playground-testing-start-heading',
                        steps: [
                            'playground-testing-step-1',
                            'playground-testing-step-2',
                            'playground-testing-step-3',
                            'playground-testing-step-4',
                            'playground-testing-step-5'
                        ]
                    },
                    {
                        image: '/docs/screenshots/playground-placeholder.png',
                        imageAlt: 'Playground Interface',
                        imageCaption: 'playground-screenshot-caption'
                    },
                    {
                        note: 'playground-testing-note'
                    }
                ]
            }

        case 'playground-use-cases':
            return {
                title: 'Playground Use Cases',
                sections: [
                    {
                        content: 'playground-use-cases-intro'
                    },
                    {
                        list: [
                            'playground-use-case-1',
                            'playground-use-case-2',
                            'playground-use-case-3',
                            'playground-use-case-4'
                        ]
                    }
                ]
            }

        case 'reports-history':
            return {
                title: 'Call History',
                sections: [
                    {
                        content: 'reports-history-intro'
                    },
                    {
                        heading: 'reports-history-viewing-heading',
                        content: 'reports-history-viewing-content'
                    },
                    {
                        heading: 'reports-history-filters-heading',
                        list: [
                            'reports-history-filter-date',
                            'reports-history-filter-assistant',
                            'reports-history-filter-caller'
                        ]
                    },
                    {
                        heading: 'reports-history-details-heading',
                        content: 'reports-history-details-content'
                    },
                    {
                        image: '/docs/screenshots/reports-history-placeholder.png',
                        imageAlt: 'Call History',
                        imageCaption: 'reports-history-screenshot-caption'
                    }
                ]
            }

        case 'reports-metrics':
            return {
                title: 'Report Metrics',
                sections: [
                    {
                        content: 'reports-metrics-intro'
                    },
                    {
                        subheading: 'reports-metrics-calls-heading',
                        content: 'reports-metrics-calls-content'
                    },
                    {
                        subheading: 'reports-metrics-duration-heading',
                        content: 'reports-metrics-duration-content'
                    },
                    {
                        subheading: 'reports-metrics-tokens-heading',
                        content: 'reports-metrics-tokens-content'
                    },
                    {
                        subheading: 'reports-metrics-cost-heading',
                        content: 'reports-metrics-cost-content'
                    }
                ]
            }

        case 'reports-visualizations':
            return {
                title: 'Report Visualizations',
                sections: [
                    {
                        content: 'reports-visualizations-intro'
                    },
                    {
                        list: [
                            'reports-visualizations-activity',
                            'reports-visualizations-duration',
                            'reports-visualizations-expenses',
                            'reports-visualizations-tokens'
                        ]
                    }
                ]
            }

        case 'reports-export':
            return {
                title: 'Exporting Data',
                sections: [
                    {
                        content: 'reports-export-intro'
                    },
                    {
                        steps: [
                            'reports-export-step-1',
                            'reports-export-step-2',
                            'reports-export-step-3'
                        ]
                    }
                ]
            }

        case 'payments-balance':
            return {
                title: 'Balance Overview',
                sections: [
                    {
                        content: 'payments-balance-intro'
                    },
                    {
                        heading: 'payments-balance-current-heading',
                        content: 'payments-balance-current-content'
                    },
                    {
                        heading: 'payments-balance-usage-heading',
                        content: 'payments-balance-usage-content'
                    }
                ]
            }

        case 'payments-topup':
            return {
                title: 'Top Up Balance',
                sections: [
                    {
                        content: 'payments-topup-intro'
                    },
                    {
                        steps: [
                            'payments-topup-step-1',
                            'payments-topup-step-2',
                            'payments-topup-step-3',
                            'payments-topup-step-4'
                        ]
                    }
                ]
            }

        case 'payments-notifications':
            return {
                title: 'Notification Thresholds',
                sections: [
                    {
                        content: 'payments-notifications-intro'
                    },
                    {
                        steps: [
                            'payments-notifications-step-1',
                            'payments-notifications-step-2',
                            'payments-notifications-step-3'
                        ]
                    }
                ]
            }

        case 'payments-history':
            return {
                title: 'Payment History',
                sections: [
                    {
                        content: 'payments-history-intro'
                    },
                    {
                        heading: 'payments-history-viewing-heading',
                        content: 'payments-history-viewing-content'
                    },
                    {
                        heading: 'payments-history-export-heading',
                        content: 'payments-history-export-content'
                    }
                ]
            }

        case 'payments-organizations':
            return {
                title: 'Organizations',
                sections: [
                    {
                        content: 'payments-organizations-intro'
                    },
                    {
                        heading: 'payments-organizations-adding-heading',
                        steps: [
                            'payments-organizations-step-1',
                            'payments-organizations-step-2',
                            'payments-organizations-step-3'
                        ]
                    },
                    {
                        heading: 'payments-organizations-editing-heading',
                        content: 'payments-organizations-editing-content'
                    }
                ]
            }

        case 'publish-overview':
            return {
                title: 'Publish & Integration Overview',
                sections: [
                    {
                        content: 'publish-overview-intro'
                    },
                    {
                        heading: 'publish-overview-methods-heading',
                        list: [
                            'publish-overview-method-sips',
                            'publish-overview-method-widgets',
                            'publish-overview-method-pbxs'
                        ]
                    }
                ]
            }

        case 'publish-sips':
            return {
                title: 'SIPs (VoIP Integration)',
                sections: [
                    {
                        content: 'publish-sips-intro'
                    },
                    {
                        heading: 'publish-sips-setup-heading',
                        steps: [
                            'publish-sips-step-1',
                            'publish-sips-step-2',
                            'publish-sips-step-3',
                            'publish-sips-step-4'
                        ]
                    },
                    {
                        note: 'publish-sips-note'
                    }
                ]
            }

        case 'publish-widgets':
            return {
                title: 'Widgets (WebRTC Integration)',
                sections: [
                    {
                        content: 'publish-widgets-intro'
                    },
                    {
                        heading: 'publish-widgets-setup-heading',
                        steps: [
                            'publish-widgets-step-1',
                            'publish-widgets-step-2',
                            'publish-widgets-step-3',
                            'publish-widgets-step-4'
                        ]
                    }
                ]
            }

        case 'publish-pbxs':
            return {
                title: 'PBXs (Custom Servers)',
                sections: [
                    {
                        content: 'publish-pbxs-intro'
                    },
                    {
                        heading: 'publish-pbxs-fields-heading',
                        list: [
                            'publish-pbxs-field-wss',
                            'publish-pbxs-field-ari',
                            'publish-pbxs-field-context'
                        ]
                    }
                ]
            }

        case 'asterisk-config':
            return {
                title: 'Asterisk Configuration',
                sections: [
                    {
                        content: 'asterisk-config-intro'
                    },
                    {
                        heading: 'asterisk-config-ari-heading',
                        content: 'asterisk-config-ari-content',
                        code: `[general]
enabled = yes
pretty = yes

[username]
type = user
read_only = no
password = your_password
password_format = plain`,
                        language: 'ini'
                    },
                    {
                        heading: 'asterisk-config-http-heading',
                        content: 'asterisk-config-http-content',
                        code: `[general]
enabled = yes
bindaddr = 0.0.0.0
bindport = 8088
tlsenable = yes
tlsbindaddr = 0.0.0.0:8089
tlscertfile = /etc/asterisk/keys/asterisk.pem
tlsprivatekey = /etc/asterisk/keys/asterisk.pem`,
                        language: 'ini'
                    },
                    {
                        heading: 'asterisk-config-pjsip-heading',
                        content: 'asterisk-config-pjsip-content',
                        code: `[transport-wss]
type = transport
protocol = wss
bind = 0.0.0.0

[endpoint-name]
type = endpoint
context = from-external
disallow = all
allow = ulaw,alaw,opus
webrtc = yes
dtls_auto_self_generated = yes`,
                        language: 'ini'
                    },
                    {
                        heading: 'asterisk-config-dialplan-heading',
                        content: 'asterisk-config-dialplan-content',
                        code: `[assistant-in]
exten => 100,1,NoOp()
same => n,Set(__fname=/usr/records/assistants/\${UNIQUEID})
same => n,MixMonitor(\${fname}.wav)
same => n,Stasis(aiPBXBot,\${ASSISTANTID})
same => n,Hangup()`,
                        language: 'ini'
                    },
                    {
                        heading: 'asterisk-config-recordings-heading',
                        content: 'asterisk-config-recordings-content',
                        note: 'asterisk-config-recordings-note',
                        code: 'https://{{PBX_ADDRESS}}/records/{{ASSISTANTID}}/{{UNIQUEID}}.{{FORMAT}}',
                        language: 'text'
                    }
                ]
            }

        default:
            return {
                title: 'Getting Started',
                sections: [
                    {
                        content: 'getting-started-intro'
                    }
                ]
            }
    }
}
