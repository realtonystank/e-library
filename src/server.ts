import app from "./app";
import config from "config";
const startServer = () => {
  const PORT: string = config.get("server.port");
  try {
    app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();
