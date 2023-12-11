import { CommonModule, NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FirstLetterUpperPipe } from 'src/app/core/pipes/firstLetterUpper.pipe';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgFor, FirstLetterUpperPipe, NgClass],
  templateUrl: `./nav.component.html`,
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  monthIndex: number = 0;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.monthIndex = +params['month'] || 0;
    });
  }
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  clickNav(month: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { month: month },
      queryParamsHandling: 'merge',
    });
  }
}
