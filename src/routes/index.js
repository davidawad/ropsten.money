import { Router } from "express";
import purchaseRoutes from "./purchase";
// import metadataRoutes from "./metadata";
import monitorRoutes from "./monitor";

const router = Router();

router.use("/purchase", purchaseRoutes);
// router.use("/metadata", metadataRoutes);
router.use("/health", monitorRoutes);

export default router;
