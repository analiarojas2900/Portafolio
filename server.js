import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is not defined in the environment variables.');
    process.exit(1);
}

app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.get('/api/repos', async (req, res) => {
    try {
        console.log('Fetching GitHub repos...');
        const response = await fetch('https://api.github.com/users/analiarojas2900/repos?visibility=public', {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API response error:', errorText);
            throw new Error('Failed to fetch repos');
        }

        const data = await response.json();
        console.log('GitHub repos fetched successfully:', data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        res.status(500).json({ error: 'Failed to fetch repos' });
    }
});

app.get('/api/repos/:repoName/languages', async (req, res) => {
    const { repoName } = req.params;
    try {
        const response = await fetch(`https://api.github.com/repos/analiarojas2900/${repoName}/languages`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API response error:', errorText);
            throw new Error('Failed to fetch languages');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching GitHub languages:', error);
        res.status(500).json({ error: 'Failed to fetch languages' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});