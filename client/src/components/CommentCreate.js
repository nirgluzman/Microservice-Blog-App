import axios from 'axios';
import { useState } from 'react';

const CommentCreate = ({ postId }) => {
	const [content, setContent] = useState('');

	const handleSubmit = async event => {
		event.preventDefault();

		await axios.post(`http://localhost:5000/posts/${postId}/comments`, {
			content,
		});

		setContent('');
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label htmlFor='content'>New Comment</label>
					<input
						className='form-control'
						id='content'
						type='text'
						value={content}
						onChange={event => setContent(event.target.value)}
					/>
				</div>
				<button className='btn btn-primary' type='submit'>
					Submit
				</button>
			</form>
		</div>
	);
};

export default CommentCreate;
