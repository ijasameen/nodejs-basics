import http from "http";
import path from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import jsonMinify from "node-json-minify";

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

const CT_HTML = "text/html";
const CT_CSS = "text/css";
const CT_JPG = "image/jpeg";
const CT_PNG = "image/png";
const CT_WEBP = "image/webp";
const CT_SVG = "image/svg+xml";
const CT_GIF = "image/gif";
const CT_JS = "application/javascript";
const CT_JSON = "application/json";
const CT_CSV = "text/csv";
const CT_TEXT = "text/plain";

const extToContentTypes = new Map([
  // Documents
  [".html", CT_HTML],
  [".css", CT_CSS],
  [".js", CT_JS],
  // Images
  [".jpg", CT_JPG],
  [".jpeg", CT_JPG],
  [".png", CT_PNG],
  [".webp", CT_WEBP],
  [".svg", CT_SVG],
  [".svgz", CT_SVG],
  [".gif", CT_GIF],
  // Data
  [".json", CT_JSON],
  [".csv", CT_CSV],
  [".txt", CT_TEXT],
]);

const redirects = new Map([["contact.html", "survey.html"]]);

const subDirs = new Set(["quotes"]);

const PORT = 9000;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const url = req.url;
  const urlPath = path.parse(url);
  const ext = urlPath.ext;

  const filePath = getFilePath(urlPath, subDirs);
  const contentType = extToContentTypes.get(ext) || "text/html";
  console.log(filePath, contentType);

  if (fs.existsSync(filePath)) {
    serveContent(filePath, contentType, res);
  } else {
    const key = path.relative(path.join(__dirname, "public"), filePath);
    const redirect = redirects.get(key);
    if (redirect) {
      res.setHeader("Location", redirect);
      res.writeHead(301);
      res.end();
    } else {
      console.error(`File path not found! (${filePath})`);
      serve404(res);
    }
  }
});

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);

async function serveContent(filePath, contentType, res) {
  try {
    const data = await getData(filePath, contentType);
    res.setHeader("Content-Type", contentType);
    res.writeHead(200);
    res.end(data);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end();
  }
}

async function serve404(res) {
  const filePath = path.join(__dirname, "public/404.html");
  const contentType = CT_HTML;
  try {
    const data = await getData(filePath, contentType);
    res.setHeader("Content-Type", contentType);
    res.writeHead(404);
    res.end(data);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end();
  }
}

function getFilePath(urlPath, subDirs) {
  const url = path.join(urlPath.dir, urlPath.base);

  const isRoot = url === "/";
  const isSubDir =
    url.slice(-1) === "/" || (!urlPath.ext && subDirs.has(urlPath.base));

  let filePath;
  if (isRoot || isSubDir) {
    filePath = path.join(__dirname, "public", url, "index.html");
  } else if (urlPath.ext) {
    filePath = path.join(__dirname, "public", url);
  } else {
    filePath = path.join(__dirname, "public", url + ".html");
  }

  return filePath;
}

async function getData(filePath, contentType) {
  const encoding = contentType.includes("image") ? "" : "utf-8";
  const data = await fsPromise.readFile(filePath, { encoding });

  // Minfy content if the content type is json
  if (contentType === CT_JSON) {
    console.log("before:", data);
    const minifiedData = jsonMinify(data);
    console.log("after:", data);
    return minifiedData;
  }

  return data;
}
