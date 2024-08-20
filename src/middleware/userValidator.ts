/**
 * @Validation functions for user registration and login
 * @author Peter Kovac
 * @date 20.8.2024
 */


import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

  // Validation for login
const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ message: JSON.stringify(errorMessages) });
      }
      next();
    }
  ];

const validateRegister = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ message: JSON.stringify(errorMessages) });
      }
      next();
    }
  ]
  


export { validateRegister, validateLogin };