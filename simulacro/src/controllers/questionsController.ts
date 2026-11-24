import type { Request, Response } from 'express';
import * as questionsService from '../services/questionsService.js';
import { AppError } from '../errors/AppError.js';

export function ask(req: Request, res: Response) {
  const { question } = req.body;
  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new AppError(400, 'Invalid question', 'INVALID_QUESTION');
  } else {
    const result = questionsService.answerQuestion();
    res.status(200).json({ data: result });
  }
}
