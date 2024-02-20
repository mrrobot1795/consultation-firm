// pages/api/talkjs/createUser.js

import { createTalkjsUser } from '../../../lib/talkjsService';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const user = req.body;
            const talkjsUser = await createTalkjsUser(user);
            res.status(200).json(talkjsUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
