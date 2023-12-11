import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 4200;

const app = express();

// parse incoming Request Object as a JSON Object
app.use(express.json());

// enable CORS middleware
app.use(cors());

// holds all posts and their respective comments
const posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

// handle incoming event updates by the service bus
app.post('/events', (req, res) => {
	const { type, data } = req.body;
	console.log('Event Received:', type); // log the event type

	if (type === 'PostCreated') {
		const { id, title } = data;
		posts[id] = { id, title, comments: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId } = data;
		const post = posts[postId];
		post.comments.push({ id, content });
	}

	console.log(posts);

	res.send({ status: 'OK' }); // send an ack to the event bus
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
