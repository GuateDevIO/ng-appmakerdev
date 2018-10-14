import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserFacade } from '../../core/auth-fire/auth-fire.facade';
import { User } from '../../core/auth-fire/auth-fire.model';

@Component({
  selector: 'amds-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  // Based on the screen size, switch from standard to one column per row
  cards = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map(state => {
        if (state.matches) {
          Object.keys(state.matches).forEach(key => {
            console.log(`key: ${key}, value: ${state.matches[key]}`);
            const breakpointKey = key === '(max-width: 599px)' ? true : false;
            const breakpointActivated = state.breakpoints[key];

            if (breakpointKey && breakpointActivated) {
              console.log('X SMALL SCREEN = TRUE.!!!');

              return [
                { title: 'My Apps', cols: 6, rows: 1 },
                { title: 'Training', cols: 6, rows: 1 },
                { title: 'Need help?', cols: 6, rows: 1 },
                { title: 'Card 1', cols: 6, rows: 1 },
                { title: 'Card 2', cols: 6, rows: 1 },
                { title: 'Card 3', cols: 6, rows: 1 },
                { title: 'Card 4', cols: 6, rows: 1 }
              ];
            } else {
              return [
                { title: 'My Apps', cols: 3, rows: 2 },
                { title: 'Training', cols: 3, rows: 2 },
                { title: 'Need help?', cols: 6, rows: 1 },
                { title: 'Card 1', cols: 6, rows: 2 },
                { title: 'Card 2', cols: 6, rows: 1 },
                { title: 'Card 3', cols: 6, rows: 1 },
                { title: 'Card 4', cols: 6, rows: 1 }
              ];
            }
          });
        }

        return [
          { title: 'My Apps', cols: 2, rows: 2 },
          { title: 'Training', cols: 2, rows: 2 },
          { title: 'Need help?', cols: 2, rows: 2 },
          { title: 'Card 1', cols: 6, rows: 2 },
          { title: 'Card 2', cols: 4, rows: 1 },
          { title: 'Card 3', cols: 2, rows: 2 },
          { title: 'Card 4', cols: 4, rows: 1 }
        ];
      })
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserFacade
  ) {}

  ngOnInit() {
    console.log('teserer');
  }

  goSignUp() {
    this.router.navigate(['account/register']);
  }
}
