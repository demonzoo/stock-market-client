import { Injectable } from '@angular/core';
import { Entity, ResponseData, State, TableService } from './table.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageableResponse } from '../models/pageable-response';

export interface IPO extends Entity {
  id: number;
  name: string;
  exchange: string;
  description: string;
  ipoDate: string;
  shares: number;
  minPrice: number;
  maxPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class IpoService extends TableService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  getIpoList(state: State): Observable<ResponseData<IPO>> {
    return this.http.get<PageableResponse<IPO>>(`/ipo?page=${state.page - 1}&pageSize=${state.pageSize}`)
      .pipe(map(res => this.pipeline(res.content, res.totalElements, state)));
  }
}
