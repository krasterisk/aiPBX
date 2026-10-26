import { useRef, useState, type ReactNode } from 'react'
import { Headphones, Play, Pause } from 'lucide-react'
import cls from './AudioPlayback.module.scss'
export function AudioPlayback({ src, label, iconOnly = false, children }: { src: string, label: string, iconOnly?: boolean, children?: ReactNode }) {
    const [open, setOpen] = useState(false)
    const [playing, setPlaying] = useState(false)
    const audio = useRef<HTMLAudioElement>(null)
    let url = src
    try { const parsed = new URL(src); parsed.pathname = parsed.pathname.replace(/%20/g, '+'); url = parsed.toString() } catch { /* Relative URL is already usable. */ }
    if (iconOnly) {
        return <div className={cls.compact}>
            <button type="button" className={cls.playButton} aria-label={label} title={label} aria-pressed={playing} onClick={() => {
                setOpen(true)
                if (audio.current?.paused) void audio.current.play().catch(() => { setPlaying(false) })
                else audio.current?.pause()
            }}>{playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}</button>
            {children && <div className={cls.context}>{children}</div>}
            <audio ref={audio} controls={open} hidden={!open} preload="none" src={url} aria-label={label} onPlay={() => { setPlaying(true) }} onPause={() => { setPlaying(false) }} onEnded={() => { setPlaying(false) }} />
        </div>
    }
    return <div className={cls.player}><button type="button" aria-expanded={open} onClick={() => { setOpen(value => !value) }}><Headphones size={16} aria-hidden />{label}</button>{open && <audio controls preload="none" src={url} aria-label={label} />}</div>
}
