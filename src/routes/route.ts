import express, { Request, Response } from 'express';
import { app } from '../server';

const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

router.use('*', (req: Request, res: Response) => {
    res.status(404).json({ status: 'error', code: 404, message: `not found` });
});

export { router };

