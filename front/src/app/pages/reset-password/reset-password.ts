import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 1. Importamos ChangeDetectorRef
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ResetPasswordPage implements OnInit {
  token: string = '';
  password?: string = '';
  confirmPassword?: string = '';
  cargando: boolean = false;
  cambiadaExitosamente: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef, 
    private readonly toast: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  restablecerClave() {
    if (!this.token || !this.password || this.password.length < 8 || this.password !== this.confirmPassword) {
      return;
    }

    this.cargando = true;

    this.http.post('http://localhost:3000/auth/reset-password', {
      token: this.token,
      password: this.password
    }, { responseType: 'text' }).subscribe({
      next: (respuesta) => {
        console.log('¡Contraseña cambiada con éxito!', respuesta);
        this.cargando = false;
        this.cambiadaExitosamente = true; 
        this.toast.success("Contraseña actualizada"); 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al restablecer contraseña:', err);
        alert('Ocurrió un problema al procesar la solicitud o el token ya expiró.');
        
        this.cdr.detectChanges();
      }
    });
  }
}