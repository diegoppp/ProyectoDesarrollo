import { Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})

export class VerifyPendingPage{
    private auth = inject(AuthService)

    async resendVerification(){
        this.auth.resendVerification()
        
    }
}