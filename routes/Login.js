import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ userId: user.id }, secretKey);

    res.status(200).json({ message: "Successfully logged in!", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;