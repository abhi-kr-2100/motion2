import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { RawApiRequestService } from '../raw-api-request.service';
import { AuthenticatedUserService } from '../authenticated-user.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let http: jasmine.SpyObj<RawApiRequestService>;
  let authenticatedUser: jasmine.SpyObj<AuthenticatedUserService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    http = jasmine.createSpyObj('RawApiRequestService', ['get']);
    authenticatedUser = jasmine.createSpyObj<AuthenticatedUserService>(
      'AuthenticatedUserService',
      ['setUser']
    );

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RawApiRequestService, useValue: http },
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
    http.get.and.returnValue(of({ message: 'user is logged in' }));

    component.login();
    expect(http.get).toHaveBeenCalledOnceWith(`/users/login`, {
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

    http.get.and.returnValue(
      throwError(() => ({
        message: 'Username is required',
      }))
    );

    component.login();
    expect(http.get).toHaveBeenCalledOnceWith(`/users/login`, {
      Username: component.username,
      Password: component.password,
    });
    expect(authenticatedUser.setUser).toHaveBeenCalledTimes(0);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it('should not log in with empty username', () => {
    component.username = '';

    component.login();
    expect(http.get).toHaveBeenCalledTimes(0);
  });

  it('should not log in with empty password', () => {
    component.password = '';

    component.login();
    expect(http.get).toHaveBeenCalledTimes(0);
  });

  it('should render the login page', () => {
    const elem: HTMLElement = fixture.nativeElement;

    expect(elem.querySelector('input')).toBeTruthy();
    expect(elem.querySelector('input[type="password"]')).toBeTruthy();
    expect(elem.querySelector('button')?.textContent).toBe('Login');
  });

  it('should initiate login on button click', () => {
    spyOn(component, 'login');

    const elem: HTMLElement = fixture.nativeElement;
    const loginBtn: HTMLButtonElement = elem.querySelector(
      'button'
    ) as HTMLButtonElement;

    loginBtn.click();
    expect(component.login).toHaveBeenCalledOnceWith();
  });

  it('should redirect to home page on successful login', () => {
    routerSpy.navigate.and.returnValue(new Promise(() => true));
    http.get.and.returnValue(of({ message: 'user is logged in' }));

    component.login();
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/']);
  });
});
