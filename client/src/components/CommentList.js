import axios from 'axios';
import { useState, useEffect } from 'react';

const CommentList = ({ postId }) => {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		const fetchComments = async () => {
			const res = await axios.get(`http://localhost:5000/posts/${postId}/comments`);
			setComments(res.data);
		};

		fetchComments();
	}, [postId]);

	const renderedComments = comments.map(comment => {
		return <li key={comment.id}>{comment.content}</li>;
	});

	return <ul>{renderedComments}</ul>;
};

export default CommentList;
