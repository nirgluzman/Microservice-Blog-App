import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 5100;

const app = express();

// middleware to parse incoming Request Object as a JSON Object
app.use(express.json());

// moderation service looks for 'CommentCreated' event
app.post('/events', async (req, res) => {
	const { type, data } = req.body;
	console.log('Event Received:', type); // log the event type

	if (type === 'CommentCreated') {
		// moderation = checking whether the comment contains the word 'orange'
		const status = data.content.includes('orange') ? 'rejected' : 'approved';

		// moderation delay
		await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));

		// once comment is moderated, the service sends an event back to the event bus
		await axios.post('http://localhost:5000/events', {
			type: 'CommentModerated',
			data: {
				id: data.id,
				content: data.content,
				postId: data.postId,
				status
			}
		});
	}

	res.send({ status: 'OK' });
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
