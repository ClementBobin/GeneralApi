// File: /server/api/ul/[username].post.js

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto'; // For hashing the username

export default defineEventHandler(async (event) => {
    const username = event.context.params.username;

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Hash the username (Assuming SHA-256 hashing)
    const hashedUsername = crypto.createHash('sha256').update(username).digest('hex');

    // Get current Unix time for updating
    const currentUnixTime = Math.floor(Date.now() / 1000);

    // Update the user's last finished time and finished count
    const result = await sql`
        UPDATE users
        SET last_finished_at = ${currentUnixTime}, finished_count = finished_count + 1
        WHERE username = ${hashedUsername}
        RETURNING id;
    `;

    if (result.length === 0) {
        return { success: false, message: 'User not found' };
    }

    return { success: true, message: 'User data updated successfully' };
});
