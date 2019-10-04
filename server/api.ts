import { Router } from "express";
import bodyParser from "body-parser";
import jieba from "nodejieba";
import pinyin from "chinese-to-pinyin";
import sqlite3 from "better-sqlite3";

const apiRouter = Router();
apiRouter.use(bodyParser.json());

const zh = sqlite3("assets/zh.db");
const stmt = {
  vocabMatch: zh.prepare(`
  SELECT * FROM vocab 
  WHERE
    simplified = ? OR
    traditional = ?`)
};

apiRouter.post("/lib/jieba", (req, res) => {
  return res.json({
    result: jieba.cut(req.body.entry || "")
  });
});

apiRouter.post("/lib/pinyin", (req, res) => {
  return res.json({
    result: pinyin(req.body.entry || "", {keepRest: true})
  })
});

apiRouter.post("/zh/vocab/match", (req, res) => {
  const {entry} = req.body;

  return res.json({
    result: stmt.vocabMatch.all(entry, entry)
  });
});

export default apiRouter;
