// File: /server/api/ul/[username].get.js

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
    console.log(hashedUsername);

    // Get current Unix time for comparison
    const currentUnixTime = Math.floor(Date.now() / 1000);
    console.log(currentUnixTime);

    // Get the first day of the current month
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000;

    // Retrieve user data from DB using the hashed username
    const result = await sql`
        SELECT last_finished_at, finished_count
        FROM users
        WHERE username = ${hashedUsername}
        LIMIT 1;
    `;

    if (result.length === 0) {
        return { success: false, message: 'User not found' };
    }

    const user = result[0];
    
    // Check if the user has finished the script at least once this month
    const hasFinishedThisMonth = user.last_finished_at >= firstOfMonth;

    return {
        success: true,
        finished_this_month: hasFinishedThisMonth
    };
});
