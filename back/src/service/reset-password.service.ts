import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(body: { token: string; password?: string }) {
    const { token, password } = body;

    if (!token || !password) {
      throw new BadRequestException('Token inválido o expirado');
    }

    try {
      // Forzamos que se busque como string puro para evitar problemas en TypeORM
      const usuario = await this.userRepository.findOne({
        where: { resetPasswordToken: String(token) },
      });

      // Validamos si no existe o si ya expiró
      if (!usuario || !usuario.resetPasswordExpires || usuario.resetPasswordExpires < new Date()) {
        throw new BadRequestException('Token inválido o expirado');
      }

      // Hasheamos la contraseña
      const nuevoHash = await bcrypt.hash(password, 12);

      // Limpiamos usando undefined (que TypeORM traduce a NULL en Postgres)
      usuario.passwordHash = nuevoHash;
      usuario.resetPasswordToken = undefined;
      usuario.resetPasswordExpires = undefined;

      await this.userRepository.save(usuario);

      return { message: 'Contraseña actualizada' };

    } catch (error) {
      console.error('Error crítico en el proceso de reset-password:', error);
      
      throw new BadRequestException(error.message || 'Token inválido o expirado');
    }
  }
}