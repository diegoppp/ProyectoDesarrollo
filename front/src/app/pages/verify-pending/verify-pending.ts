import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-pending',
  imports: [],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);

  resendVerification() {
    this.auth.resendVerification().subscribe();
  }
}
