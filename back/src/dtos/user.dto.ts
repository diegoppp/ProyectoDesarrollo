import { UserRole } from '../enums/user-role.enum';


export class UserDto {
    email!: string;
    verificationToken!: string;
    passwordHash!: string;
}
