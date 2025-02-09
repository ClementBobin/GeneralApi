/**
 * @openapi
 * /api/GeaseMonkey/instantGaming/{username}:
 *   get:
 *     description: Check if the user has finished the script at least once this month
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username to check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success - Returns if the user has finished the script this month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 finished_this_month:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'User not found' 
 *       500:
 *         description: Server Error - Database connection or other server issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'DATABASE_URL is not defined'
 */
import { hashPasswordSHA } from '../../../../lib/Hash';
import { neon } from '@neondatabase/serverless';

export default defineEventHandler(async (event) => {
    const username = event.context.params.username;

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);

    const hashedUsername = await hashPasswordSHA(username);

    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000;

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
    const hasFinishedThisMonth = user.last_finished_at >= firstOfMonth;

    return {
        success: true,
        finished_this_month: hasFinishedThisMonth
    };
});
