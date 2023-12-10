import express from 'express';
import cors from 'cors';
import { randomBytes } from 'crypto';

const PORT = process.env.PORT || 4000;

const app = express();

// parse incoming Request Object as a JSON Object
app.use(express.json());

// enable CORS middleware
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/posts', (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;

	posts[id] = { id, title };

	res.status(201).send(posts[id]);
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
