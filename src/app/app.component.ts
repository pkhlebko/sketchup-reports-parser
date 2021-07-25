import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  isActive = false;

  onBurgerClick() {
    this.isActive = !this.isActive;
    console.log(this.isActive)
  }
}
