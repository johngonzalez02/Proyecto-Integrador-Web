import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { City } from '../interfaces/location.interface';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${API_URL}/cities`);
  }
}