import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState('');
  
  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching all blogs:', error);
    }
  };
  
  const fetchWeeklyBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/weekly');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching weekly blogs:', error);
    }
  };
  
  const fetchBlogByIdOrTitle = async () => {
    try {
      const encodedTitle = encodeURIComponent(input);
      const response = await axios.get(`http://localhost:3001/title?title=${encodedTitle}`);
      setBlogs([response.data]);
    } catch (error) {
      console.error('Error fetching blog by ID or title:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchAllBlogs}>Fetch All Blogs</button>
      <button onClick={fetchWeeklyBlogs}>Fetch Weekly Blogs</button>
      <input 
        type="text" 
        placeholder="Enter ID or Title" 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={fetchBlogByIdOrTitle}>Fetch Blog By ID or Title</button>

      <div>
        {blogs.map(blog => (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <div>{blog.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
