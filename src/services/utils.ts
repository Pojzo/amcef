/**
 * @file Utility functions for services.
 * @author Peter Kovac
 * @date 19.8.2024
 */

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/configs/jwtConfig';

/**
 * Sign a JWT token with the given payload.
 * 
 * @param payload Payload consisting of userId. 
 * @returns Promise that resolves to a JWT token.
 * @throws Error if there is an error when signing the JWT token.
 */
export const signToken = (payload: JWTData) => {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An error occurred in signToken');
        }
    }
}