import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    passwordHash!: string;

    @Column({ type: 'text', default: UserRole.USER })
    role!: UserRole;

    @Column({ default: false })
    isVerified!: boolean

    @Column({ type: 'varchar', nullable: true, name: 'verification_token' })
    verificationToken!: string | null;
}
