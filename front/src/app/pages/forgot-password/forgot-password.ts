import { Component, ChangeDetectorRef } from '@angular/core'; // 👈 1. Importamos ChangeDetectorRef
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.css',
    imports: [CommonModule, FormsModule]
})
export class ForgotPasswordPage {
    email: string = '';
    cargando: boolean = false;
    correoEnviado: boolean = false;

    constructor(
        private readonly http: HttpClient,
        private readonly cdr: ChangeDetectorRef, 
        private readonly toast: ToastService
    ) { }

    enviarLink() {
        if (!this.email) return;

        this.cargando = true;

        this.http.post('http://localhost:3000/auth/forgot-password', { email: this.email }).subscribe({
            next: () => {
                this.cargando = false;
                this.correoEnviado = true; 
                this.toast.success("Si el email existe, recibirás un link");
                this.cdr.detectChanges(); 
            },
            error: (err) => {
                console.error('Detalle del error en consola:', err);
                this.cargando = false;
                this.correoEnviado = true; 
                
                this.cdr.detectChanges(); 
            }
        });
    }
}