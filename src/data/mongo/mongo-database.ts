import mongoose from "mongoose";

interface Optios {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(option: Optios) {
    const { mongoUrl, dbName } = option;

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });
      return true;
    } catch (error) {
      console.log("Mongo connection error");
      throw error;
    }
  }
}
