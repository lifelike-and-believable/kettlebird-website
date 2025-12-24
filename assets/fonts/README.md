# Fonts

Place custom web fonts in this directory.

## Recommended Formats

Include multiple formats for cross-browser compatibility:
- **WOFF2** - Modern, compressed format (primary)
- **WOFF** - Fallback for older browsers
- **TTF/OTF** - Additional fallback

## Usage

Import fonts in your CSS file:

```css
@font-face {
    font-family: 'YourFont';
    src: url('assets/fonts/yourfont.woff2') format('woff2'),
         url('assets/fonts/yourfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
```

## Font Display

Use `font-display: swap` to ensure text remains visible during font loading.

## License Considerations

Ensure you have the proper license to use custom fonts on your website.
