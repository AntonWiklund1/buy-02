import { Component, OnInit, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Buy';

  showNavBar: boolean = true;
  showWelcome: boolean = true;
  constructor(private router: Router) { }

  ngOnInit() {


    if (isDevMode()) {
      console.log('Development!');
    } else {
      console.log('Production!');
    }



    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Exclude the login component from showing the navbar
        this.showNavBar = !event.url.includes('/logIn');
      }
      if (event instanceof NavigationEnd) {
        // Exclude the signup component from showing the navbar
        this.showWelcome = event.url === '/'
      }
    });
  }
}
