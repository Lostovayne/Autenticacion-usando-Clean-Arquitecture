import { regularExps } from "../../../config";

export class RegisterUserDto {
    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string
    ) {}

    static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { name, email, password } = object;
        if (!name) return ["Missing name", undefined];
        if (!email) return ["Missing email", undefined];
        if (!regularExps.email.test(email)) return ["Invalid email", undefined];
        if (!password) return ["Missing password", undefined];
        if (password.length < 6) return ["Password too short", undefined];
        return [undefined, new RegisterUserDto(name, email, password)];
    }
}
