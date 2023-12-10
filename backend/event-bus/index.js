import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 7000;

const app = express();

// middleware to parse incoming Request Object as a JSON Object
app.use(express.json());

// event bus echoes back every event it receives.
app.post('/events', (req, res) => {
	const event = req.body;

	axios.post('http://localhost:4000/events', event); // send the event to 'posts'
	axios.post('http://localhost:5000/events', event); // send the event to 'comments'
	axios.post('http://localhost:6000/events', event); // send the event to 'query'

	res.send({ status: 'OK' });
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
