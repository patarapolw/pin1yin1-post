import express from "express";
import apiRouter from "./api";

const port = Number(process.env.PORT || 24000);
const app = express();

app.use(express.static("dist"));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
