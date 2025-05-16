import { Router } from "express";
import path from "path";

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

const router = new Router();

router.get("/{index{.html}}", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/quotes/index.html"));
});

export default router;
