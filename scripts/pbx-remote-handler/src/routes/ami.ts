import { Router } from 'express'

export const amiRouter = Router()

amiRouter.post('/api/hangup-channel', hangupHandler)

/** Alternate path from setup doc */
amiRouter.post('/ami/hangup', hangupHandler)

function hangupHandler(req: import('express').Request, res: import('express').Response): void {
    const channelId = req.body?.channelId
    const confirm = req.body?.confirm === true

    if (!channelId || typeof channelId !== 'string') {
        res.status(400).json({ error: 'channelId is required' })
        return
    }

    if (!confirm) {
        res.status(400).json({ error: 'confirm=true is required for hangup' })
        return
    }

    res.json({
        success: true,
        stub: true,
        channelId,
        message: 'TODO: AMI hangup via AMI_HOST',
    })
}
