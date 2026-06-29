import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResendVerificationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async execute(email: string) {
    const usuario = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log('Usuario', usuario);
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const nuevoToken = uuidv4();
    usuario.verificationToken = nuevoToken;

    const { id, role, isVerified } = await this.userRepository.save(usuario);
    const linkVerificacion = `http://localhost:4200/verify-email?token=${nuevoToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verificación de Correo Electrónico',
      html: `<p>Hola,</p><p>Para verificar tu cuenta haz click en el siguiente enlace:</p><a href="${linkVerificacion}">Verificar Cuenta</a>`,
    });

    return {
      id,
      email,
      role,
      isVerified,
    };
  }
}
