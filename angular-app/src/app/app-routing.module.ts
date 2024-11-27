import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleButtonComponent } from './simple-button/simple-button.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'button', component: SimpleButtonComponent }, // Rota para o SimpleButtonComponent
  { path: '', component: LoginComponent }, // Rota para o LoginComponent
  { path: '**', component: LoginComponent }, // Rota para páginas não encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
