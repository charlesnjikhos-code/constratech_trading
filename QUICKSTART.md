# Quick Start Guide - Constratech CMS

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Database (2 minutes)
1. Make sure XAMPP/WAMP is running (Apache + MySQL)
2. Open browser: `http://localhost/constratech_trading/setup.php`
3. Click "Install Database" button
4. Delete `setup.php` file after success

### Step 2: Login to CMS (1 minute)
1. Go to: `http://localhost/constratech_trading/cms-login.html`
2. Username: `admin`
3. Password: `constratech2025`
4. Click "Login"

### Step 3: Edit Your First Content (2 minutes)
1. Click "Company Info" in sidebar
2. Update your phone number
3. Update your email
4. Click "Save Company Info"
5. Open `index.html` - see your changes!

## 📝 Common Tasks

### Update Homepage Hero Banner
1. Login to CMS
2. Click "Hero Section"
3. Change title/subtitle/description
4. Click "Save Hero Section"

### Add a New Service
1. Click "Services" in sidebar
2. Scroll down to services list
3. Click "Add Service" button
4. Fill in icon, title, description
5. Click "Save Services"

### Add a Portfolio Project
1. Click "Portfolio" in sidebar
2. Scroll to "Portfolio Projects"
3. Click "Add Project" button
4. Fill in image path, category, title, description
5. Click "Save Portfolio"

### Update Contact Information
1. Click "Contact" in sidebar
2. Update section title/description
3. Update form email
4. Click "Save Contact Info"

### Change Social Media Links
1. Click "Footer" in sidebar
2. Scroll to "Social Media Links"
3. Update Facebook, Twitter, LinkedIn, Instagram URLs
4. Click "Save Footer"

## 🎨 Using Font Awesome Icons

For service and feature icons, use Font Awesome classes:

**Common Icons:**
- Home: `fas fa-home`
- Building: `fas fa-building`
- Solar Panel: `fas fa-solar-panel`
- Hammer: `fas fa-hammer`
- Road: `fas fa-road`
- Truck: `fas fa-truck`
- Wrench: `fas fa-wrench`
- Hard Hat: `fas fa-hard-hat`
- Tools: `fas fa-tools`
- Certificate: `fas fa-certificate`
- Users: `fas fa-users`
- Handshake: `fas fa-handshake`

Find more at: https://fontawesome.com/icons

## 💾 Backup Your Content

### Option 1: Database Backup
```bash
# Open command prompt in XAMPP folder
cd C:\xampp\mysql\bin
mysqldump -u root constratech_cms > backup.sql
```

### Option 2: phpMyAdmin
1. Open: `http://localhost/phpmyadmin`
2. Select `constratech_cms` database
3. Click "Export" tab
4. Click "Go"
5. Save the SQL file

## 🔧 Troubleshooting

### Can't Login?
- Check MySQL is running in XAMPP
- Default password is: `constratech2025`
- Clear browser cache and try again

### Changes Not Showing?
- Press Ctrl+F5 to hard refresh page
- Check you clicked "Save" button
- Open browser console (F12) for errors

### Database Connection Error?
- Make sure MySQL is started in XAMPP
- Check `api/config.php` has correct credentials
- Test: `http://localhost/constratech_trading/api/content.php?section=all`

## 📱 Managing on Mobile

The CMS admin panel is mobile-responsive! You can:
- Login from phone/tablet
- Edit content on the go
- Sidebar becomes icon-only on mobile
- All features work on touch devices

## 🔐 Security Tips

1. **Change Default Password Immediately**
2. **Delete setup.php After Installation**
3. **Don't Share Login Credentials**
4. **Logout When Done Editing**
5. **Keep Regular Backups**

## 🎯 Next Steps

After getting comfortable with basics:
1. Customize the default content
2. Upload your own images
3. Add more services/projects
4. Update all company information
5. Set up real social media links
6. Change default admin password

## 📞 Need Help?

Check these files:
- `INSTALLATION.md` - Full installation guide
- `CMS-README.md` - Detailed CMS documentation
- `database/schema.sql` - Database structure

---

**Remember:** All changes are saved to the MySQL database and appear instantly on your website!
