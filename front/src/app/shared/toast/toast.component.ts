import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription!: Subscription;

  constructor(
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.toastService.toastState$.subscribe((toast) => {
      this.toasts.push(toast);
      this.cdr.detectChanges(); // Forzamos dibujado de la notificación flotante

      // • REQUISITO: Auto-destrucción a los 4 segundos
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== toast.id);
        this.cdr.detectChanges();
      }, 4000);
    });
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}