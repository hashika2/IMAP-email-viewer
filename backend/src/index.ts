import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import emailRoutes from './routes/email.routes';
import sequelize from "./config/database";

const app = express();
const port: number = 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", emailRoutes);

async function startServer() {
    try {
        // await sequelize.authenticate();
        // console.log("✅ Database connected");

        // await sequelize.sync({ alter: true }); // use migrations in prod
        // console.log("✅ Models synced");

        app.listen(port, () => {
            console.log(`Backend server listening at http://localhost:${port}`);
        });

    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}

startServer();
