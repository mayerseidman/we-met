// pages/api/figmaComments.js
import axios from 'axios';

export default async function handler(req, res) {
    const fileKey = req.query.fileKey; // Assuming you pass the fileKey as a query parameter
    console.log("FILE KEY:", fileKey);
    const personalAccessToken = process.env.FIGMA_PERSONAL_ACCESS_TOKEN; // Use an environment variable for the token
    console.log("ACCESS TOKEN:", personalAccessToken)
    
    if (!fileKey) {
        return res.status(400).json({ error: 'File key is required' });
    }

    try {
        const response = await axios.get(`https://api.figma.com/v1/files/${fileKey}/comments`, {
            headers: {
                'X-Figma-Token': personalAccessToken
            }
        });
        return res.status(200).json(response.data);
        console.log(response);
    } catch (error) {
        console.error('Error fetching comments from Figma:', error);
        return res.status(500).json({ error: 'Failed to fetch comments from Figma' });
    }
}