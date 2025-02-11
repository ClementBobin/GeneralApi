/**
 * @openapi
 * /api/GeaseMonkey/instantGaming/{username}:
 *   post:
 *     description: Update the user's finished script time and count
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success - User data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'User data updated successfully'
 *       400:
 *         description: Bad Request - If the user is not found or the update fails
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

    const currentUnixTime = Math.floor(Date.now() / 1000);

    // Update user data in the Prisma database
    const user = await prisma.user.update({
        where: {
            hashedUsername: hashedUsername,
        },
        data: {
            lastFinishedAt: currentUnixTime,
            finishedCount: {
                increment: 1,
            },
        },
        select: {
            id: true,
        },
    });

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    return { success: true, message: 'User data updated successfully' };
});
