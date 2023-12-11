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
	comments.push({
		id: commentId,
		content,
		status: 'pending' // when a comment is created, it is in a 'pending' status (moderation is required).
	});
	commentsByPostId[req.params.id] = comments;

	// emit an event to event bus
	await axios.post('http://localhost:5000/events', {
		type: 'CommentCreated',
		data: { id: commentId, content, postId, status: 'pending' }
	});

	res.status(201).send(comments);
});

// handle incoming event updates by the service bus
app.post('/events', async (req, res) => {
	const { type, data } = req.body;
	console.log('Event Received:', type); // log the event type

	if (type === 'CommentModerated') {
		const { id, content, postId, status } = data;
		const comments = commentsByPostId[postId];
		const comment = comments.find(comment => comment.id === id);
		comment.status = status;

		// emit an event to event bus
		await axios.post('http://localhost:5000/events', {
			type: 'CommentUpdated',
			data: { id, content, postId, status }
		});
	}

	res.send({ status: 'OK' }); // send an ack to the event bus
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
