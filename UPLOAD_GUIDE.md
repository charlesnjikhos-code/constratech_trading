# How to Upload Images - Simple Guide

## For Non-Technical Users

### Step 1: Access the Upload Page
1. Open your website
2. Go to: `http://localhost:3000/admin.html` (or your website URL + `/admin.html`)
3. Enter password: `admin123` (you can change this in admin.js file)

### Step 2: Upload Your Images
1. **Choose Your Images:**
   - Click "Choose Files" button OR
   - Drag and drop images directly into the upload box
   
2. **Preview Your Images:**
   - See thumbnails of all selected images
   - Remove any image by clicking the X button

3. **Generate Code:**
   - Click "Generate Gallery Code" button
   - HTML code will appear below

### Step 3: Save Your Images
**Important:** You need to save the image files to your `img` folder:
- Right-click on each image file on your computer
- Copy the image
- Paste it into the `img` folder in your website directory

### Step 4: Add Code to Website
1. Click "Copy Code" button
2. Open your gallery.html file (or index.html)
3. Find the gallery section (look for `<div class="photo-gallery">`)
4. Paste the code inside
5. Save the file
6. Refresh your website to see the new images!

---

## Alternative Method: Using WordPress or CMS

If you want an even easier solution without touching code, consider:

### Option 1: Use Netlify CMS (Recommended)
- Free and easy to use
- Upload images through a web interface
- No coding required
- Automatically updates your website

### Option 2: Use ImgBB or Similar Services
1. Upload images to imgbb.com (free)
2. Copy the image URL
3. Use the admin panel to generate code
4. Replace local paths with ImgBB URLs

### Option 3: Hire Someone to Set Up
- Contact a freelancer on Fiverr ($20-50)
- They can set up a proper CMS for you
- One-time setup, easy ongoing use

---

## Changing the Admin Password

To change the password:
1. Open `admin.js` file
2. Find line 4: `const ADMIN_PASSWORD = 'admin123';`
3. Change `'admin123'` to your desired password
4. Save the file

Example:
```javascript
const ADMIN_PASSWORD = 'MySecurePassword123';
```

---

## Tips for Best Results

✅ **DO:**
- Use high-quality images (800-1200px wide)
- Use JPEG format for photos
- Name files clearly (project1.jpg, building2.jpg)
- Keep file sizes under 5MB

❌ **DON'T:**
- Use very large files (slow website)
- Use spaces in filenames
- Upload images directly from phone without renaming

---

## Need Help?

If you find this too technical, here are easier solutions:

1. **Instagram Embed:** Simply embed your Instagram feed
2. **Google Photos:** Share albums via link
3. **Hire a VA:** Virtual Assistant can do this for $5-10/month
4. **Use a Website Builder:** Wix, Squarespace, or WordPress.com (paid but much easier)

---

## Contact Technical Support

If you need help setting this up or want a fully automated solution:
- Email: support@constratechtrading.com
- Or contact a web developer to set up a proper CMS system

The admin panel provided here is a starting point. For full automation without any file copying, you would need:
- A backend server (Node.js, PHP, etc.)
- Database for storing images
- Automatic file upload handling

This would require professional setup but makes future updates much easier!
