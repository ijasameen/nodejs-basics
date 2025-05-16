import { Router } from "express";
import path from "path";

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

const router = new Router();

router.get("/{index{.html}}", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/index.html"));
});

router.get("/survey{.html}", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/survey.html"));
});

router.get("/about{.html}", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/about.html"));
});

export default router;
