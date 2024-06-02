const axios = require('axios');
const fs = require('fs').promises;


const GHOST_BASE_URL = 'http://127.0.0.1:2368/ghost/api/content/posts';
const API_KEY = '38bc3abbba68c4c05a0e6d33fc';
const GHOST_API_URL = `${GHOST_BASE_URL}/?key=${API_KEY}`;

async function fetchContent() {
    try {
        const response = await axios.get(GHOST_API_URL);
        const content = response.data;
        await fs.writeFile('content.json', JSON.stringify(content, null, 2));
        console.log('Content retrieved and stored as content.json');
    } catch (error) {
        console.error('Error fetching or storing content:', error);
    }
}


fetchContent();

const express = require('express');
const moment = require('moment');
const cors = require('cors');
const blogsData = require('./content.json'); 
const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000'
}));


function getAllPublishedBlogs() {
    return blogsData.posts.filter(post => post.visibility === 'public');
}


function getPublishedBlogsLastWeek() {
    return blogsData.posts.filter(post => {
        const publishedAt = moment(post.published_at);
        return publishedAt.isAfter(moment().subtract(1, 'week'));
    });
}


function getBlogContent(idOrTitle) {
    return blogsData.posts.find(post => post.id === idOrTitle || post.title.toLowerCase() === idOrTitle.toLowerCase());
}


app.get('/blogs', (req, res) => {
    const publishedBlogs = getAllPublishedBlogs();
    console.log("All published blogs:");
    console.log(publishedBlogs);
    res.json(publishedBlogs);
});


app.get('/weekly', (req, res) => {
    const weeklyBlogs = getPublishedBlogsLastWeek();
    console.log("Published blogs last week:");
    console.log(weeklyBlogs);
    res.json(weeklyBlogs);
});


app.get('/title', (req, res) => {
    const { title } = req.query;
    const blogContent = getBlogContent(title);
    console.log("Blog content by Title:");
    console.log(blogContent);
    res.json(blogContent);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
