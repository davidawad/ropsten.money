import { Router } from "express";
import purchaseRoutes from "./purchase";
import monitorRoutes from "./monitor";

const router = Router();

router.use("/purchase", purchaseRoutes);
router.use("/health", monitorRoutes);

export default router;
