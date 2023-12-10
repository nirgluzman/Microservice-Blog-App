import PostCreate from './components/PostCreate.js';
import PostList from './components/PostList.js';

import './App.css';

export default function App() {
	return (
		<div className='container'>
			<h1>Create Post</h1>
			<PostCreate />
			<hr />
			<h1>Posts</h1>
			<PostList />
		</div>
	);
}
