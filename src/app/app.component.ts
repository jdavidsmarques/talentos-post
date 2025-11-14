import { Component, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('postTemplate', { static: false }) postTemplate!: ElementRef<HTMLElement>;
  
  athletes: Athlete[] = [...ATHLETES].sort((a, b) => a.name.localeCompare(b.name));
  selectedAthleteIds: string[] = [];
  isGenerating = false;
  showFullPreview = false;

  formData: PostData = {
    dateLocation: '16 NOV - PENELA, PORTUGAL',
    raceName: 'TRAIL\nPEDRA DA FERIDA',
    distance: '20K\nCURTO',
    athletes: []
  };

  constructor(private imageGeneratorService: ImageGeneratorService) {}

  get previewData(): PostData {
    const selectedAthletes = this.athletes
      .filter(a => this.selectedAthleteIds.includes(a.id))
      .map(a => ({ id: a.id, name: a.name, photo: a.photo }))
      .sort((a, b) => a.name.localeCompare(b.name));

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
      // Use the actual preview element to generate the image
      const previewWrapper = this.postTemplate?.nativeElement;
      const previewElement = previewWrapper?.querySelector('#post-template') as HTMLElement;
      const templateElement = previewWrapper?.querySelector('app-post-template') as HTMLElement;
      
      if (!previewElement) {
        throw new Error('Preview element not found');
      }

      // Store original transform
      const originalTransform = templateElement?.style.transform || '';
      
      // Remove scale transform temporarily for image generation (preview is scaled to 0.5)
      if (templateElement) {
        templateElement.style.transform = 'scale(1)';
      }

      // Wait a bit for the transform to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      const imageDataUrl = await this.imageGeneratorService.generatePostImageFromElement(previewElement);

      // Restore original transform
      if (templateElement) {
        templateElement.style.transform = originalTransform;
      }

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

  openFullPreview(): void {
    this.showFullPreview = true;
  }

  closeFullPreview(): void {
    this.showFullPreview = false;
  }
}

