import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostData } from '../../models/post-data.model';

@Component({
  selector: 'app-post-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-template.component.html',
  styleUrls: ['./post-template.component.css']
})
export class PostTemplateComponent {
  @Input() data!: PostData;

  getGridColumn(index: number): string {
    const count = this.data.athletes.length;
    let cols: number;
    
    if (count === 1) cols = 1;
    else if (count === 2) cols = 2;
    else if (count <= 3) cols = 3;
    else if (count === 4) cols = 2;
    else if (count <= 6) cols = 3;
    else cols = 4; // 7-8 athletes
    
    const col = index % cols;
    
    // Special handling for 5 athletes: center the 2 athletes in the second row
    // Place them in columns 1 and 2 (of 3 columns) - CSS transform will center them
    if (count === 5 && index >= 3) {
      return index === 3 ? '1' : '2'; // First athlete in column 1, second in column 2
    }
    
    // Special handling for 7 athletes: center the 3 athletes in the second row
    // Place them in columns 1, 2, 3 (of 4 columns) - CSS will handle centering
    if (count === 7 && index >= 4) {
      const secondRowIndex = index - 4;
      return `${secondRowIndex + 1}`; // Positions 1, 2, 3
    }
    
    return `${col + 1}`;
  }

  getGridRow(index: number): string {
    const count = this.data.athletes.length;
    let cols: number;
    
    if (count === 1) cols = 1;
    else if (count === 2) cols = 2;
    else if (count <= 3) cols = 3;
    else if (count === 4) cols = 2;
    else if (count <= 6) cols = 3;
    else cols = 4; // 7-8 athletes
    
    const row = Math.floor(index / cols);
    return `${row + 1}`;
  }
}

