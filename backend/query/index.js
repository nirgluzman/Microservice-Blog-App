import express from 'express';
import axios from 'axios';
import cors from 'cors';

const PORT = process.env.PORT || 4200;

const app = express();

// parse incoming Request Object as a JSON Object
app.use(express.json());

// enable CORS middleware
app.use(cors());

// variable to hold all posts and their respective comments
const posts = {};

const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;
		posts[id] = { id, title, comments: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		post.comments.push({ id, content, status });
	}

	if (type === 'CommentUpdated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		const comment = post.comments.find(comment => comment.id === id);

		// update both the status and content
		comment.status = status;
		comment.content = content;
	}
};

app.get('/posts', (req, res) => {
	res.send(posts);
});

// handle incoming event updates from the event-bus
app.post('/events', (req, res) => {
	const { type, data } = req.body;
	console.log('Event Received:', type); // log the event type

	handleEvent(type, data);

	res.send({ status: 'OK' }); // send an ack to the event bus
});

app.listen(PORT, async () => {
	console.log(`listening on http://localhost:${PORT}`);

	try {
		// once the query service it up, it should fetch all historical events from event-bus and store this info in 'posts' variable
		console.log('Query service is up, fetching events...');
		const res = await axios.get('http://localhost:5000/events');

		for (let event of res.data) {
			console.log('Processing event:', event.type);
			handleEvent(event.type, event.data);
		}
	} catch (error) {
		// fail to fetch from event bus
		console.log(error.message);
	}
});
