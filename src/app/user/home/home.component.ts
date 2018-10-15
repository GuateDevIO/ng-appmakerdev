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
  cards = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
    map(state => {
      if (state.matches) {
        return [
          { id: 'a', title: 'My Apps', cols: 4, rows: 1 },
          { id: 'b', title: 'Training', cols: 4, rows: 1 },
          { id: 'c', title: 'Resources', cols: 4, rows: 1 },
          { id: 'd', title: 'Need help?', cols: 4, rows: 1 },

          { id: 'e', title: 'Card 1', cols: 4, rows: 2 },
          { id: 'f', title: 'Card 2', cols: 4, rows: 1 },
          { id: 'g', title: 'Card 3', cols: 4, rows: 1 },
          { id: 'h', title: 'Card 4', cols: 4, rows: 1 }
        ];
      }

      return [
        { id: 'a', title: 'My Apps', cols: 2, rows: 1 },
        { id: 'b', title: 'Training', cols: 2, rows: 1 },
        { id: 'c', title: 'Resources', cols: 2, rows: 1 },
        { id: 'd', title: 'Need help?', cols: 2, rows: 1 },

        { id: 'e', title: 'Card 1', cols: 4, rows: 2 },
        { id: 'f', title: 'Card 2', cols: 4, rows: 1 },
        { id: 'g', title: 'Card 3', cols: 2, rows: 2 },
        { id: 'h', title: 'Card 4', cols: 4, rows: 1 }
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
