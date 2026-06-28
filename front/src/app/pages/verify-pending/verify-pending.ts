import { Component, inject, Input} from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './verify-pending.html',
    styleUrl: './verify-pending.css',
})
export class VerifyPendingPage  {
    email: string = sessionStorage.getItem("pending_email") || ""

    private auth = inject(AuthService)

     resendVerification() {
        console.log("verify-pending page", this.email)
        this.auth.resendVerification(this.email)
    }
}