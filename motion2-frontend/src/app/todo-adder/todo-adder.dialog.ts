import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-todo-adder-dialog',
  templateUrl: 'todo-adder.dialog.html',
})
export class TodoAdderDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<TodoAdderDialog>
  ) {}

  add() {
    this.dialogRef.close({ title: this.data.title, added: true });
  }

  cancel() {
    this.dialogRef.close({ title: this.data.title, added: false });
  }
}
