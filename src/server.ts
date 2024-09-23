import express from "express";

const app = express();

function test() {
  console.log("jiii");
}

test();
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(5555, () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running at http://localhost:5555`);
});
