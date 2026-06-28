import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LoginUserDto } from "src/dtos/login-user.dto";
import { RegisterUserDto } from "src/dtos/register-user.dto";
import { ResendVerificationDto } from "src/dtos/resend-verification.dto";
import { VerifyEmailDto } from "src/dtos/verify-email.dto";
import { LoginService } from "src/service/login.service";
import { RegisterUserService } from "src/service/register-user.service";
import { ResendVerificationService } from "src/service/resend-verification.service";
import { VerifyEmailService } from "src/service/verify-email.service";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly verifyEmailService: VerifyEmailService,
        private readonly resendVerificationService: ResendVerificationService,
        private readonly loginService: LoginService
    ) {
    }

    @Post("register")
    registerUser(
        @Body() body: RegisterUserDto
    ) {
       return this.registerUserService.execute(body)
    }
    
    @Post("verify-email")
    verifyEmail(
        @Body() body: VerifyEmailDto
    ){
       return this.verifyEmailService.execute(body.token)

    }
    
    @Post("resend-verification")
    resendVerification(
        @Body() body: ResendVerificationDto

    ){
       console.log("controller")
        return this.resendVerificationService.execute(body.email)

    }
     
    @Post("login")
    loginUser(
        @Body() body: LoginUserDto
    ) {
       return this.loginService.execute(body.email, body.password)
    }
    
}

