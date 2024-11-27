import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = 'http://api.exemplo.com';

  constructor(private http: HttpClient) {}

  createUser(register: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/conta-plataforma/v1/cadastrar`,
      register
    );
  }

  updateOrganizationsToken(
    emailAccount: string,
    orgs: number[]
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/token/v4/atualiza/conta/${emailAccount}`,
      orgs
    );
  }
}
