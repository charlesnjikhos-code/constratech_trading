# Constratech Trading CMS - Frequently Asked Questions (FAQ)

## 📚 Table of Contents
- [Getting Started](#getting-started)
- [Login & Access](#login--access)
- [Content Management](#content-management)
- [Image Upload](#image-upload)
- [Portfolio Management](#portfolio-management)
- [Troubleshooting](#troubleshooting)
- [Advanced](#advanced)

---

## Getting Started

### Q: What is the CMS?
**A:** The CMS (Content Management System) is a web-based admin panel that lets you edit all your website content without touching any code. You can update text, images, services, portfolio items, and more.

### Q: What do I need to use the CMS?
**A:** You need:
- XAMPP running (Apache and MySQL services)
- A web browser (Chrome, Firefox, Edge)
- Your login credentials
- Internet connection (for icons and fonts)

### Q: Where is the CMS located?
**A:** The CMS is accessed at: `http://localhost/constratech_trading/cms-login.html`

---

## Login & Access

### Q: What are the default login credentials?
**A:** 
- **Username:** `admin`
- **Password:** `constratech2025`

⚠️ **IMPORTANT:** Change these credentials after first login for security!

### Q: How do I change my password?
**A:** Currently passwords are stored in the database. To change:
1. Contact your developer, OR
2. Run this MySQL command (replace `newpassword` with your desired password):
```sql
UPDATE admin_users 
SET password_hash = PASSWORD('newpassword') 
WHERE username = 'admin';
```

### Q: I forgot my password, what do I do?
**A:** Run this command in MySQL to reset to default:
```sql
UPDATE admin_users 
SET password_hash = '$2y$10$PbONpiQu0PJTn0Hfe1zbJuZwRvLQF2XvnxjhEgs198brJvQ/2/KxK' 
WHERE username = 'admin';
```
Then login with password: `constratech2025`

### Q: Can I login from a different computer?
**A:** Yes, if the computer is on the same network. Replace `localhost` with your computer's IP address:
`http://YOUR_IP_ADDRESS/constratech_trading/cms-login.html`

### Q: Why can't I login?
**A:** Check these:
1. Is XAMPP running? (Both Apache and MySQL must be green)
2. Are you using the correct credentials?
3. Clear your browser cache and try again
4. Check browser console (F12) for error messages

---

## Content Management

### Q: How do I save my changes?
**A:** Click the blue "Save" button at the bottom of each section. Changes are saved to the database and appear on the website immediately.

### Q: Can I undo changes?
**A:** No automatic undo feature. Always review before clicking Save. Best practice: Take screenshots before major changes.

### Q: Do changes appear immediately on the website?
**A:** Yes! Once you click Save, refresh your website to see the changes.

### Q: What sections can I edit?
**A:** You can edit:
- **Company Info:** Name, tagline, contact details, logo
- **Hero Section:** Main banner text, images, buttons
- **About Section:** Company story, features, images
- **Services:** All service offerings
- **Portfolio:** Projects and gallery images
- **Testimonials:** Customer reviews
- **Contact Info:** Phone, email, address, map
- **Footer:** Social media links, copyright text

### Q: How many services can I add?
**A:** Unlimited! Click "Add Service" to create new ones.

### Q: Can I reorder services or portfolio items?
**A:** Yes, the display order is set by the order you save them. The first item is displayed first.

---

## Image Upload

### Q: How do I upload images?
**A:** 
1. Navigate to the section (e.g., Portfolio)
2. Click the **"Upload Image"** button
3. Select your image file (JPG, PNG, GIF, or WebP)
4. Wait for upload confirmation
5. Image path will auto-fill
6. Click "Save" to apply changes

### Q: What image formats are supported?
**A:** Supported formats:
- JPEG/JPG
- PNG
- GIF
- WebP

### Q: What's the maximum file size?
**A:** **5MB per image**. Compress large images before uploading.

### Q: Where are uploaded images stored?
**A:** All uploaded images are saved in the `uploads/` folder with unique filenames.

### Q: Can I use images from my `img/` folder?
**A:** Yes! You can manually type image paths like `img/myimage.jpg` in the image path field. But uploading is recommended for better organization.

### Q: Why is my uploaded image not showing?
**A:** Check these:
1. Did you click "Save" after uploading?
2. Refresh your website page (Ctrl+F5)
3. Check browser console for errors (F12)
4. Verify the image uploaded (check `uploads/` folder)
5. Make sure XAMPP Apache is running

### Q: Can I delete uploaded images?
**A:** Yes, but you need to:
1. Remove the portfolio/content item using that image in CMS
2. Manually delete the file from the `uploads/` folder via FTP or file explorer

### Q: How do I compress images before uploading?
**A:** Use free online tools:
- TinyPNG (tinypng.com)
- Compressor.io
- ImageOptim (Mac)
- Or resize in Paint/Photoshop to 1920px max width

---

## Portfolio Management

### Q: How do I add a new portfolio project?
**A:**
1. Login to CMS
2. Click **"Portfolio"** in sidebar
3. Click **"Add Project"** button
4. Click **"Upload Image"** and select your image
5. Fill in Category, Title, Description
6. Click **"Save Portfolio"**

### Q: What's a Featured Project?
**A:** The Featured Project is displayed prominently on your homepage. It's larger than other projects. You should use your best/most important project here.

### Q: How many portfolio items can I have?
**A:** Unlimited! But the homepage shows only the first 6 items. All items appear on the gallery page.

### Q: Can I organize projects by category?
**A:** Yes! Enter categories like:
- Construction
- Solar Installation
- Drilling
- Excavation
- Infrastructure
(Categories appear as tags on the website)

### Q: How do I remove a project?
**A:** Click the red "Remove" or trash icon button next to the project, then click "Save Portfolio".

### Q: Why aren't my portfolio images appearing on the website?
**A:** 
1. Make sure you clicked "Save Portfolio"
2. The project must be uploaded (not just using placeholder paths)
3. Refresh your website with Ctrl+F5
4. Check that the image exists in the `uploads/` folder

---

## Troubleshooting

### Q: The CMS is loading but nothing happens when I click buttons
**A:** 
1. Check browser console (F12) for JavaScript errors
2. Clear browser cache (Ctrl+Shift+Delete)
3. Make sure JavaScript is enabled
4. Try a different browser

### Q: I get "Failed to save" error
**A:**
1. Check MySQL is running in XAMPP
2. Verify database connection in `api/config.php`
3. Check browser console for specific error
4. Ensure `api/` folder has proper permissions

### Q: Images show in CMS but not on website
**A:**
1. Hard refresh website (Ctrl+F5)
2. Check image paths don't have typos
3. Verify images exist in `uploads/` folder
4. Check browser console for 404 errors
5. Ensure Apache is running

### Q: Changes aren't saving
**A:**
1. Click the correct "Save" button for that section
2. Wait for success message
3. Check MySQL is running
4. Look for error messages in browser console

### Q: "Session expired" or logged out automatically
**A:** This is normal after inactivity. Just login again. Sessions expire after a set time for security.

### Q: CMS is very slow
**A:**
1. Close other programs using CPU/RAM
2. Check XAMPP isn't overloaded
3. Restart XAMPP services
4. Clear browser cache
5. Check if many large images are in database

---

## Advanced

### Q: Can I add more admin users?
**A:** Yes! Insert into the `admin_users` table:
```sql
INSERT INTO admin_users (username, password_hash, email, full_name) 
VALUES ('newuser', '$2y$10$...', 'email@example.com', 'Full Name');
```
(Generate password hash using PHP's `password_hash()` function)

### Q: How do I backup my content?
**A:**
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `constratech_cms` database
3. Click "Export"
4. Choose "Quick" export method
5. Click "Go" to download SQL file
6. Also backup the `uploads/` folder

### Q: How do I restore from backup?
**A:**
1. Open phpMyAdmin
2. Select `constratech_cms` database
3. Click "Import"
4. Choose your `.sql` backup file
5. Click "Go"
6. Restore `uploads/` folder files

### Q: Can I customize the CMS appearance?
**A:** Yes! Edit `cms-admin.css` to change colors, fonts, layout. Colors are defined in CSS variables at the top of the file.

### Q: Where is the database configuration?
**A:** In `api/config.php`. Default settings:
- Host: localhost
- Database: constratech_cms
- Username: root
- Password: (empty)

### Q: Can I use this on a live server?
**A:** Yes! Upload all files to your web hosting, import the database, and update `api/config.php` with your hosting's database credentials.

### Q: How do I add new sections to the CMS?
**A:** This requires PHP/JavaScript development:
1. Add database table in `database/schema.sql`
2. Create API endpoint in `api/content.php`
3. Add HTML form in `cms-admin.html`
4. Add save function in `cms-admin.js`
5. Update website to load from API

---

## 📞 Need More Help?

### Quick Checklist When Something Goes Wrong:
- [ ] Is XAMPP running? (Apache & MySQL both green)
- [ ] Did you save changes in CMS?
- [ ] Did you refresh the website? (Ctrl+F5)
- [ ] Any errors in browser console? (F12)
- [ ] Is the database accessible via phpMyAdmin?
- [ ] Are image files in the `uploads/` folder?

### Files to Check:
- **CMS Login:** `cms-login.html`
- **CMS Admin:** `cms-admin.html`, `cms-admin.js`, `cms-admin.css`
- **API:** `api/content.php`, `api/auth.php`, `api/upload.php`, `api/config.php`
- **Database:** `database/schema.sql`
- **Website:** `index.html`, `gallery.html`

### Common File Locations:
- **Uploads:** `c:\xampp\htdocs\constratech_trading\uploads\`
- **Logs:** `c:\xampp\apache\logs\error.log`
- **Database:** phpMyAdmin at `http://localhost/phpmyadmin`

---

## 🎓 Best Practices

1. **Always backup before major changes**
2. **Test changes on staging/local before live**
3. **Optimize images before uploading (compress & resize)**
4. **Use descriptive titles and categories**
5. **Keep content concise and clear**
6. **Change default passwords immediately**
7. **Logout when done (especially on shared computers)**
8. **Clear old unused portfolio items periodically**
9. **Check website appearance on mobile devices**
10. **Keep XAMPP and PHP updated**

---

**Last Updated:** December 4, 2025
**Version:** 1.0
**CMS Version:** Constratech Trading CMS v1.0
