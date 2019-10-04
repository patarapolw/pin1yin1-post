import Parcel from "parcel-bundler";
import proxy from "http-proxy-middleware";
import express from "express";

const parcel = new Parcel("web/index.html");
const app = express();
const port = 1234;

app.use("/api", proxy("http://localhost:24000"));
app.use(parcel.middleware());

app.listen(port, () => {
  console.log(`Parcel is running at http://localhost:${port}`)
});
