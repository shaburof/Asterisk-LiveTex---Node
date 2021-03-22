console.clear();
console.log('---------------------------------');

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { router } from './routes/route';
import { chatRouter } from './routes/chatRoute';
import { serviceMiddleware } from './service/serviceMiddleware';



const app = express();
const PORT = process.env.PORT;
const root = __dirname;
const access_ip = process.env.ACCESS_IP as string;
export { root, app, access_ip };


app.use(express.json());
app.use(serviceMiddleware);

app.use('/livetex/chat', chatRouter);
app.use('/', router);


app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.log('ERROR(');
    console.error(err.stack)
    res.status(500).send(err.message)
})


app.listen(PORT, () => console.log(`Listen ${PORT} port...`));
