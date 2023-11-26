import { JwtAdapter, bcryptAdapter } from "../../config";
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
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);
            return { user: userEntity, token: "ABC" };
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
}
