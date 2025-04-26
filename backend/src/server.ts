import Express from "express";
import dotenv from "dotenv";
import Cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routers";
import { enrollmentRouter } from "./routes/enrollment.routers";
import { patientRouter } from "./routes/patient.routes";
import { programRouter } from "./routes/program.routers";

const app = Express();
dotenv.config();

app.use(Express.json());
app.use(Cors({
  credentials: true
}));
app.use(cookieParser(process.env.COOKIE_SECRET as string));

app.use('/user', userRouter);
app.use('/patients', patientRouter);
app.use('/programs', programRouter);
app.use('/enrollments', enrollmentRouter);


app.use((error: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.status(500).json({
        'error': error.message,
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});