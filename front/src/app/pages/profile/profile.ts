import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);

  async ngOnInit(){
    await firstValueFrom(this.auth.me())
  }

  async resendVerification(){
    await firstValueFrom(this.auth.resendVerification())
  }

}  
