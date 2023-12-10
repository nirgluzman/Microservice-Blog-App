import axios from 'axios';
import { useState } from 'react';

const PostCreate = () => {
	const [title, setTitle] = useState('');

	const handleSubmit = async event => {
		event.preventDefault();

		await axios.post('http://localhost:4000/posts', { title });

		setTitle('');
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label htmlFor='title'>Title</label>
					<input
						className='form-control'
						id='title'
						type='text'
						value={title} // inital value
						onChange={event => setTitle(event.target.value)}
					/>
				</div>
				<button className='btn btn-primary' type='submit'>
					Submit
				</button>
			</form>
		</div>
	);
};

export default PostCreate;
