import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, UserRole } from '../interfaces/user.interface';
import { USERS_MOCK } from '../mocks/users.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers(): Observable<User[]> {
    return of(USERS_MOCK);
  }

  getUserByRole(role: UserRole): Observable<User | undefined> {
    return of(USERS_MOCK.find((u) => u.rol === role));
  }
}
