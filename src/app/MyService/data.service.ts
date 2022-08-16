import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  postEmployee(data: any): Observable<any> {

    return this.http.post<any>("http://localhost:3000/Prime", data).pipe(map((res: any) => {
      return res
    }))
  }

  getEmployee(): Observable<any> {

    return this.http.get<any>("http://localhost:3000/Prime").pipe(map((res: any) => {
      return res
    }))
  }

  updateEmployee(data: any, id: number): Observable<any> {

    return this.http.put<any>("http://localhost:3000/Prime/" + id, data).pipe(map((res: any) => {
      return res
    }))
  }

  deleteEmployee(id: number): Observable<any> {

    return this.http.delete<any>("http://localhost:3000/Prime/" + id).pipe(map((res: any) => {
      return res
    }))
  }

}
