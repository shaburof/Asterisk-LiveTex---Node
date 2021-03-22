import express from 'express';
import { chatController } from '../controllers/chatController';

let ChatController = new chatController();

const chatRouter = express.Router();

chatRouter.post('/report_3', ChatController.report_3);
chatRouter.post('/report_8', ChatController.report_8);


export { chatRouter };
