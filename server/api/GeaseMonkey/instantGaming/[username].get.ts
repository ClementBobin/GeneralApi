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
import { prisma } from '~/server/db/client';

export default defineEventHandler(async (event) => {
    const username = event.context.params.username;

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const hashedUsername = await hashPasswordSHA(username);

    // Get the first day of the current month (start of the month)
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000;

    // Query user data from Prisma
    const user = await prisma.user.findUnique({
        where: {
            hashedUsername: hashedUsername,
        },
        select: {
            lastFinishedAt: true,
            finishedCount: true,
        },
    });

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    // Check if the user has finished the script this month
    const hasFinishedThisMonth = user.lastFinishedAt >= firstOfMonth;

    return {
        success: true,
        finished_this_month: hasFinishedThisMonth,
    };
});
