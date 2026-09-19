import { randomUUID } from "node:crypto";
import { Router } from "express";

import { validateRequest } from "../middleware/validateRequest.js";
import { createUserSchema, type CreateUserInput } from "../schemas/user.js";

const users: Array<CreateUserInput & { id: string }> = [];

export const usersRouter = Router();

usersRouter.get("/users", (_req, res) => {
  res.json({
    success: true,
    data: users,
  });
});

usersRouter.post("/users", validateRequest(createUserSchema), (req, res) => {
  const newUser = {
    id: randomUUID(),
    ...req.body,
  } as CreateUserInput & { id: string };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser,
  });
});
