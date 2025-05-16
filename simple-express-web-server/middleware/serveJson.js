import path from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import jsonMinify from "node-json-minify";

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

export default function serveJson(root) {
  return async (req, res, next) => {
    const url = req.url;
    const parsedUrl = path.parse(url);
    const ext = parsedUrl.ext;

    if (ext !== ".json") {
      next();
      return;
    }

    const rootPath = path.join("..", root);
    const filePath = path.join(__dirname, rootPath, url);
    if (!fs.existsSync(filePath)) {
      next();
      return;
    }

    let data = await fsPromise.readFile(filePath, { encoding: "utf-8" });
    if (!data || typeof data != "string") {
      next();
      return;
    }

    data = jsonMinify(data);
    res.type("json");
    res.send(data);
  };
}
