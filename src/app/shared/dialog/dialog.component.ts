import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  Header: string;
  Message: string;
  Confirm: boolean;
  textType?: string;
  Callback: () => void;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  public header: string;
  public message: string;
  public confirm: boolean = false;
  public callback: () => void;

  validText: string = 'OK';
  invalidText: string = 'Cancel';

  type: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.header = data.Header;
    this.message = data.Message;
    this.confirm = data.Confirm;
    this.callback = data.Callback;
    this.type = data.textType ? data.textType : 'default';
  }

  ngOnInit(): void {
    if (this.type == 'alternative') {
      this.validText = 'Yes';
      this.invalidText = 'No';
    }
  }

  actionCallback(res: any): void {
    if (res && this.callback) this.callback();
    this.dialogRef.close(res);
  }
}
