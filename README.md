# Post Generator - Talentos Objetivos

Angular web application to generate social media post images (1080x1080px) with information about athletes in trail running races.

## Features

- ✏️ Edit race information (date, location, name, distance)
- 👥 Select up to 6 athletes from a predefined list
- 🎨 Generate image with custom layout (1080x1080px)
- 💾 Download generated image
- 👀 Preview before download

## Installation

1. Install dependencies:
```bash
npm install
```

2. Add visual resources:
   - Place athlete photos in `src/assets/athletes/` with the names:
     - `andreia-vicente.jpg`
     - `catarina-baptista.jpg`
     - `fatima-oliveira.jpg`
     - `isabel-baptista.jpg`
     - `kathryn-buisson.jpg`
     - `paula-monteiro.jpg`
     - `pedro-figueiredo.jpg`
   - Add sponsor logos in `src/assets/sponsors/` (optional)

3. Run in development:
```bash
npm start
```

4. Open in browser:
```
http://localhost:4200
```

## Project Structure

```
talentos-post/
├── src/
│   ├── app/               # Main component
│   ├── assets/           # Static resources
│   │   ├── athletes/     # Athlete photos
│   │   └── sponsors/     # Sponsor logos
│   ├── components/        # Angular components
│   ├── data/             # Athlete data
│   ├── models/           # TypeScript interfaces
│   ├── services/         # Angular services
│   ├── index.html        # Main HTML
│   ├── main.ts           # Application bootstrap
│   └── styles.css        # Global styles
└── package.json
```

## How to Use

1. Fill in race fields (distance, name, date, location)
2. Select athletes by clicking on their cards (maximum 6)
3. Click "Generate Image"
4. View the preview
5. Click "Download" to save the image

## Technologies

- Angular 17
- TypeScript
- HTML5 Canvas API

## Notes

- Athlete images should be in JPG or PNG format
- The layout automatically generates empty frames if less than 6 athletes are selected
- Generated image is always 1080x1080px (square format for Instagram)
