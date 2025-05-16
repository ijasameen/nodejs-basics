import express from "express";
import { static as serveStatic } from "express";
import rootRouter from "./routes/root.js";
import quotesRouter from "./routes/quotes.js";
import path from "path";
import serveJson from "./middleware/serveJson.js";
import handleErrors from "./middleware/handleErrors.js";

const app = express();

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

const PORT = 9000;

// Custom middleware similar to serveStatic to only serve json files.
// This will minify the json before sending it.
app.use(serveJson("public"));

// serveStatic could serve html too.
// But here, it's only used for everything except html.
app.use(serveStatic("public"));

app.use("/", rootRouter);
app.use("/quotes", quotesRouter);

// Handle 404
// app.all("/*splat", ...) alternative option
app.use("/", (req, res, next) => {
  res.statusCode = 404;
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "pages/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found!" });
  } else {
    res.type("text/plain");
    res.send("404 not found!");
  }
});

app.use(handleErrors);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);
