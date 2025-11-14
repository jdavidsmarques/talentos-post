import { Injectable } from '@angular/core';
import { PostData } from '../models/post-data.model';

// Import html2canvas dynamically
let html2canvas: any;

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {

  async generatePostImageFromElement(element: HTMLElement): Promise<string> {
    // Load html2canvas dynamically
    if (!html2canvas) {
      html2canvas = (await import('html2canvas')).default;
    }

    try {
      // Wait for images to load
      await this.waitForImages(element);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Generate image using html2canvas from the actual preview element
      const canvas = await html2canvas(element, {
        width: 1080,
        height: 1080,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        windowWidth: 1080,
        windowHeight: 1080
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      throw error;
    }
  }

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
      card.style.position = 'relative';
      
      // Add gradient overlay
      const gradientOverlay = document.createElement('div');
      gradientOverlay.style.position = 'absolute';
      gradientOverlay.style.top = '0';
      gradientOverlay.style.left = '0';
      gradientOverlay.style.width = '100%';
      gradientOverlay.style.height = '100%';
      gradientOverlay.style.background = 'linear-gradient(to bottom, #325052 0%, transparent 100%)';
      gradientOverlay.style.pointerEvents = 'none';
      gradientOverlay.style.zIndex = '1';
      card.appendChild(gradientOverlay);

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
      photo.style.position = 'relative';
      photo.style.zIndex = '0';
      photo.style.maskImage = 'linear-gradient(to top, transparent 0%, rgba(0,0,0,1) 30%)';
      photo.style.webkitMaskImage = 'linear-gradient(to top, transparent 0%, rgba(0,0,0,1) 30%)';
      card.insertBefore(photo, gradientOverlay);

      const name = document.createElement('p');
      name.textContent = athlete.name;
      name.style.margin = '0';
      name.style.padding = '10px';
      name.style.color = '#ffffff';
      name.style.fontSize = '18px';
      name.style.fontWeight = 'bold';
      name.style.textAlign = 'center';
      name.style.fontFamily = 'Cunia, Arial, sans-serif';
      name.style.position = 'relative';
      name.style.zIndex = '2';
      card.appendChild(name);

      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Create race info container
    const raceInfoContainer = document.createElement('div');
    raceInfoContainer.style.position = 'absolute';
    raceInfoContainer.style.bottom = '50px';
    raceInfoContainer.style.left = '60px';
    raceInfoContainer.style.right = '60px';
    raceInfoContainer.style.display = 'flex';
    raceInfoContainer.style.alignItems = 'flex-end';
    raceInfoContainer.style.justifyContent = 'space-between';
    raceInfoContainer.style.gap = '30px';
    raceInfoContainer.style.zIndex = '2';

    // Add distance with support for two lines
    const distance = document.createElement('div');
    distance.style.color = 'transparent';
    distance.style.fontWeight = 'bold';
    distance.style.fontFamily = 'Arial, sans-serif';
    distance.style.fontStyle = 'italic';
    distance.style.whiteSpace = 'pre-line';
    distance.style.flexShrink = '0';
    distance.style.lineHeight = '1.2';
    
    const distanceLines = data.distance.split('\n');
    if (distanceLines.length === 1) {
      // Single line
      distance.style.webkitTextStroke = '3px #EEFC5E';
      distance.style.fontSize = '100px';
      distance.textContent = distanceLines[0];
    } else if (distanceLines.length >= 2) {
      // Two lines - first line full size, second line half size
      const line1 = document.createElement('div');
      line1.textContent = distanceLines[0];
      line1.style.webkitTextStroke = '3px #EEFC5E';
      line1.style.fontSize = '100px';
      line1.style.display = 'block';
      distance.appendChild(line1);
      
      const line2 = document.createElement('div');
      line2.textContent = distanceLines[1];
      line2.style.webkitTextStroke = '1.5px #EEFC5E';
      line2.style.fontSize = '50px';
      line2.style.display = 'block';
      distance.appendChild(line2);
    }
    
    raceInfoContainer.appendChild(distance);

    // Add race name
    const raceName = document.createElement('div');
    raceName.textContent = data.raceName.toUpperCase();
    raceName.style.color = '#EEFC5E';
    raceName.style.fontSize = '50px';
    raceName.style.fontWeight = 'bold';
    raceName.style.fontFamily = 'Arial, sans-serif';
    raceName.style.whiteSpace = 'pre-line';
    raceName.style.lineHeight = '1.2';
    raceName.style.wordWrap = 'break-word';
    raceName.style.textAlign = 'left';
    raceName.style.fontStyle = 'italic';
    raceName.style.flex = '1';
    raceName.style.minWidth = '0';
    raceName.style.maxWidth = '700px';
    raceInfoContainer.appendChild(raceName);

    // Add date location
    const dateLocation = document.createElement('div');
    dateLocation.textContent = data.dateLocation.toUpperCase();
    dateLocation.style.fontStyle = 'italic';
    dateLocation.style.color = '#93A957';
    dateLocation.style.fontSize = '32px';
    dateLocation.style.fontFamily = 'Arial, sans-serif';
    dateLocation.style.textAlign = 'right';
    dateLocation.style.whiteSpace = 'nowrap';
    dateLocation.style.flexShrink = '0';
    raceInfoContainer.appendChild(dateLocation);

    container.appendChild(raceInfoContainer);

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
