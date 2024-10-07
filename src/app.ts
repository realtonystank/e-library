import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import { AppDataSource } from "./config/data-source";
import { User } from "./entity/User";
const app = express();

app.get("/", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = new User();
  user.name = "Priyansh";
  await userRepo.save(user);
  res.send("Welcome to auth service");
});

app.use(globalErrorHandler);

export default app;
