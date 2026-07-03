import type { Request, Response, NextFunction } from 'express'

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
    const expected = process.env.PBX_AGENT_API_KEY?.trim()
    if (!expected) {
        res.status(500).json({ error: 'PBX_AGENT_API_KEY is not configured' })
        return
    }

    const header = req.header('X-Api-Key') || req.header('x-api-key')
    if (!header || header !== expected) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    next()
}
