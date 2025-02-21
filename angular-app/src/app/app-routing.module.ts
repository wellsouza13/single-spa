import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleButtonComponent } from './simple-button/simple-button.component';
import { LoginComponent } from './login/login.component';
import { CompanySelectionComponent } from './pages/company-selection/company-selection.component';

const routes: Routes = [
  { path: 'button', component: SimpleButtonComponent },
  { path: '', component: LoginComponent },
  { path: 'company/company-list', component: CompanySelectionComponent }, // 🔹 Mova essa rota para antes do '**'
  { path: '**', component: LoginComponent }, // 🔹 Coloque essa rota no final
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
