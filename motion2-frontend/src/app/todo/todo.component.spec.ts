import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { TodoComponent } from './todo.component';

describe('TodoComponent basics', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let element: HTMLElement;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [TodoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);

    component = fixture.componentInstance;
    component.uuid = '123e4567-e89b-12d3-a456-426614174000';
    component.title = 'Test Todo';
    component.isCompleted = Math.random() > 0.5;

    element = fixture.nativeElement;

    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    expect(element.getElementsByClassName('todo-title').length).toBe(1);
    expect(element.getElementsByClassName('todo-title')[0].textContent).toBe(
      component.title
    );
  });

  it('should render the checkbox', async () => {
    const checkbox = await loader.getHarness(MatCheckboxHarness);
    expect(checkbox).not.toBeNull();
  });
});

describe('TodoComponent with incomplete todo', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let element: HTMLElement;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [TodoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);

    component = fixture.componentInstance;
    component.uuid = '123e4567-e89b-12d3-a456-426614174000';
    component.title = 'Test Todo';
    component.isCompleted = false;

    element = fixture.nativeElement;

    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('#toggleCompletionStatus should toggle the isCompleted property', () => {
    expect(component.isCompleted)
      .withContext('incomplete at first')
      .toBeFalsy();

    component.toggleCompletionStatus();
    expect(component.isCompleted)
      .withContext('complete after toggle')
      .toBeTruthy();

    component.toggleCompletionStatus();
    expect(component.isCompleted)
      .withContext('incomplete after second toggle')
      .toBeFalsy();
  });

  it('should change completion status when checkbox is clicked', async () => {
    const checkbox = await loader.getHarness(MatCheckboxHarness);

    expect(component.isCompleted)
      .withContext('incomplete at first')
      .toBeFalsy();

    await checkbox.toggle();
    expect(component.isCompleted)
      .withContext('complete after toggle')
      .toBeTruthy();

    await checkbox.toggle();
    expect(component.isCompleted)
      .withContext('incomplete after second toggle')
      .toBeFalsy();
  });
});

describe('TodoComponent with complete todo', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let element: HTMLElement;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [TodoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);

    component = fixture.componentInstance;
    component.uuid = '123e4567-e89b-12d3-a456-426614174000';
    component.title = 'Test Todo';
    component.isCompleted = true;

    element = fixture.nativeElement;

    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('#toggleCompletionStatus should toggle the isCompleted property', () => {
    expect(component.isCompleted).withContext('complete at first').toBeTruthy();

    component.toggleCompletionStatus();
    expect(component.isCompleted)
      .withContext('incomplete after toggle')
      .toBeFalsy();

    component.toggleCompletionStatus();
    expect(component.isCompleted)
      .withContext('complete after second toggle')
      .toBeTruthy();
  });

  it('should change completion status when checkbox is clicked', async () => {
    const checkbox = await loader.getHarness(MatCheckboxHarness);

    expect(component.isCompleted).withContext('complete at first').toBeTruthy();

    await checkbox.toggle();
    expect(component.isCompleted)
      .withContext('incomplete after toggle')
      .toBeFalsy();

    await checkbox.toggle();
    expect(component.isCompleted)
      .withContext('complete after second toggle')
      .toBeTruthy();
  });
});
