export default function handleErrors(err, req, res, next) {
  // If headers have already been sent, delegate to the default Express error handler
  // This will cause the connection to be closed.
  if (res.headersSent) {
    return next(err);
  }

  let content = "";
  res.status(500);
  if (req.accepts("html")) {
    res.type("html");
    res.send(`<h1>500 Internal Error</h1><p>${err.message}`);
  } else if (req.accepts("json")) {
    res.type("json");
    res.json({ message: `500 internal error: ${err.message}` });
  } else {
    res.type("text");
    res.send(`500 internal error: ${err.message}`);
  }
}
