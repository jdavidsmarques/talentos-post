import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageGeneratorService } from '../services/image-generator.service';
import { PostData } from '../models/post-data.model';
import { Athlete } from '../models/athlete.model';
import { ATHLETES } from '../data/athletes.data';
import { AthleteSelectorComponent } from '../components/athlete-selector/athlete-selector.component';
import { PostTemplateComponent } from '../components/post-template/post-template.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AthleteSelectorComponent, PostTemplateComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  athletes: Athlete[] = ATHLETES;
  selectedAthleteIds: string[] = [];
  isGenerating = false;

  formData: PostData = {
    dateLocation: '16 NOV - PENELA, PORTUGAL',
    raceName: 'TRAIL DA PEDRA FERIDA',
    distance: '20K',
    athletes: []
  };

  constructor(private imageGeneratorService: ImageGeneratorService) {}

  get previewData(): PostData {
    const selectedAthletes = this.athletes
      .filter(a => this.selectedAthleteIds.includes(a.id))
      .map(a => ({ id: a.id, name: a.name, photo: a.photo }));

    return {
      ...this.formData,
      athletes: selectedAthletes
    };
  }

  onToggleAthlete(id: string): void {
    if (this.selectedAthleteIds.includes(id)) {
      this.selectedAthleteIds = this.selectedAthleteIds.filter(aid => aid !== id);
    } else if (this.selectedAthleteIds.length < 8) {
      this.selectedAthleteIds = [...this.selectedAthleteIds, id];
    }
  }

  async onDownload(): Promise<void> {
    if (this.selectedAthleteIds.length === 0) return;

    this.isGenerating = true;
    try {
      const imageDataUrl = await this.imageGeneratorService.generatePostImage(this.previewData);

      const link = document.createElement('a');
      link.download = `post-${this.formData.raceName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = imageDataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Check the console for more details.');
    } finally {
      this.isGenerating = false;
    }
  }

  canDownload(): boolean {
    return !this.isGenerating && this.selectedAthleteIds.length > 0;
  }
}

