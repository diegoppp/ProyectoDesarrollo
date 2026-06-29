import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-pending',
  imports: [],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);
  private toast = inject(ToastService)

  resendVerification() {
    this.auth.resendVerification().subscribe(
      {
        next: () => {
          this.toast.success("Email reenviado"); 
        }
      }
    );

  }
}
