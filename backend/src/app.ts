import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";

import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
