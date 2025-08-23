import express from "express";

const app = express();
const APP_PORT = process.env.PORT || 5001;

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
