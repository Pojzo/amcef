/**
 * @Utils for middleware
 * @author Peter Kovac
 * @date 19.8.2024
 */

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "src/configs/jwtConfig";

export const getUserFromToken = (token: string): Promise<JWTData> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err: unknown, decoded: JWTData) => {
			if (err) {
				reject(err);
			}
			resolve(decoded);
		});
	});
};
