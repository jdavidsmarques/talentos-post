import { Injectable } from '@angular/core';
import { PostData } from '../models/post-data.model';

// Import html2canvas dynamically
let html2canvas: any;

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {

  async generatePostImage(data: PostData): Promise<string> {
    // Load html2canvas dynamically
    if (!html2canvas) {
      html2canvas = (await import('html2canvas')).default;
    }
    // Create HTML structure
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '1080px';
    container.style.height = '1080px';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    // Create background image
    const bgImg = document.createElement('img');
    bgImg.src = 'assets/background.png';
    bgImg.style.position = 'absolute';
    bgImg.style.top = '0';
    bgImg.style.left = '0';
    bgImg.style.width = '100%';
    bgImg.style.height = '100%';
    bgImg.style.objectFit = 'cover';
    container.appendChild(bgImg);

    // Create athletes grid
    const grid = document.createElement('div');
    grid.style.position = 'relative';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = this.getGridColumns(data.athletes.length);
    grid.style.gridTemplateRows = this.getGridRows(data.athletes.length);
    grid.style.gap = '30px';
    grid.style.justifyContent = 'center';
    grid.style.alignContent = 'center';
    grid.style.width = '100%';
    grid.style.height = '100%';
    grid.style.zIndex = '1';

    data.athletes.forEach((athlete, index) => {
      const card = document.createElement('div');
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.background = '#0a1a2e';
      card.style.border = '2px solid rgba(255, 255, 255, 0.2)';
      card.style.borderRadius = '8px';
      card.style.overflow = 'hidden';
      card.style.width = '220px';
      card.style.height = '240px';

      // Special handling for 5 athletes: center the 2 athletes in the second row
      // Place them in columns 1 and 2 (of 3 columns) - use transform to center them
      if (data.athletes.length === 5 && index >= 3) {
        card.style.gridColumn = index === 3 ? '1' : '2';
        card.style.transform = 'translateX(125px)'; // (220px + 30px) / 2 to center 2 items
      }
      // Special handling for 7 athletes: center the 3 athletes in the second row
      // Place them in columns 1, 2, 3 (of 4 columns) - use transform to center them
      if (data.athletes.length === 7 && index >= 4) {
        const secondRowIndex = index - 4;
        card.style.gridColumn = `${secondRowIndex + 1}`; // Positions 1, 2, 3
        card.style.transform = 'translateX(125px)'; // (220px + 30px) / 2 to center 3 items
      }

      const photo = document.createElement('img');
      photo.src = athlete.photo;
      photo.style.width = '100%';
      photo.style.height = '180px';
      photo.style.objectFit = 'cover';
      card.appendChild(photo);

      const name = document.createElement('p');
      name.textContent = athlete.name;
      name.style.margin = '0';
      name.style.padding = '10px';
      name.style.color = '#ffffff';
      name.style.fontSize = '18px';
      name.style.fontWeight = 'bold';
      name.style.textAlign = 'center';
      name.style.fontFamily = 'Arial, sans-serif';
      card.appendChild(name);

      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Add distance
    const distance = document.createElement('div');
    distance.textContent = data.distance;
    distance.style.position = 'absolute';
    distance.style.bottom = '70px';
    distance.style.left = '70px';
    distance.style.color = '#ffffff';
    distance.style.fontSize = '80px';
    distance.style.fontWeight = 'bold';
    distance.style.fontFamily = 'Arial, sans-serif';
    distance.style.zIndex = '2';
    container.appendChild(distance);

    // Add race name
    const raceName = document.createElement('div');
    raceName.textContent = data.raceName.toUpperCase();
    raceName.style.position = 'absolute';
    raceName.style.bottom = '110px';
    raceName.style.left = '280px';
    raceName.style.color = '#ffffff';
    raceName.style.fontSize = '50px';
    raceName.style.fontWeight = 'bold';
    raceName.style.fontFamily = 'Arial, sans-serif';
    raceName.style.zIndex = '2';
    container.appendChild(raceName);

    // Add date location
    const dateLocation = document.createElement('div');
    dateLocation.textContent = data.dateLocation.toUpperCase();
    dateLocation.style.position = 'absolute';
    dateLocation.style.bottom = '60px';
    dateLocation.style.right = '340px';
    dateLocation.style.color = '#ffffff';
    dateLocation.style.fontSize = '32px';
    dateLocation.style.fontFamily = 'Arial, sans-serif';
    dateLocation.style.textAlign = 'right';
    dateLocation.style.zIndex = '2';
    container.appendChild(dateLocation);

    try {
      // Wait for images to load
      await this.waitForImages(container);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Generate image using html2canvas
      const canvas = await html2canvas(container, {
        width: 1080,
        height: 1080,
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      // Cleanup
      document.body.removeChild(container);

      return canvas.toDataURL('image/png');
    } catch (error) {
      // Cleanup on error
      if (container.parentNode) {
        document.body.removeChild(container);
      }
      throw error;
    }
  }

  private getGridColumns(count: number): string {
    if (count === 1) return '220px';
    if (count === 2) return 'repeat(2, 220px)';
    if (count <= 3) return 'repeat(3, 220px)';
    if (count === 4) return 'repeat(2, 220px)';
    if (count <= 6) return 'repeat(3, 220px)';
    if (count === 7) return 'repeat(4, 220px)';
    return 'repeat(4, 220px)'; // 8 athletes
  }

  private getGridRows(count: number): string {
    if (count <= 3) return '240px';
    if (count <= 6) return 'repeat(2, 240px)';
    return 'repeat(2, 240px)'; // 7-8 athletes
  }

  private async waitForImages(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if image fails
        setTimeout(() => resolve(), 5000); // Timeout after 5 seconds
      });
    });
    await Promise.all(promises);
  }
}
