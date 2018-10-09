import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@app/core';
import { TestingModule } from '@testing/utils';

import { UserDashboardComponent } from './user-dashboard.component';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;

  beforeEach(
    fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestingModule, CoreModule],
        declarations: [UserDashboardComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(UserDashboardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
