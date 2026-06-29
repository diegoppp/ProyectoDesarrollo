import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { UserEntity } from 'src/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(params: RegisterUserDto) {
    const usuarioExiste = await this.userRepository.findOne({
      where: { email: params.email },
    });
    if (usuarioExiste) {
      throw new BadRequestException(
        'El correo electrónico ya se encuentra registrado.',
      );
    }

    const passwordHash = await bcrypt.hash(params.password, 12);
    const nuevoToken = uuidv4();

    const nuevoUsuario: UserDto = {
      email: params.email,
      passwordHash,
      verificationToken: nuevoToken,
    };

    const { id, email, role, isVerified } =
      await this.userRepository.save(nuevoUsuario);

    const linkVerificacion = `http://localhost:4200/verify-email?token=${nuevoToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verificación de Correo Electrónico',
      html: `<p>Hola,</p><p>Para verificar tu cuenta haz click en el siguiente enlace:</p><a href="${linkVerificacion}">Verificar Cuenta</a>`,
    });

    const payload = { email, sub: id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id,
        email,
        role,
        isVerified,
      },
    };
  }
}
