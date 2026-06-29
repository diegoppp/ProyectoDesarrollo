import { MailerService } from "@nestjs-modules/mailer";
import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class ForgotPasswordService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly mailerService: MailerService
    ) { }

   async execute(email: string) {
        try { 
            
            const usuarioEncontrado = await this.userRepository.findOne({
                where: { email }
            });

        if (!usuarioEncontrado) {
            return {
                message: 'Si el email existe, recibirás un link',
            };
        }

        const tokenReset = uuidv4();

        const fechaExpiracion = new Date();
        fechaExpiracion.setHours(fechaExpiracion.getHours() + 1);

        usuarioEncontrado.resetPasswordToken = tokenReset;
        usuarioEncontrado.resetPasswordExpires = fechaExpiracion;
        await this.userRepository.save(usuarioEncontrado);

        const linkReset = `http://localhost:4200/reset-password?token=${tokenReset}`;
      await this.mailerService.sendMail({
        to: usuarioEncontrado.email,
        subject: 'Restablecer Contraseña',
        html: `<p>Hola,</p><p>Haz clic en el siguiente enlace para restablecer tu contraseña (expira en 1 hora):</p><a href="${linkReset}">Restablecer mi contraseña</a>`,
      });

      console.log(`Correo de restablecimiento enviado con éxito a: ${email}`);

    } catch (error) {
      // Si se cae el microservicio de mails o explota la DB, lo registramos en la consola de Nest
      console.error('Error interno controlado en forgot-password:', error);
    }

    // 📄 RESPUESTA GENÉRICA SIEMPRE IDÉNTICA (Garantiza el éxito en el Frontend)
    return {
      message: 'Si el email existe, recibirás un enlace en breve.',
    };
    }
}



