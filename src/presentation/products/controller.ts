import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services";

export class ProductController {
  //DI
  constructor() {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }

  createProduct = (req: Request, res: Response) => {
    res.json({ message: "Producto creado" });
  };

  //
  getProducts = async (req: Request, res: Response) => {
    res.json({ message: "Lista de productos" });
  };
}
