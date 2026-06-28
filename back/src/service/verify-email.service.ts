import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class VerifyEmailService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async execute(token: string) {
        const usuario = await this.userRepository.findOne({ 
            where: { verificationToken: token } 
        });

        if (!usuario) {
            throw new BadRequestException('Token inválido o expirado');
        }

        usuario.isVerified = true;
        usuario.verificationToken = null;

        await this.userRepository.save(usuario);


        return {
            message: "Email verificado"
        };
    }
}