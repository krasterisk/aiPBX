import { Router } from 'express'
import mysql from 'mysql2/promise'

export const vpbxRouter = Router()

interface VpbxUserRow {
    balance: number
    debitingday: number | null
    blocked: number
    licnum: string | null
}

async function readVpbxUserFromMysql(uid?: string): Promise<VpbxUserRow | null> {
    const dsn = process.env.PBX_MYSQL_DSN?.trim()
    if (!dsn) {
        return null
    }

    const connection = await mysql.createConnection(dsn)
    try {
        const [rows] = await connection.query<mysql.RowDataPacket[]>(
            uid
                ? 'SELECT balance, debitingday, blocked, licnum FROM vpbx_users WHERE uid = ? LIMIT 1'
                : 'SELECT balance, debitingday, blocked, licnum FROM vpbx_users ORDER BY uid ASC LIMIT 1',
            uid ? [uid] : [],
        )
        const row = rows[0]
        if (!row) {
            return null
        }
        return {
            balance: Number(row.balance ?? 0),
            debitingday: row.debitingday != null ? Number(row.debitingday) : null,
            blocked: Number(row.blocked ?? 0),
            licnum: row.licnum != null ? String(row.licnum) : null,
        }
    } finally {
        await connection.end()
    }
}

function stubVpbxUser(): VpbxUserRow {
    return {
        balance: 0,
        debitingday: 15,
        blocked: 0,
        licnum: 'STUB-LIC',
    }
}

async function respondVpbxUser(res: import('express').Response, uid?: string): Promise<void> {
    try {
        const data = (await readVpbxUserFromMysql(uid)) ?? stubVpbxUser()
        res.json({
            ...data,
            stub: !(process.env.PBX_MYSQL_DSN?.trim()),
            blockedNote: data.blocked === 1
                ? 'blocked=1 blocks outbound; inbound still works'
                : undefined,
        })
    } catch (err) {
        res.status(500).json({
            error: 'Failed to read vpbx_users',
            message: err instanceof Error ? err.message : String(err),
        })
    }
}

/** Primary routes — used by HelpdeskPbxAgentService */
vpbxRouter.get('/api/vpbx-user', (req, res) => {
    void respondVpbxUser(res, req.query.uid as string | undefined)
})

vpbxRouter.get('/api/sip-registrations', (_req, res) => {
    res.json({
        stub: true,
        registrations: [],
        todo: 'Implement SIP registry read from Asterisk/DB',
    })
})

vpbxRouter.post('/api/promised-payment', promisedPaymentHandler)

/** Legacy / alternate paths from setup doc */
vpbxRouter.get('/vpbx/user/:uid', (req, res) => {
    void respondVpbxUser(res, req.params.uid)
})

vpbxRouter.post('/vpbx/promised-payment', promisedPaymentHandler)

function promisedPaymentHandler(req: import('express').Request, res: import('express').Response): void {
    const days = Number(req.body?.days ?? 2)
    const clamped = Math.min(5, Math.max(2, days))
    res.json({
        success: true,
        stub: true,
        days: clamped,
        message: 'TODO: write promised payment to billing DB',
    })
}
