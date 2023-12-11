import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { randomBytes } from 'crypto';

const PORT = process.env.PORT || 4100;

const app = express();

// parse incoming Request Object as a JSON Object
app.use(express.json());

// enable CORS middleware
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	const postId = req.params.id; // 'postId' is the ':id' in the route '/posts/:id/comments'
	res.send(commentsByPostId[postId] || []); // return an empty array in case 'postId' does not exist.
});

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;

	const postId = req.params.id; // 'postId' is the ':id' in the route '/posts/:id/comments'
	const comments = commentsByPostId[postId] || []; // return an empty array in case 'postId' does not exist.
	comments.push({ id: commentId, content });
	commentsByPostId[req.params.id] = comments;

	// emit an event to event bus
	await axios.post('http://localhost:5000/events', {
		type: 'CommentCreated',
		data: { id: commentId, content, postId },
	});

	res.status(201).send(comments);
});

// handle incoming event updates by the service bus
app.post('/events', (req, res) => {
	const event = req.body;
	console.log('Event Received:', event.type); // log the event type

	res.send({ status: 'OK' }); // send an ack to the event bus
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
