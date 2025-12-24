# Development Guide

## Getting Started

### Prerequisites

- A modern web browser
- A text editor or IDE
- (Optional) Node.js for running a local development server

### Running Locally

#### Option 1: Simple File Opening
Simply open `index.html` in your web browser.

#### Option 2: Using Node.js (Recommended)

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

This will start a local server at `http://localhost:8080` with live reload.

#### Option 3: Using Python

If you have Python installed:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

## Project Structure

```
.
├── assets/           # Static assets
│   ├── fonts/       # Custom fonts
│   ├── icons/       # Icons and favicons
│   └── images/      # Images
├── css/             # Stylesheets
│   ├── main.css    # Main styles
│   └── reset.css   # CSS reset/normalize
├── docs/            # Documentation
├── js/              # JavaScript files
│   └── main.js     # Main JavaScript
├── .gitignore       # Git ignore rules
├── index.html       # Main HTML file
├── LICENSE          # License file
├── package.json     # Project metadata
└── README.md        # Project documentation
```

## Development Workflow

1. **Edit HTML**: Modify `index.html` to change page structure
2. **Style Changes**: Update `css/main.css` for styling modifications
3. **JavaScript**: Add functionality in `js/main.js`
4. **Assets**: Add images, fonts, and icons to the `assets/` directory
5. **Test**: View changes in your browser
6. **Commit**: Use git to track your changes

## CSS Architecture

### CSS Variables
The project uses CSS custom properties (variables) for theming. Modify colors, spacing, and typography in the `:root` selector in `css/main.css`.

### BEM Methodology
The CSS follows a modified BEM (Block Element Modifier) naming convention:
- Block: `.nav`
- Element: `.nav__link`
- Modifier: `.nav__link--active`

### Responsive Design
Media queries are defined at the bottom of `css/main.css`. The default breakpoint is 768px for mobile devices.

## JavaScript Organization

- `initNavigation()`: Handles smooth scrolling and navigation interactions
- `initContactForm()`: Manages form submission
- `debounce()`: Utility function for performance optimization

Add your custom functions following the same pattern.

## Best Practices

### HTML
- Use semantic HTML5 elements
- Include proper meta tags
- Ensure accessibility with ARIA labels where needed
- Validate HTML using [W3C Validator](https://validator.w3.org/)

### CSS
- Follow the existing naming conventions
- Use CSS variables for consistent theming
- Keep specificity low
- Mobile-first approach for responsive design
- Use flexbox and grid for layouts

### JavaScript
- Write modular, reusable functions
- Use event delegation where appropriate
- Avoid global variables
- Comment complex logic
- Handle errors gracefully

### Performance
- Optimize images before adding them
- Minimize HTTP requests
- Use CSS instead of JavaScript for animations when possible
- Lazy load images below the fold

### Accessibility
- Use proper heading hierarchy (h1-h6)
- Include alt text for all images
- Ensure sufficient color contrast
- Make interactive elements keyboard accessible
- Test with screen readers

## Browser Support

This template supports:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Troubleshooting

### Styles Not Loading
- Check file paths in `index.html`
- Ensure you're using a local server (not just opening the HTML file)
- Clear browser cache

### JavaScript Not Working
- Check browser console for errors
- Ensure scripts are loaded after the DOM
- Verify file paths

### Images Not Displaying
- Verify image paths are correct
- Check image file extensions
- Ensure images are in the `assets/images/` directory

## Next Steps

- Customize colors and fonts in `css/main.css`
- Replace placeholder content in `index.html`
- Add your own images to `assets/images/`
- Expand functionality in `js/main.js`
- Add additional pages as needed
