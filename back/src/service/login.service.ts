import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export class LoginService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const usuarioBuscado = await this.usersRepository.findOne({
      where: { email: email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isVerified: true,
      },
    });

    if (!usuarioBuscado) {
      throw new NotFoundException('El usuario no existe');
    }
    const passwordValida = await bcrypt.compare(
      password,
      usuarioBuscado.passwordHash,
    );
    if (!passwordValida) {
      throw new BadRequestException('Contraseña incorrecta');
    }
    const payload = { email, sub: usuarioBuscado.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async getMe(userId: string) {
    const usuario = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }
}
