import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
