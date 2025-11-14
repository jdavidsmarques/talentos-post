import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Athlete } from '../../models/athlete.model';

@Component({
  selector: 'app-athlete-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './athlete-selector.component.html',
  styleUrls: ['./athlete-selector.component.css']
})
export class AthleteSelectorComponent {
  @Input() athletes: Athlete[] = [];
  @Input() selectedAthletes: string[] = [];

  @Output() toggleAthlete = new EventEmitter<string>();

  onToggleAthlete(id: string): void {
    const isDisabled = !this.selectedAthletes.includes(id) && this.selectedAthletes.length >= 8;
    if (!isDisabled) {
      this.toggleAthlete.emit(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedAthletes.includes(id);
  }

  isDisabled(id: string): boolean {
    return !this.isSelected(id) && this.selectedAthletes.length >= 8;
  }
}

