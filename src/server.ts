import { Server } from "http";
import app from "./app";
// import config from "./config";

async function main() {
  const server: Server = app.listen(5000, () => {
    console.log(`Server is listening on port ${5000}`);
  });
}

main();
