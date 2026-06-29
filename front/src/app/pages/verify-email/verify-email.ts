import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService)
  success = signal(false);
  error = signal(false);
  loading = signal(true);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.auth.verifyEmail(token).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        this.toast.success("Email verificado correctamente");
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.toast.error("Token inválido o expirado");
      },
    });
  }
}
