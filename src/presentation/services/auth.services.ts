import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthService {
    //DI
    constructor() {}

    public async RegisterUserDto(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest("Email already exist");

        try {
            const user = new UserModel(registerUserDto);
            // Encriptar contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();
            // Generar token

            const { password, ...userEntity } = UserEntity.fromObject(user);
            return { user: userEntity, token: "ABC" };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        //findone para verificar si existe por el correo
        try {
            const existUser = await UserModel.findOne({ email: loginUserDto.email });
            if (!existUser) throw CustomError.badRequest("User not found");
            const isMatch = bcryptAdapter.compare(loginUserDto.password, existUser.password);
            if (!isMatch) throw CustomError.badRequest("Invalid password");
            const { password, ...info } = UserEntity.fromObject(existUser);

            return {
                user: {
                    ...info,
                },
                token: "ABC",
            };
        } catch (error) {
            throw CustomError.notFound(`${error}`);
        }
    }
}
