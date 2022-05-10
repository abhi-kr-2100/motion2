import { Component, Inject } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-todo-adder-dialog',
  templateUrl: './todo-adder-dialog.component.html',
  styleUrls: ['./todo-adder-dialog.component.less'],
})
export class TodoAdderDialog {
  constructor(
    public dialogRef: MatDialogRef<TodoAdderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
