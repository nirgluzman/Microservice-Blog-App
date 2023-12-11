import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 5000;

const app = express();

// middleware to parse incoming Request Object as a JSON Object
app.use(express.json());

// service registered to event bus
const registeredServices = ['POSTS', 'COMMENTS', 'QUERY', 'MODERATION'];

// array to store all historical event transactions
const events = [];

// event bus broadcasts every event it receives
app.post('/events', async (req, res) => {
	const event = req.body;
	console.log('Event Received:', event.type); // log the event type

	events.push(event); // add the event to the events array

	// https://www.coreycleary.me/better-handling-of-rejections-using-promise-allsettled
	// Promise.all() will reject as soon as one of the functions passed in the array rejects.
	// Promise.allSettled() will never reject - instead it will wait for all functions passed in the array to either resolve or reject.
	const serviceStatus = await Promise.allSettled([
		axios.post('http://localhost:4000/events', event), // send the event to 'posts' service
		axios.post('http://localhost:4100/events', event), // send the event to 'comments' service
		axios.post('http://localhost:4200/events', event), // send the event to 'query' service
		axios.post('http://localhost:5100/events', event) // send the event to 'moderation' service
	]);

	// log the error message if any of the services fail to process the event
	serviceStatus.forEach((status, index) => {
		if (status.status === 'rejected') {
			console.log(`${registeredServices[index]} is down`);
		}
	});

	res.send({ status: 'OK' });
});

// fetch all historical events
app.get('/events', (req, res) => {
	res.send(events);
});

app.listen(PORT, () => console.log(`Event bus is up, listening on http://localhost:${PORT}`));
