import express from 'express';
import { run } from '../src/index.js';

const app = express()
const host = 'localhost';
const port = 3000;

app.use('/', express.static('src-web/public'));

app.use(express.urlencoded({
	extended: true
}))

// vote?seriesId=71142482&vote=fuck
app.get('/vote', async (req, res) => { 
	const { seriesId, vote } = req.query;
	if (!seriesId | !vote) res.status(400).json({ message: "missing parameters - needed: seriesId, vote"})
	await run(seriesId, vote)
	.then((value) => res.send(value))
	.catch((reason) => res.send(reason))
})

function writeAction(res, req, seriesId, vote, count, max, data) {
	if (data.stack) data.stack = "*information censored for security reasons*"
	res.write((count > 0 ? ',' : '') + JSON.stringify(data), () => {
		count++;
		writeRun(res, req, seriesId, vote, count, max)		
	})
}

function writeRun(res, req, seriesId, vote, count, max) {
	if (count >= max) return res.end(']');
	req.on('close', () => count = max)
	run(seriesId, `${vote}.${count}`)
	.then((value) => writeAction(res, req, seriesId, vote, count, max, value))
	.catch((reason) => writeAction(res, req, seriesId, vote, count, max, reason))
}

app.post('/send', async (req, res) => {
	const { seriesId, vote, times } = req.body;
	res.write('[')
	writeRun(res, req, seriesId, vote, 0, times)
})

app.listen(port, host, () => {
	console.log(`Express started at http://${host}:${port}`)
})