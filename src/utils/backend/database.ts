import mongoose from "mongoose";
import config from "src/config";
import logger from "./logger";

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const { MONGO_URL } = config;

  if (!MONGO_URL) {
    throw new Error(
      "Please define the MONGO_URL environment variable inside .env"
    );
  }

  await mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
    })
    .catch((error) => logger.error(error));

  const database = mongoose.connection;

  database.on("error", (err) => {
    logger.error("Database connection error:", err);
  });
}

export const dbDisconnect = () => {
  if (!mongoose.connection) {
    return;
  }
  mongoose.disconnect();
};
