import express from 'express'
import protectRoutes from '../Middlewares/protectRoutes.js';
import { getUsersForSidebar } from '../controllers/user.controllers.js';
const router = express.Router();


router.get("/",protectRoutes,getUsersForSidebar)

export default router