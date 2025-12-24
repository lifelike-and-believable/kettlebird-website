# Assets Directory

This directory contains all static assets for your website.

## Structure

- **images/** - Store all image files (PNG, JPG, SVG, etc.)
- **fonts/** - Custom web fonts
- **icons/** - Icons and favicon files

## Usage

### Images
Place your images in the `images/` folder and reference them in your HTML:
```html
<img src="assets/images/your-image.jpg" alt="Description">
```

### Fonts
Add custom fonts to the `fonts/` folder and import them in your CSS:
```css
@font-face {
    font-family: 'CustomFont';
    src: url('assets/fonts/custom-font.woff2') format('woff2');
}
```

### Icons
Store your favicon and other icons in the `icons/` folder.

## Best Practices

- Optimize images before adding them to reduce file size
- Use modern image formats (WebP) where possible
- Provide appropriate alt text for all images
- Use SVG for icons and logos when possible
