import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: 'snackbar-ribon',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}
