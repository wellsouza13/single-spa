import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { SimpleButtonComponent } from './simple-button/simple-button.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputTextComponent } from './components/inputs/input-text/input-text.component';
import { ButtonComponent } from './components/button/button.component';
import { ConfigService } from './lib/services/config.service';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SimpleButtonComponent,
    LoginComponent,
    InputTextComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/angular' },
    ConfigService,
    {
      provide: 'Configs',
      useValue: {
        publicUrl: environment.apiUrl,
        tokenUrl: '/token/v5',
        refreshTokenUrl: '/api/refresh-token',
        invalidateTokenUrl: '/api/invalidate-token',
        loginUrl: '/login',
        resetPassword: '/reset-password',
        commonsUrl: '/api/commons',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
