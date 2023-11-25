import { regularExps } from "../../../config";

export class LoginUserDto {
    constructor(public readonly email: string, public readonly password: string) {}

    static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
        const { email, password } = object;
        if (!regularExps.email.test(email)) return ["Invalid email"];
        if (!email) return ["Missing email"];
        if (!password) return ["Missing password"];
        return [undefined, new LoginUserDto(email, password)];
    }
}
