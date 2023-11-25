import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
    //DI
    constructor() {}

    public async RegisterUserDto(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest("Email already exist");

        try {
            const user = new UserModel(registerUserDto);
            await user.save();

            // Encriptar contraseña

            // Generar token

            const { password, ...userEntity } = UserEntity.fromObject(user);
            return { user: userEntity, token: "ABC" };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }
}
