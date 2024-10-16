import express from "express"
import { sendMessages ,getMessages} from "../controllers/message.controller.js";
import protectRoutes from "../Middlewares/protectRoutes.js";

const router = express.Router();

router.get("/:id",protectRoutes,getMessages)

router.post("/send/:id",protectRoutes,sendMessages)

export default router