import { type ReactNode } from 'react'
import { Headphones, Play } from 'lucide-react'
import cls from './AudioPlayback.module.scss'
interface AudioPlaybackProps { src: string, label: string, iconOnly?: boolean, children?: ReactNode }
export function AudioPlayback({ src, label, iconOnly = false, children }: AudioPlaybackProps) {
    const openRecording = () => {
        let url = src
        try { const parsed = new URL(src); parsed.pathname = parsed.pathname.replace(/%20/g, '+'); url = parsed.toString() } catch { /* Relative URL is already usable. */ }
        window.open(url, '_blank', 'popup,width=520,height=200,resizable=yes,noopener,noreferrer')
    }
    return <div className={iconOnly ? cls.compact : cls.player}>
        <button type="button" className={iconOnly ? cls.playButton : undefined} aria-label={label} title={label} onClick={openRecording}>
            {iconOnly ? <Play size={18} aria-hidden /> : <><Headphones size={16} aria-hidden />{label}</>}
        </button>
        {children && <div className={cls.context}>{children}</div>}
    </div>
}
