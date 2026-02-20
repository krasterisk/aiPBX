import { memo, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Check } from '@/shared/ui/mui/Check'
import cls from './WidgetPreviewCard.module.scss'

interface WidgetPreviewCardProps {
    appearance: any
    className?: string
    name?: string
}

export const WidgetPreviewCard = memo(({ appearance, className, name }: WidgetPreviewCardProps) => {
    const { t } = useTranslation('publish-widgets')
    const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')

    const srcDocContent = useMemo(() => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                :root {
                    --bg-glass: ${previewTheme === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(30, 30, 30, 0.98)'};
                    --border-glass: ${previewTheme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.15)'};
                    --text-main: ${previewTheme === 'light' ? '#1e293b' : '#f1f5f9'};
                    --text-muted: ${previewTheme === 'light' ? '#64748b' : '#94a3b8'};
                    --primary-gradient: linear-gradient(135deg, #007AFF 0%, #007AFF 100%);
                    
                    /* Fixed Site Colors */
                    --site-bg: #f8fafc;
                    --site-text: #1e293b;
                    --site-text-muted: #64748b;
                }
                * { box-sizing: border-box; }
                body { 
                    margin: 0; 
                    padding: 0; 
                    width: 100%;
                    height: 500px;
                    font-family: 'Outfit', 'Inter', sans-serif;
                    background: var(--site-bg);
                    overflow: hidden;
                    position: relative;
                }
                .mock-site {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    width: 100%;
                    pointer-events: none;
                    opacity: 0.4;
                    z-index: 1;
                }
                .mock-site h2 { color: var(--site-text); margin: 0; font-size: 28px; }
                .mock-site p { color: var(--site-text-muted); margin: 5px 0 0; }
                
                .ai-widget-btn {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border-radius: 20px;
                    background: var(--primary-gradient);
                    border: none;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    z-index: 999;
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .ai-widget-btn svg { width: 36px; height: 36px; }

                .ai-widget-modal {
                    position: absolute;
                    width: 310px;
                    background: var(--bg-glass);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 28px;
                    border: 1px solid var(--border-glass);
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    z-index: 900;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    pointer-events: none;
                }
                .modal-header {
                    padding: 18px 24px;
                    border-bottom: 1px solid var(--border-glass);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .header-logo { width: 30px; height: 30px; }
                .modal-header h3 { margin: 0; font-size: 15px; color: var(--text-main); font-weight: 800; }
                
                .modal-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    min-height: 200px;
                }
                .visualizer {
                    width: 100%;
                    height: 90px;
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    font-size: 12px;
                    font-weight: 600;
                }
                .status-text { font-size: 16px; color: var(--text-main); font-weight: 800; margin: 0; }
                .status-subtext { font-size: 13px; color: var(--text-muted); margin-top: 5px; }
                
                .modal-footer { padding: 0 24px 24px; }
                .main-btn {
                    padding: 14px;
                    border-radius: 16px;
                    font-weight: 800;
                    font-size: 14px;
                    color: white;
                    background: var(--primary-gradient);
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="mock-site">
                <h2>${t('Сайт клиента')}</h2>
                <p>${t('Предпросмотр виджета')}</p>
            </div>
            
            <div id="btn" class="ai-widget-btn">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="white" stroke-width="6" stroke-opacity="0.3"/>
                    <circle cx="50" cy="50" r="12" fill="white"/>
                    <circle cx="50" cy="25" r="5" fill="white"/>
                    <circle cx="75" cy="50" r="5" fill="white"/>
                    <circle cx="50" cy="75" r="5" fill="white"/>
                    <circle cx="25" cy="50" r="5" fill="white"/>
                    <path d="M50 25 L75 50 L50 75 L25 50 Z" stroke="white" stroke-width="4" stroke-linejoin="round"/>
                </svg>
            </div>

            <div id="modal" class="ai-widget-modal">
                <div class="modal-header">
                    <div class="header-logo" id="logo-header"></div>
                    <h3 id="modal-title">aiPBX Assistant</h3>
                </div>
                <div class="modal-body">
                    <div class="visualizer" id="visualizer-text">VOICE VISUALIZER</div>
                    <div style="text-align: center">
                        <p class="status-text" id="status-text">Ready to talk</p>
                        <p class="status-subtext" id="status-subtext">Click to start AI agent</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="main-btn" id="footer-btn">Start Conversation</div>
                </div>
            </div>

            <script>
                const translations = {
                    en: {
                        title: 'aiPBX Assistant',
                        visualizer: 'VOICE VISUALIZER',
                        status: 'Ready to talk',
                        substatus: 'Click to start AI agent',
                        btn: 'Start Conversation'
                    },
                    ru: {
                        title: 'aiPBX Ассистент',
                        visualizer: 'ГОЛОСОВОЙ ВИЗУАЛИЗАТОР',
                        status: 'Готов к общению',
                        substatus: 'Нажмите, чтобы запустить ИИ',
                        btn: 'Начать разговор'
                    },
                    de: {
                        title: 'aiPBX Assistent',
                        visualizer: 'SPRACHVISUALISIERER',
                        status: 'Bereit zum Sprechen',
                        substatus: 'Klicken, um KI-Agent zu starten',
                        btn: 'Gespräch beginnen'
                    },
                    zh: {
                        title: 'aiPBX 助手',
                        visualizer: '语音可视化器',
                        status: '准备就绪',
                        substatus: '点击启动人工智能代理',
                        btn: '开始对话'
                    }
                };

                function updateStyles(appearanceData, widgetName) {
                    const config = appearanceData || {};
                    const btn = document.getElementById('btn');
                    const modal = document.getElementById('modal');
                    const logoHeader = document.getElementById('logo-header');
                    
                    const modalTitle = document.getElementById('modal-title');
                    const visualizerText = document.getElementById('visualizer-text');
                    const statusText = document.getElementById('status-text');
                    const statusSubtext = document.getElementById('status-subtext');
                    const footerBtn = document.getElementById('footer-btn');
                    
                    if (!btn || !modal) return;

                    const color1 = config.buttonColor || '#007AFF';
                    const color2 = config.primaryColor || '#007AFF';
                    const pos = config.buttonPosition || 'bottom-right';
                    const lang = config.language || 'en';
                    const showBranding = config.showBranding !== false;

                    // Update Texts
                    const t = translations[lang] || translations.en;
                    if (modalTitle) modalTitle.innerText = widgetName || t.title;
                    if (visualizerText) visualizerText.innerText = t.visualizer;
                    if (statusText) statusText.innerText = t.status;
                    if (statusSubtext) statusSubtext.innerText = t.substatus;
                    if (footerBtn) footerBtn.innerText = t.btn;

                    // Toggle Branding: Logic per user request
                    // "Title when check is selected should be taken from field Widget name"
                    // If showBranding is TRUE, we show logo and title (title uses widget name if provided, else default)
                    // If showBranding is FALSE, we hide them.
                    
                    if (logoHeader) logoHeader.style.display = showBranding ? 'block' : 'none';
                    if (modalTitle) modalTitle.style.display = showBranding ? 'block' : 'none';

                    btn.style.top = 'auto'; btn.style.bottom = 'auto'; btn.style.left = 'auto'; btn.style.right = 'auto';
                    modal.style.top = 'auto'; modal.style.bottom = 'auto'; modal.style.left = 'auto'; modal.style.right = 'auto';

                    const margin = '30px';
                    const modalOffset = '105px';
                    
                    if (pos.includes('top')) {
                        btn.style.top = margin;
                        modal.style.top = modalOffset;
                    } else {
                        btn.style.bottom = margin;
                        modal.style.bottom = modalOffset;
                    }

                    if (pos.includes('left')) {
                        btn.style.left = margin;
                        modal.style.left = margin;
                    } else {
                        btn.style.right = margin;
                        modal.style.right = margin;
                    }

                    document.documentElement.style.setProperty('--primary-gradient', 
                        \`linear-gradient(135deg, \${color1} 0%, \${color2} 100%)\`);
                        
                    if (config.logo) {
                        const logoSrc = config.logo.startsWith('http') ? config.logo : \`\${'${__STATIC__}'}/\${config.logo}\`;
                        logoHeader.innerHTML = \`<img src="\${logoSrc}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />\`;
                    } else {
                        logoHeader.innerHTML = \`
                            <svg viewBox="0 0 100 100" fill="none">
                                <circle cx="50" cy="50" r="45" fill="\${color1}" fill-opacity="0.15"/>
                                <circle cx="50" cy="50" r="15" fill="\${color1}"/>
                                <circle cx="50" cy="22" r="6" fill="\${color1}"/>
                                <circle cx="78" cy="50" r="6" fill="\${color1}"/>
                                <circle cx="50" cy="78" r="6" fill="\${color1}"/>
                                <circle cx="22" cy="50" r="6" fill="\${color1}"/>
                            </svg>
                        \`;
                    }
                }

                window.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'UPDATE_APPEARANCE') {
                        updateStyles(event.data.appearance, event.data.widgetName);
                    }
                });
                window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
            </script>
        </body>
        </html>
    `, [previewTheme, t])

    useEffect(() => {
        const iframe = document.getElementById('widget-preview') as HTMLIFrameElement
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'UPDATE_APPEARANCE',
                appearance,
                widgetName: name
            }, '*')
        }
    }, [appearance, srcDocContent, name])

    return (
        <Card padding="16" max border="partial" className={cls.WidgetPreviewCard}>
            <VStack gap="16" max>
                <HStack justify="between" max>
                    <Text title={t('Предпросмотр')} size="s" bold />
                    <HStack gap="8" align="center">
                        <Text text={t('Темная тема виджета')} size="s" />
                        <Check
                            checked={previewTheme === 'dark'}
                            onChange={(e) => { setPreviewTheme(e.target.checked ? 'dark' : 'light') }}
                        />
                    </HStack>
                </HStack>

                <div className={cls.container}>
                    <iframe
                        id="widget-preview"
                        title="Widget Preview"
                        className={cls.iframe}
                        srcDoc={srcDocContent}
                        onLoad={(e) => {
                            const iframe = e.currentTarget
                            if (iframe.contentWindow) {
                                iframe.contentWindow.postMessage({
                                    type: 'UPDATE_APPEARANCE',
                                    appearance,
                                    widgetName: name
                                }, '*')
                            }
                        }}
                    />
                </div>
            </VStack>
        </Card>
    )
})
