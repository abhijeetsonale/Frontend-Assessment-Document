import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form.component';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.taskForm.get('title').value).toBe('');
    expect(component.taskForm.get('description').value).toBe('');
  });

  it('should validate required fields', () => {
    const titleControl = component.taskForm.get('title');
    titleControl.setValue('');
    expect(titleControl.valid).toBeFalsy();
    expect(titleControl.hasError('required')).toBeTruthy();

    titleControl.setValue('New Task');
    expect(titleControl.valid).toBeTruthy();
  });

  it('should emit new task on form submission', () => {
    spyOn(component.taskAdded, 'emit');

    component.taskForm.setValue({
      title: 'New Task',
      description: 'Task Description',
    });

    component.onSubmit();

    expect(component.taskAdded.emit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task Description',
    });
  });

  it('should reset form after submission', () => {
    component.taskForm.setValue({
      title: 'New Task',
      description: 'Task Description',
    });

    component.onSubmit();

    expect(component.taskForm.get('title').value).toBe('');
    expect(component.taskForm.get('description').value).toBe('');
  });

  it('should disable submit button when form is invalid', () => {
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    expect(submitButton.disabled).toBeTruthy();

    component.taskForm.setValue({
      title: 'New Task',
      description: 'Task Description',
    });
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();
  });
});

// function expect(component: TaskFormComponent) {
//   throw new Error('Function not implemented.');
// }
