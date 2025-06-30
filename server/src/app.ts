import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware";
import userRoute from "./routes/user.route";



dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
app.use(helmet());

const prefixRoute = `api/${process.env.API_VERSION || "v1"}`;

app.use(`/${prefixRoute}/users`, userRoute);


app.use(errorMiddleware)

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
})

