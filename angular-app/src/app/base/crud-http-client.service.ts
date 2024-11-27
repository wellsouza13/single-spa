import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity } from './entity';
import { AbstractHttpService } from './http-client.service';
import { Page, PageFilter } from './page';

export abstract class BaseCrudService<K, E extends Entity<K>, L, F> extends AbstractHttpService {
  constructor(public uri: string, protected http: HttpClient) {
    super(uri, http);
  }

  /**
   * Recupera os registros do listar com base no filtro
   */
  public find(filter: PageFilter<F>): Observable<Page<L>> {
    return this.http.post<Page<L>>(this.getBackendUrl() + this.uri + '/filtrar', filter, this.options());
  }

  /**
   * Recupera todos os registros
   */
  public getAll(): Observable<Page<E>> {
    return this.http.get<Page<E>>(this.getBackendUrl() + this.uri , this.options());
  }

  /**
   * Recupera um registro em particular, ou todos (caso não seja passado
   * o parâmetro id)
   */
  public get(id?: K): Observable<E> {
    let url = this.getBackendUrl() + this.uri ;

    if (id) {
      url += '/' + id;
    }

    return this.http.get<E>(url, this.options());
  }

  /**
   * Insere um registro
   */
  public post(entity: E): Observable<E> {
    return this.http.post<E>(this.getBackendUrl() + this.uri , entity, this.options());
  }

  /**
   * Altera um registro
   */
  public put(entity: E): Observable<E> {
    return this.http.put<E>(this.getBackendUrl() + this.uri , entity, this.options());
  }

  /**
   * Exclui um registro
   */
  public delete(id: K): Observable<E> {
    return this.http.delete<E>(this.getBackendUrl() + this.uri  + '/' + id, this.options());
  }
}
