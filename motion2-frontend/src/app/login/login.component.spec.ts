import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ApiRequestService } from '../api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let http: jasmine.SpyObj<ApiRequestService>;
  let authenticatedUser: jasmine.SpyObj<AuthenticatedUserService>;

  beforeEach(async () => {
    http = jasmine.createSpyObj<ApiRequestService>('ApiRequestService', [
      'getWithHeaders',
    ]);
    authenticatedUser = jasmine.createSpyObj<AuthenticatedUserService>(
      'AuthenticatedUserService',
      ['setUser']
    );

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: ApiRequestService, useValue: http },
        { provide: AuthenticatedUserService, useValue: authenticatedUser },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.username = 'mockUsername';
    component.password = 'letmein';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login given valid credentials', () => {
    http.getWithHeaders.and.returnValue(
      of({
        message: 'user is logged in',
      })
    );

    component.login();
    expect(http.getWithHeaders).toHaveBeenCalledOnceWith(`/users/login`, {
      Username: component.username,
      Password: component.password,
    });
    expect(authenticatedUser.setUser).toHaveBeenCalledOnceWith({
      username: component.username,
      password: component.password,
    });
  });

  it('should alert on failed login', () => {
    spyOn(window, 'alert');

    http.getWithHeaders.and.returnValue(
      throwError(() => ({
        message: 'Username is required',
      }))
    );

    component.login();
    expect(http.getWithHeaders).toHaveBeenCalledOnceWith(`/users/login`, {
      Username: component.username,
      Password: component.password,
    });
    expect(authenticatedUser.setUser).toHaveBeenCalledTimes(0);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it('should not log in with empty username', () => {
    component.username = '';

    component.login();
    expect(http.getWithHeaders).toHaveBeenCalledTimes(0);
  });

  it('should not log in with empty password', () => {
    component.password = '';

    component.login();
    expect(http.getWithHeaders).toHaveBeenCalledTimes(0);
  });
});
