# Constratech Trading CMS Documentation

## Overview
A complete Content Management System (CMS) has been integrated into your Constratech Trading website. This allows you to edit all website content without touching any code through an easy-to-use admin interface.

## Access the CMS

### Login URL
Navigate to: `cms-login.html`

### Default Credentials
- **Username:** `admin`
- **Password:** `constratech2025`

⚠️ **Important:** Change these credentials in the `cms-login.html` file for security.

## Features

### 1. Content Management Sections

#### **Company Information**
Edit your core business details:
- Company Name
- Tagline
- Phone Number
- Email Address
- Physical Address
- Logo Path

#### **Hero Section**
Manage the main homepage banner:
- Hero Title
- Subtitle
- Description Text
- Call-to-Action Button Text & Link
- Background Image

#### **About Section**
Update your company story:
- About Title & Subtitle
- Description Text
- About Image
- Feature Boxes (3 items):
  - Icon (Font Awesome class)
  - Title
  - Description

#### **Services**
Manage all your services:
- Services Section Title, Subtitle & Description
- Individual Service Items (Add/Edit/Delete):
  - Icon (Font Awesome class)
  - Service Title
  - Service Description
- Add new services with the "Add Service" button
- Delete services with the trash icon

#### **Portfolio**
Showcase your projects:
- Portfolio Section Title, Subtitle & Description
- Featured Project:
  - Image Path
  - Category
  - Title
  - Description
- Portfolio Projects (Add/Edit/Delete):
  - Image Path
  - Category
  - Title
  - Description
- Add new projects with the "Add Project" button
- Delete projects with the trash icon

#### **Contact Information**
Update contact details:
- Contact Section Title, Subtitle & Description
- Form Submission Email

#### **Footer & Social Media**
Manage footer content:
- Footer Description Text
- Copyright Text
- Social Media Links:
  - Facebook
  - Twitter
  - LinkedIn
  - Instagram

### 2. CMS Actions

#### **Save Changes**
- **Save Section:** Each section has its own save button
- **Save All Changes:** Top-right button saves all sections at once
- Green success toast appears when changes are saved

#### **Export Data**
- Click "Export Data" to download all content as a JSON file
- Useful for backups or transferring content
- File name includes the date: `constratech-content-YYYY-MM-DD.json`

#### **Import Data**
- Click "Import Data" to restore content from a JSON file
- Select a previously exported JSON file
- All content will be replaced with the imported data

#### **Reset to Default**
- Click "Reset to Default" to restore original content
- ⚠️ **Warning:** This cannot be undone!
- Use with caution - all customizations will be lost

#### **Logout**
- Click "Logout" button in the sidebar
- Session expires automatically after 8 hours

## How to Edit Content

### Step-by-Step Guide

1. **Login to CMS**
   - Go to `cms-login.html`
   - Enter username and password
   - Click "Login to CMS"

2. **Navigate to Section**
   - Click on any section in the left sidebar:
     - Dashboard
     - Company Info
     - Hero Section
     - About Section
     - Services
     - Portfolio
     - Contact
     - Footer

3. **Edit Content**
   - Fill in the form fields with your desired content
   - For icons, use Font Awesome class names (e.g., `fas fa-home`)
   - For images, enter the file path (e.g., `img/photo.jpg`)

4. **Save Changes**
   - Click "Save [Section Name]" button at the bottom
   - Wait for green success message
   - Changes are saved to browser's localStorage

5. **View Changes**
   - Click "View Website" in the sidebar
   - Open in a new tab to see your updates
   - Refresh the page if needed

## Adding/Deleting Items

### Add New Service
1. Go to "Services" section
2. Scroll to "Service Items"
3. Click "Add Service" button
4. Fill in the new service details
5. Click "Save Services"

### Delete Service
1. Go to "Services" section
2. Find the service to delete
3. Click trash icon next to service title
4. Confirm deletion
5. Service is removed immediately

### Add New Portfolio Project
1. Go to "Portfolio" section
2. Scroll to "Portfolio Projects"
3. Click "Add Project" button
4. Fill in project details
5. Click "Save Portfolio"

### Delete Portfolio Project
1. Go to "Portfolio" section
2. Find the project to delete
3. Click trash icon next to project title
4. Confirm deletion
5. Project is removed immediately

## Icon Reference

### Font Awesome Icons
Use Font Awesome class names for icons:
- Home: `fas fa-home`
- Building: `fas fa-building`
- Solar Panel: `fas fa-solar-panel`
- Hammer: `fas fa-hammer`
- Briefcase: `fas fa-briefcase`
- Certificate: `fas fa-certificate`
- Users: `fas fa-users`
- Handshake: `fas fa-handshake`
- Road: `fas fa-road`
- Truck: `fas fa-truck`
- Cogs: `fas fa-cogs`

Search for more icons at: https://fontawesome.com/icons

## Image Management

### Image Paths
- Images should be in the `img/` folder
- Use relative paths: `img/photo.jpg`
- Uploaded images from gallery admin are already in cloud storage

### Recommended Image Sizes
- **Hero Background:** 1920x1080px
- **About Image:** 800x600px
- **Portfolio Images:** 800x600px
- **Logo:** 200x100px

## Data Storage

### LocalStorage
- All CMS data is stored in browser's localStorage
- Key: `constratech_cms_content`
- Data persists until cleared
- Not affected by page refreshes

### Backup Recommendations
1. Export data regularly using "Export Data" button
2. Keep JSON backups in a safe location
3. Export before making major changes
4. Consider weekly backups

## Troubleshooting

### Changes Not Appearing
1. Clear browser cache (Ctrl+F5)
2. Check if you saved the section
3. Verify you're viewing the correct page
4. Try logging out and back in

### Lost Access
1. Session expires after 8 hours
2. Login again at `cms-login.html`
3. Data is preserved even after logout

### Content Disappeared
1. Check if someone reset to default
2. Import your most recent JSON backup
3. Re-enter content manually if needed

### Icons Not Showing
1. Verify Font Awesome class name is correct
2. Include `fas` or `fab` prefix
3. Check internet connection (icons load from CDN)

## Security Notes

### Change Default Password
1. Open `cms-login.html` in code editor
2. Find the `CREDENTIALS` object
3. Change username and password values
4. Save the file

```javascript
const CREDENTIALS = {
    username: 'your-new-username',
    password: 'your-new-password'
};
```

### Session Management
- Login session lasts 8 hours
- Automatic logout after expiration
- Must re-login to access CMS

### Best Practices
- Don't share login credentials
- Logout when finished editing
- Regular backups of content
- Test changes on local server first

## Files Created

### CMS Files
- `cms-login.html` - Login page
- `cms-admin.html` - Admin dashboard
- `cms-admin.css` - Admin styling
- `cms-admin.js` - Admin functionality
- `cms.js` - Content loader for website

### Modified Files
- `index.html` - Added cms.js script
- `about.html` - Added cms.js script
- `contact.html` - Added cms.js script
- `gallery.html` - Added cms.js script

## Support

### Common Tasks

**Update Company Phone:**
1. Login to CMS
2. Click "Company Info"
3. Change "Phone Number" field
4. Click "Save Company Info"

**Change Hero Image:**
1. Login to CMS
2. Click "Hero Section"
3. Update "Background Image Path"
4. Click "Save Hero Section"

**Add New Service:**
1. Login to CMS
2. Click "Services"
3. Click "Add Service"
4. Fill in details
5. Click "Save Services"

**Update Footer Text:**
1. Login to CMS
2. Click "Footer"
3. Edit "Footer Description"
4. Click "Save Footer"

## Future Enhancements

Possible improvements you can make:
1. Multi-user support with roles
2. Image upload directly from CMS
3. Real-time preview of changes
4. Content versioning/history
5. SEO meta tags management
6. Analytics integration

## Contact

For technical support or custom modifications, contact your web developer.

---

**Last Updated:** December 2025  
**Version:** 1.0  
**Compatible With:** Modern browsers (Chrome, Firefox, Edge, Safari)
