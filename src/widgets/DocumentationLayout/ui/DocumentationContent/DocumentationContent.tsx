import { memo, useEffect, useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Skeleton } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { fetchDocumentationMarkdown } from '../../lib/getDocumentationContent'
import cls from './DocumentationContent.module.scss'

export const DocumentationContent = memo(() => {
    const [searchParams] = useSearchParams()
    const currentSection = searchParams.get('section') || 'getting-started'
    const [markdown, setMarkdown] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        fetchDocumentationMarkdown(currentSection).then((text) => {
            if (!cancelled) {
                setMarkdown(text)
                setLoading(false)

                // Scroll to anchor if present
                const hash = window.location.hash.slice(1)
                if (hash) {
                    setTimeout(() => {
                        const el = document.getElementById(hash)
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                    }, 150)
                } else {
                    // Scroll content area to top
                    const contentArea = document.querySelector(`.${cls.DocumentationContent}`)
                    contentArea?.parentElement?.scrollTo(0, 0)
                }
            }
        })

        return () => { cancelled = true }
    }, [currentSection])

    // Custom heading renderer: adds id for anchors
    const slugify = useCallback((text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\wа-яёА-ЯЁ\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }, [])

    const components = useMemo(() => ({
        h1: ({ children, ...props }: any) => {
            const text = String(children)
            return (
                <h1 id={slugify(text)} className={cls.h1} {...props}>
                    {children}
                </h1>
            )
        },
        h2: ({ children, ...props }: any) => {
            const text = String(children)
            return (
                <h2 id={slugify(text)} className={cls.h2} {...props}>
                    {children}
                </h2>
            )
        },
        h3: ({ children, ...props }: any) => {
            const text = String(children)
            return (
                <h3 id={slugify(text)} className={cls.h3} {...props}>
                    {children}
                </h3>
            )
        },
        h4: ({ children, ...props }: any) => {
            const text = String(children)
            return (
                <h4 id={slugify(text)} className={cls.h4} {...props}>
                    {children}
                </h4>
            )
        },
        p: ({ children, ...props }: any) => (
            <p className={cls.paragraph} {...props}>{children}</p>
        ),
        ul: ({ children, ...props }: any) => (
            <ul className={cls.list} {...props}>{children}</ul>
        ),
        ol: ({ children, ...props }: any) => (
            <ol className={cls.orderedList} {...props}>{children}</ol>
        ),
        li: ({ children, ...props }: any) => (
            <li className={cls.listItem} {...props}>{children}</li>
        ),
        table: ({ children, ...props }: any) => (
            <div className={cls.tableContainer}>
                <table className={cls.table} {...props}>{children}</table>
            </div>
        ),
        th: ({ children, ...props }: any) => (
            <th className={cls.th} {...props}>{children}</th>
        ),
        td: ({ children, ...props }: any) => (
            <td className={cls.td} {...props}>{children}</td>
        ),
        blockquote: ({ children, ...props }: any) => {
            // Detect special blockquotes
            const text = String(children?.props?.children || children || '')
            let variant = 'note'
            if (text.includes('Совет') || text.includes('Tip')) variant = 'tip'
            else if (text.includes('Внимание') || text.includes('Важно') || text.includes('Warning')) variant = 'warning'

            return (
                <blockquote className={`${cls.blockquote} ${cls[`blockquote_${variant}`]}`} {...props}>
                    {children}
                </blockquote>
            )
        },
        code: ({ className, children, node, ...props }: any) => {
            // In react-markdown, inline code has no className and its parent is not PRE
            const isBlock = !!className || (node?.position && String(children).includes('\n'))
            if (!isBlock) {
                return <code className={cls.inlineCode} {...props}>{children}</code>
            }
            const language = className?.replace('language-', '') || ''
            return (
                <div className={cls.codeBlock}>
                    <div className={cls.codeBlockHeader}>
                        <span className={cls.codeLanguage}>{language || 'text'}</span>
                        <button
                            className={cls.copyButton}
                            onClick={() => {
                                navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                            }}
                        >
                            Copy
                        </button>
                    </div>
                    <pre className={cls.codeContent}>
                        <code>{children}</code>
                    </pre>
                </div>
            )
        },
        pre: ({ children, ...props }: any) => (
            <>{children}</>
        ),
        hr: (props: any) => <hr className={cls.divider} {...props} />,
        a: ({ children, href, ...props }: any) => (
            <a
                className={cls.link}
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...props}
            >
                {children}
            </a>
        ),
        strong: ({ children, ...props }: any) => (
            <strong className={cls.bold} {...props}>{children}</strong>
        ),
        input: ({ checked, ...props }: any) => (
            <input type="checkbox" checked={checked} readOnly className={cls.checkbox} />
        ),
        img: ({ src, alt, ...props }: any) => (
            <img src={src} alt={alt} className={cls.image} {...props} />
        )
    }), [slugify])

    if (loading) {
        return (
            <Box className={cls.DocumentationContent}>
                <Box className={cls.skeletonContainer}>
                    <Skeleton variant="text" width="40%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                    <Skeleton variant="text" width="100%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mt: 3 }} />
                    <Skeleton variant="text" width="90%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
                    <Skeleton variant="text" width="95%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
                    <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mt: 3, borderRadius: 2 }} />
                    <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 4 }} />
                    <Skeleton variant="text" width="100%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.03)', mt: 2 }} />
                    <Skeleton variant="text" width="85%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
                </Box>
            </Box>
        )
    }

    return (
        <Box className={cls.DocumentationContent}>
            <article className={cls.article}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={components}
                >
                    {markdown}
                </ReactMarkdown>
            </article>
        </Box>
    )
})
