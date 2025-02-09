import argon2 from 'argon2';
import crypto from 'crypto';

export async function hashPasswordArg2(password : string) {
    return await argon2.hash(password);
}

export async function hashPasswordSHA(password : string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}