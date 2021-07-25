import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public isActive = false;

  onBurgerClick() {
    this.isActive = !this.isActive;
  }
}
