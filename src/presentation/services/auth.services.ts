import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";

export class AuthService {
    //DI Email Service
    constructor(private readonly emailService: EmailService) {}

    public async RegisterUserDto(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest("Email already exist");

        try {
            const user = new UserModel(registerUserDto);
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            // Enviar email de confirmacion

            this.sendEmailValidationLink(user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);

            // creacion del jwt adapter
            const token = await JwtAdapter.generateToken({ id: user.id });
            if (!token) throw CustomError.internalServerError("Token not generated");

            return { user: userEntity, token: token };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest("User not found");

        try {
            const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
            if (!isMatch === true) throw CustomError.badRequest("Invalid password");
            const { password, ...infoUser } = UserEntity.fromObject(user);

            // jwt adapter
            const token = await JwtAdapter.generateToken({ id: user.id });
            if (!token) throw CustomError.internalServerError("Token not generated");

            return {
                user: infoUser,
                token: token,
            };
        } catch (error) {
            throw CustomError.notFound(`${error}`);
        }
    }

    private sendEmailValidationLink = async (email: string) => {
        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServerError("Token not generated");
        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
        <h1>Validate your email</h1>
        <p>Click in the link below to validate your email</p>
        <a href="${link}">Validate Email</a>
        `;

        const options = {
            to: email,
            subject: "Validate Email",
            htmlBody: html,
        };

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServerError("Email not sent");
        return true;
    };

    public async validateEmail(token: string) {
        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.badRequest("Invalid token");

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServerError("Email not in token");

        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.badRequest("User not found");
        user.emailValidated = true;
        await user.save();
        return true;
    }
}
