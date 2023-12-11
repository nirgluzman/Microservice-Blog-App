import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 5000;

const app = express();

// middleware to parse incoming Request Object as a JSON Object
app.use(express.json());

// event bus broadcasts every event it receives
app.post('/events', async (req, res) => {
	const event = req.body;
	console.log('Event Received:', event.type); // log the event type

	try {
		await axios.post('http://localhost:4000/events', event); // send the event to 'posts' service
		await axios.post('http://localhost:4100/events', event); // send the event to 'comments' service
		await axios.post('http://localhost:4200/events', event); // send the event to 'query' service
		await axios.post('http://localhost:5100/events', event); // send the event to 'moderation' service

		res.send({ status: 'OK' });
	} catch (error) {
		console.log('EventBus error', error.message);
	}
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
