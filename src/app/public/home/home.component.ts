import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { NavComponent } from '../components/nav/nav.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendsColorComponent } from '../components/legendsColor/legendsColor.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CanvasComponent, NavComponent, LegendsColorComponent, NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  years: number[] = [];
  year: number = 2023;
  constructor(private route: ActivatedRoute, private router: Router) {
    const actualYear = +new Date().getFullYear();
    for (let i = 2023; i <= actualYear; i++) {
      this.years.push(i);
    }
    route.queryParams.subscribe((params) => {
      this.year = params['year'] || new Date().getFullYear();
    });
  }

  changeYear(event: any) {
    console.log('hola');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { year: event.target.value },
      queryParamsHandling: 'merge',
    });
  }
}
