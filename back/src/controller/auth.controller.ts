import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { LoginUserDto } from 'src/dtos/login-user.dto';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { VerifyEmailDto } from 'src/dtos/verify-email.dto';
import { LoginService } from 'src/service/login.service';
import { RegisterUserService } from 'src/service/register-user.service';
import { ResendVerificationService } from 'src/service/resend-verification.service';
import { VerifyEmailService } from 'src/service/verify-email.service';
import { JwtAuthGuard } from 'src/service/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserService: RegisterUserService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly resendVerificationService: ResendVerificationService,
    private readonly loginService: LoginService,
  ) {}

  @Post('register')
  registerUser(@Body() body: RegisterUserDto) {
    return this.registerUserService.execute(body);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: VerifyEmailDto) {
    return this.verifyEmailService.execute(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification')
  resendVerification(@Req() req: any) {
    return this.resendVerificationService.execute(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return this.loginService.getMe(req.user.userId);
  }

  @Post('login')
  loginUser(@Body() body: LoginUserDto) {
    return this.loginService.execute(body.email, body.password);
  }
}
