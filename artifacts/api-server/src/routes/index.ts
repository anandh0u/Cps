import { Router, type IRouter } from "express";
import healthRouter from "./health";
import departmentRouter from "./department";

const router: IRouter = Router();

router.use(healthRouter);
router.use(departmentRouter);

export default router;
