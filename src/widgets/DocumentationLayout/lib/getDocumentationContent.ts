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
