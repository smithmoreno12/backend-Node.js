import { Router } from "express";
import { ProductController } from "./controller";
import { AdminMiddleware, AuthMiddleware } from "../middlewares";
import { ProductService } from "../services";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();

    const controller = new ProductController(productService);

    // Definir las rutas
    router.get("/", controller.getProducts);
    router.post("/", [AuthMiddleware.validateJWT, AdminMiddleware.validateAdminRole], controller.createProduct);

    return router;
  }
}
