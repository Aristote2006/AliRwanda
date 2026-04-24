# 🎨 AliRwanda Logo & Favicon Guide

## 📍 Quick Reference - Where to Find Logo Files

### Logo File Location
```
client/public/assets/images/
├── logo.svg          # Main logo with text (for Navbar, Footer)
├── logo-icon.svg     # Icon only (for favicon, mobile)
└── favicon.png       # PNG favicon (create from logo-icon.svg)
```

---

## 🔄 How to Replace with Your Custom Logo

### Option 1: Replace SVG Files (Recommended)

1. **Create your logo** in SVG format
2. **Save as** `logo.svg` (full logo with text)
3. **Save icon version** as `logo-icon.svg` (square icon, no text)
4. **Replace files** in: `client/public/assets/images/`

**No code changes needed!** The system will automatically use your new logos.

---

### Option 2: Use Image Files (PNG, JPG, WEBP)

1. **Save your logo image** to `client/public/assets/images/`
   - Example: `my-logo.png`
   
2. **Update Navbar** (`client/src/components/layout/Navbar.jsx`):
   ```javascript
   // Line 17 - Change this:
   const LOGO_SRC = '/assets/images/logo.svg'
   
   // To this:
   const LOGO_SRC = '/assets/images/my-logo.png'
   ```

3. **Update Footer** (`client/src/components/layout/Footer.jsx`):
   ```javascript
   // Line 6 - Change this:
   const LOGO_SRC = '/assets/images/logo.svg'
   
   // To this:
   const LOGO_SRC = '/assets/images/my-logo.png'
   ```

4. **Update Favicon** (`client/index.html`):
   ```html
   <!-- Line 7 - Change this: -->
   <link rel="icon" type="image/svg+xml" href="/assets/images/logo-icon.svg" />
   
   <!-- To this: -->
   <link rel="icon" type="image/png" href="/assets/images/my-favicon.png" />
   ```

---

## 📐 Logo Specifications

### Main Logo (logo.svg)
- **Format**: SVG (recommended), PNG, or WEBP
- **Size**: 400x120px (aspect ratio 10:3)
- **Background**: Transparent
- **Usage**: Navbar, Footer, About pages

### Logo Icon (logo-icon.svg)
- **Format**: SVG (recommended), PNG, or ICO
- **Size**: 100x100px (square)
- **Background**: Transparent or solid color
- **Usage**: Favicon, browser tab, mobile bookmarks

### Recommended Favicon Sizes
If using PNG, create these sizes:
- **16x16** - Browser tab (minimum)
- **32x32** - Browser tab (recommended)
- **48x48** - Desktop shortcuts
- **180x180** - Apple touch icon

---

## 🎨 Current Logo Design

### Colors Used
- **Primary Blue**: `#3B82F6` (Tailwind blue-500)
- **Dark Blue**: `#2563EB` (Tailwind blue-600)
- **Sun Yellow**: `#FBBF24` (Tailwind amber-400)
- **Text Dark**: `#1E293B` (Tailwind slate-800)
- **Text Gray**: `#64748B` (Tailwind slate-500)

### Design Elements
1. **Shopping Bag** - Represents e-commerce
2. **Sun Rays** - Represents Rwanda (Land of a Thousand Hills)
3. **Typography** - Modern, bold Inter font
4. **Tagline** - "SHOP SMART, LIVE BETTER"

---

## 🌐 Where Logos Appear

| Location | Logo Used | File |
|----------|-----------|------|
| Browser Tab | Icon | `logo-icon.svg` |
| Navbar (Desktop) | Full Logo | `logo.svg` |
| Navbar (Mobile) | Full Logo | `logo.svg` |
| Footer | Full Logo (white) | `logo.svg` |
| Bookmarks | Icon | `logo-icon.svg` |
| Social Sharing | Full Logo | `logo.svg` |

---

## 🛠️ Configuration Points

### 1. Navbar Logo
**File**: `client/src/components/layout/Navbar.jsx`  
**Line**: 17-18
```javascript
const LOGO_SRC = '/assets/images/logo.svg'
const LOGO_ICON_SRC = '/assets/images/logo-icon.svg'
```

### 2. Footer Logo
**File**: `client/src/components/layout/Footer.jsx`  
**Line**: 6
```javascript
const LOGO_SRC = '/assets/images/logo.svg'
```

### 3. Favicon
**File**: `client/index.html`  
**Line**: 7
```html
<link rel="icon" type="image/svg+xml" href="/assets/images/logo-icon.svg" />
```

### 4. Social Media Meta Tags
**File**: `client/index.html`  
**Line**: 27, 34
```html
<meta property="og:image" content="/assets/images/logo.svg" />
<meta property="twitter:image" content="/assets/images/logo.svg" />
```

---

## 💡 Pro Tips

### For Best Results:
1. **Use SVG format** - Scales perfectly at any size
2. **Keep file size small** - Under 50KB for fast loading
3. **Transparent background** - Works on any color
4. **Test on dark mode** - Ensure visibility in both themes
5. **Optimize for web** - Use tools like SVGOMG for SVG optimization

### Logo Design Tools:
- **Free**: Figma, Canva, Inkscape
- **Paid**: Adobe Illustrator, Sketch
- **Online**: LogoMaker, Hatchful

### Converting Logo to Favicon:
1. Use [favicon.io](https://favicon.io)
2. Use [realfavicongenerator.net](https://realfavicongenerator.net)
3. Upload your logo, download all sizes

---

## 🔍 Testing Your Logo

After updating, check these locations:

- [ ] Browser tab shows favicon
- [ ] Navbar displays logo correctly
- [ ] Footer shows logo (white version)
- [ ] Mobile responsive (logo doesn't overflow)
- [ ] Dark mode (logo visible on dark background)
- [ ] Social sharing preview (Facebook, Twitter)
- [ ] Bookmarks on mobile devices

---

## 📱 Social Media Preview

When someone shares your website, they'll see:

**Title**: AliRwanda - Shop Smart, Live Better  
**Description**: Modern Rwandan eCommerce Platform  
**Image**: Your logo (from og:image meta tag)

Update these in `client/index.html` lines 22-34.

---

## 🚀 Quick Update Checklist

To change your logo:

1. [ ] Create new logo files
2. [ ] Save to `client/public/assets/images/`
3. [ ] Update file paths in Navbar.jsx (if needed)
4. [ ] Update file paths in Footer.jsx (if needed)
5. [ ] Update favicon in index.html (if format changed)
6. [ ] Test in browser (clear cache: Ctrl+Shift+R)
7. [ ] Test on mobile
8. [ ] Test dark mode
9. [ ] Build for production: `npm run build`

---

## 🆘 Troubleshooting

### Logo Not Showing?
1. **Clear browser cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check file path**: Should start with `/assets/images/`
3. **Check file exists**: Open in browser: `http://localhost:3000/assets/images/logo.svg`
4. **Check console**: Look for 404 errors in DevTools

### Favicon Not Updating?
1. **Hard refresh**: Ctrl+Shift+R
2. **Close and reopen browser**
3. **Try incognito/private mode**
4. **Check index.html** has correct path

### Logo Looks Blurry?
- Use SVG format instead of PNG
- If using PNG, use at least 2x the display size
- Example: For 40px height, use 80px PNG

---

## 📞 Need Help?

If you need to customize further:
- Check the comments in code (marked with `===== LOGO CONFIGURATION =====`)
- All configurable points are clearly labeled
- Logo files are centralized in one location

**Happy branding! 🎨**
