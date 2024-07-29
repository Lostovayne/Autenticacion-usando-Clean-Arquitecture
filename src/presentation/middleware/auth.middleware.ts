import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
  //DI

  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    if (!authorization)
      return res.status(401).json({ error: "Unauthorized, No token provided" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized, Invalid token" });

    const token = authorization.split(" ")[1] || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: " Invalid token" });
      
      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(401).json({ error: "Invalid token - User not found" });

      // Todo: Validar si el usuario esta activo

      req.body.user = UserEntity.fromObject(user);

      next();

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
