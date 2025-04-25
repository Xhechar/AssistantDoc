import Express from "express";
import dotenv from "dotenv";
import Cors from "cors";

const app = Express();
dotenv.config();

app.use(Express.json());
app.use(Cors());

app.use((error: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.status(500).json({
        'error': error.message,
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});