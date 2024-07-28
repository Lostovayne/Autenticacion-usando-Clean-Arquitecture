import { CreateCategoryDto, CustomError } from "../../domain";
import { Request, Response } from "express";

export class CategoryController {
  // DI
  constructor() {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    res.status(500).json({ error: "Internal server error" });
  };

  createCategory = async (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

    if (error) return res.status(400).json({ error });

    res.json({
      createCategoryDto,
    });
  };

  getCategories = async (req: Request, res: Response) => {
    res.json("Get Categories");
  };
}
