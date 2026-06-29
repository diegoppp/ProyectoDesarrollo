import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

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
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
