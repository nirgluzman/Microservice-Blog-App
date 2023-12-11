import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 5000;

const app = express();

// middleware to parse incoming Request Object as a JSON Object
app.use(express.json());

// event bus echoes back every event it receives.
app.post('/events', async (req, res) => {
	const event = req.body;

	console.log('Event Received:', event.type); // log the event type

	await axios.post('http://localhost:4000/events', event); // send the event to 'posts'
	await axios.post('http://localhost:4100/events', event); // send the event to 'comments'
	await axios.post('http://localhost:4200/events', event); // send the event to 'query'

	res.send({ status: 'OK' });
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
