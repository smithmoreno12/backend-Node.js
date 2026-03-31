import { envs } from "../../config";
import {
  CategoryModel,
  MongoDatabase,
  ProductModel,
  UserModel,
} from "../mongo";
import { seedData } from "./data";

(async () => {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });
  await main();
  await MongoDatabase.disconnect();
})();

const randomBetween = (x: number) => Math.floor(Math.random() * x);

async function main() {
  // 0. Borrar todo!
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  //1 Crear usuarios
  const users = await UserModel.insertMany(seedData.users);

  //2 Crear categorias
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((c) => {
      return {
        ...c,
        user: users[0].id,
      };
    }),
  );

  //3 Crear productos
  const products = await ProductModel.insertMany(
    seedData.products.map((p) => {
      return {
        ...p,
        user: users[randomBetween(seedData.users.length - 1)].id,
        category: categories[randomBetween(categories.length - 1)].id,
      };
    }),
  );

  console.log("SEED");
}
