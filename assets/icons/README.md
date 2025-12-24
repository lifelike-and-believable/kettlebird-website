# Icons

Place your website icons and favicon in this directory.

## Getting Started

**Note:** The `index.html` file references `favicon.ico` but this file is not included in the template. You'll need to add your own favicon files. The browser will gracefully handle the missing favicon without affecting functionality.

## Favicon

Create multiple sizes for different devices and contexts:

- `favicon.ico` - 16x16, 32x32 (legacy support)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` - 180x180 (iOS)
- `android-chrome-192x192.png` - Android
- `android-chrome-512x512.png` - Android

## Implementation

Add to your HTML `<head>`:

```html
<link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png">
```

## Icon Formats

- **ICO** - Traditional favicon format
- **PNG** - Modern, transparent icons
- **SVG** - Scalable vector icons

## Tools

Use favicon generators to create all necessary sizes:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)
