import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.services";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        res.status(500).json({ error: "Internal server error" });
    };

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });
        this.authService
            .RegisterUserDto(registerDto!)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    };

    loginUser = (req: Request, res: Response) => {
        res.json("loginUser");
    };

    validateEmail = (req: Request, res: Response) => {
        res.json("validateEmail");
    };
}
