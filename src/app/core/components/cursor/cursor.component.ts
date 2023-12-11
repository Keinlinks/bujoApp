import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CursorService } from '../../services/cursor.service';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngStyle]="{ 'background-color': backgroundColor }"></div>`,
  styleUrls: ['./cursor.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CursorComponent implements OnInit {
  constructor(
    private cursor: CursorService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.cursor.getSelected().subscribe((color) => {
      this.backgroundColor = color;
    });
  }
  backgroundColor: string = '';

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const nativeElement = this.el.nativeElement;
    const offset = 11; // Ajusta según tus necesidades

    this.renderer.setStyle(
      nativeElement,
      'left',
      `${event.clientX + offset}px`
    );
    this.renderer.setStyle(nativeElement, 'top', `${event.clientY + offset}px`);
  }
}
