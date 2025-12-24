# Website Builder Template

This repository serves as a template for creating website repositories, providing a ready-made basic structure and specialized coding agents to assist in the development process.

## Purpose

Use this template as a starting point for new website projects. It provides:

- **Basic Structure**: A foundational repository structure to organize your website project
- **AI-Powered Coding Agents**: Specialized agents designed to assist with different aspects of web development

## Coding Agents

This template includes three specialized coding agents located in the `.github/agents/` directory:

1. **Project Manager** - Assists with iterative web development workflows, milestone planning, and stakeholder feedback integration
2. **Web Designer** - Specializes in modern, accessible, and visually stunning web interfaces with motion design and responsive layouts
3. **Web Programmer** - Expert in modern JavaScript/TypeScript, performant architectures, and production-grade interactive web applications

These agents are configured to work together to streamline your website development process.

## Getting Started

1. Click "Use this template" to create a new repository based on this template
2. Clone your new repository to your local machine
3. Start building your website with the assistance of the included coding agents
4. The agents in `.github/agents/` are automatically available when using GitHub Copilot Workspace or compatible AI development tools

## Structure

```
.
├── .github/
│   └── agents/          # Specialized coding agent configurations
├── assets/              # Static assets (images, fonts, icons)
│   ├── fonts/          # Custom web fonts
│   ├── icons/          # Icons and favicons
│   └── images/         # Image files
├── css/                 # Stylesheets
│   ├── main.css        # Main stylesheet with CSS variables
│   └── reset.css       # CSS reset/normalize
├── docs/                # Additional documentation
│   ├── DEVELOPMENT.md  # Development guide
│   └── README.md       # Documentation overview
├── js/                  # JavaScript files
│   └── main.js         # Main JavaScript with utilities
├── .gitignore           # Git ignore rules
├── index.html           # Main HTML page
├── LICENSE              # MIT License
├── package.json         # Project metadata and scripts
└── README.md            # This file
```

## Quick Start

1. **Clone or Use This Template**
   ```bash
   # Click "Use this template" on GitHub, or clone directly
   git clone <your-repository-url>
   cd <your-repository-name>
   ```

2. **View the Website**
   - **Simple**: Open `index.html` in your browser
   - **With Live Server**: Run `npm run dev` (requires Node.js)
   - **With Python**: Run `python -m http.server 8080`

3. **Customize**
   - Edit `index.html` for content
   - Modify `css/main.css` for styling (uses CSS variables for easy theming)
   - Add functionality in `js/main.js`
   - Place images, fonts, and icons in the `assets/` directory

4. **Deploy**
   - Upload the entire project to your web hosting
   - Use GitHub Pages, Netlify, Vercel, or any static hosting service

## Features

### HTML Structure
- Semantic HTML5 markup
- Responsive meta tags
- Accessible navigation
- Pre-built sections: Hero, About, Services, Contact
- Contact form with validation

### CSS
- Modern CSS with custom properties (CSS variables)
- Responsive design with mobile-first approach
- CSS reset for cross-browser consistency
- BEM-inspired naming conventions
- Smooth transitions and hover effects
- Pre-configured color scheme and typography

### JavaScript
- Smooth scrolling navigation
- Contact form handling
- Modular function organization
- Utility functions (debounce)
- Ready for expansion

### Assets Organization
- Structured folders for images, fonts, and icons
- README files in each directory with usage guidelines
- Optimized for web performance

## Customization

### Colors and Theming
Edit CSS variables in `css/main.css`:
```css
:root {
    --color-primary: #3498db;    /* Change primary color */
    --color-secondary: #2ecc71;  /* Change secondary color */
    --font-primary: /* Your font */;
    /* ... more variables */
}
```

### Adding Pages
Create new HTML files in the root directory following the structure of `index.html`.

### Adding Styles
Add component-specific styles to `css/main.css` or create new CSS files and link them in your HTML.

## Documentation

For detailed development instructions, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

See the [LICENSE](LICENSE) file for details.