import express from 'express'
import { requireApiKey } from './middleware/auth.js'
import { healthRouter } from './routes/health.js'
import { vpbxRouter } from './routes/vpbx.js'
import { amiRouter } from './routes/ami.js'

const host = process.env.PBX_AGENT_HOST || '127.0.0.1'
const port = Number(process.env.PBX_AGENT_PORT || 3109)

const app = express()
app.use(express.json())

app.use(requireApiKey)
app.use(healthRouter)
app.use(vpbxRouter)
app.use(amiRouter)

app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
})

app.listen(port, host, () => {
    console.log(`pbx-remote-handler listening on http://${host}:${port}`)
    console.log('Auth: header X-Api-Key (see PBX_AGENT_API_KEY)')
})
