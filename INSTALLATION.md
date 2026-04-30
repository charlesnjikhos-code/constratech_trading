# Constratech Trading CMS - Installation Guide

---

## ✅ Version 3.0 — No-Server CMS (Current)

This version requires **nothing to install**. No PHP, no MySQL, no XAMPP. Works directly in your browser and deploys through GitHub Pages.

### How It Works

- You edit content in the CMS — changes are saved in your browser's local storage
- Click **Preview Site** to see your changes before publishing
- Click **Publish to Website** to download a `content.json` file
- Push that file to GitHub — the live site at constratechtrading.com updates in ~1 minute

### Getting Started

1. Open `cms-login.html` in your browser (double-click the file, or open via GitHub Pages at `constratechtrading.com/cms-login.html`)
2. Enter the password: `constratech2025`
3. Edit any section using the sidebar
4. Click **Save** at the bottom of each section
5. Click **Preview Site** (top bar) to review changes in a new tab
6. When ready to go live, click **Publish to Website** — this downloads `content.json`
7. Move the downloaded `content.json` into your project folder (replacing the old one)
8. Run:
   ```bash
   git add content.json
   git commit -m "update site content"
   git push
   ```
9. Wait ~1 minute — your changes are live

### Changing the Password

The password is stored in `cms-login.html`. Open the file and find this line near the bottom:

```js
const STORED_PASSWORD = localStorage.getItem('cms_password') || 'constratech2025';
```

To set a permanent new password, change `'constratech2025'` to your new password and push to GitHub.

### Adding Images

The CMS does not upload images — GitHub Pages does not support file uploads. To add a new image:

1. Add the image file to the `img/` folder in your project
2. In the CMS, type the relative path into the image field (e.g. `img/myproject.jpg`)
3. Save and publish as normal

### Files Involved

| File | Purpose |
|------|---------|
| `content.json` | Live content store — push this to update the website |
| `cms-login.html` | CMS login page (password-only, no server needed) |
| `cms-admin.html` | CMS admin dashboard |
| `cms-admin.js` | Saves edits to localStorage, handles Publish export |
| `cms.js` | Loads content into the website from `content.json` |

### Important Notes

- **Changes are stored in your browser.** If you clear browser data, unsaved work is lost. Use **Publish to Website** regularly to keep `content.json` as your backup.
- **The live site only updates when you push `content.json` to GitHub.** Saving in the CMS alone does not affect the live site.
- **Preview uses `?preview=1`** in the URL. The live site always reads from `content.json`.

---

## 🗄️ Version 2.0 — PHP/MySQL CMS (Legacy)

## 📋 Prerequisites

Before you begin, ensure you have:
- **PHP 7.4 or higher** installed
- **MySQL 5.7 or higher** (or MariaDB 10.2+)
- **Apache/Nginx** web server with PHP support
- **PDO MySQL extension** enabled in PHP
- Basic knowledge of running PHP applications

---

## 🚀 Installation Steps

### Step 1: Set Up Web Server

#### Option A: Using XAMPP (Recommended for Windows)
1. Download and install [XAMPP](https://www.apachefriends.org/)
2. Start Apache and MySQL from XAMPP Control Panel
3. Copy your project folder to `C:\xampp\htdocs\constratech_trading`

#### Option B: Using WAMP
1. Download and install [WAMP](https://www.wampserver.com/)
2. Start WAMP services
3. Copy project to `C:\wamp64\www\constratech_trading`

#### Option C: Using LAMP (Linux)
```bash
sudo apt update
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql
sudo systemctl start apache2
sudo systemctl start mysql
```

---

### Step 2: Database Setup

#### Method 1: Using the Setup Script (Easiest)
1. Open your browser
2. Navigate to: `http://localhost/constratech_trading/setup.php`
3. Fill in the database credentials:
   - **Host:** localhost
   - **Username:** root (default) or your MySQL username
   - **Password:** (leave empty for default XAMPP, or enter your MySQL password)
   - **Database Name:** constratech_cms
4. Click "Install Database"
5. Wait for success message
6. **Important:** Delete `setup.php` file after installation for security

#### Method 2: Manual Database Setup
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create new database: `constratech_cms`
3. Select the database
4. Go to "Import" tab
5. Choose file: `database/schema.sql`
6. Click "Go" to import
7. Update `api/config.php` with your database credentials

---

### Step 3: Configure Database Connection

Edit `api/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'constratech_cms');
define('DB_USER', 'root'); // Your MySQL username
define('DB_PASS', ''); // Your MySQL password
```

---

### Step 4: File Permissions (Linux/Mac)

```bash
cd /var/www/html/constratech_trading
chmod 755 api/
chmod 644 api/*.php
chmod 755 database/
```

---

### Step 5: Test the Installation

1. **Test Database Connection:**
   - Open: `http://localhost/constratech_trading/api/content.php?section=all`
   - You should see JSON response with all content

2. **Test Authentication:**
   - Open: `http://localhost/constratech_trading/cms-login.html`
   - Login with:
     - Username: `admin`
     - Password: `constratech2025`

3. **View Website:**
   - Open: `http://localhost/constratech_trading/index.html`
   - Content should load from database

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Verify MySQL is running:
   ```bash
   # Windows (XAMPP)
   # Check XAMPP Control Panel - MySQL should be green
   
   # Linux
   sudo systemctl status mysql
   ```

2. Check credentials in `api/config.php`
3. Try connecting via command line:
   ```bash
   mysql -u root -p
   ```

### Issue: "Call to undefined function mysqli_connect()"

**Solution:**
Enable MySQL extension in `php.ini`:
```ini
extension=mysqli
extension=pdo_mysql
```
Restart Apache after changes.

### Issue: "Access denied for user 'root'@'localhost'"

**Solution:**
1. Reset MySQL root password:
   ```bash
   # XAMPP - default is no password
   # Run mysql from XAMPP shell:
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   ```

### Issue: "404 Not Found" for API calls

**Solution:**
1. Check `.htaccess` exists (create if missing):
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /constratech_trading/
   </IfModule>
   ```

2. Enable mod_rewrite in Apache:
   ```bash
   # Linux
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   
   # XAMPP - usually enabled by default
   ```

### Issue: CORS errors in browser console

**Solution:**
API files already include CORS headers. If still having issues, add to Apache config:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE"
```

---

## 📁 Project Structure

```
constratech_trading/
│
├── api/
│   ├── config.php          # Database configuration
│   ├── auth.php            # Authentication API
│   └── content.php         # Content management API
│
├── database/
│   └── schema.sql          # Database schema
│
├── cms-login.html          # CMS login page
├── cms-admin.html          # CMS admin dashboard
├── cms-admin.css           # Admin panel styling
├── cms-admin.js            # Admin panel functionality
├── cms.js                  # Content loader (PHP version)
│
├── index.html              # Main website
├── about.html              # About page
├── contact.html            # Contact page
├── gallery.html            # Gallery page
│
└── setup.php               # Installation script (delete after use)
```

---

## 🔐 Security Recommendations

### 1. Change Default Password
After first login, change the admin password:
```sql
-- In phpMyAdmin or MySQL client:
UPDATE admin_users 
SET password_hash = PASSWORD('your-new-password') 
WHERE username = 'admin';
```

### 2. Delete Setup File
```bash
rm setup.php
# or manually delete setup.php from your project
```

### 3. Secure Config File
Add to `.htaccess` in `/api/` folder:
```apache
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

### 4. Enable HTTPS
- Get SSL certificate (Let's Encrypt is free)
- Force HTTPS in `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 5. Restrict phpMyAdmin Access
Add to phpMyAdmin config:
```php
$cfg['Servers'][$i]['AllowRoot'] = FALSE;
```

---

## 🎯 Using the CMS

### Accessing the Admin Panel
1. Go to: `http://localhost/constratech_trading/cms-login.html`
2. Login with: `admin` / `constratech2025`
3. You'll be redirected to the admin dashboard

### Editing Content
1. Click any section in the left sidebar
2. Update the content in the forms
3. Click "Save [Section Name]"
4. Changes are immediately saved to database
5. View changes on the website

### Managing Services
- **Add Service:** Click "Add Service" button
- **Edit Service:** Change the fields and click Save
- **Delete Service:** Click trash icon next to service

### Managing Portfolio
- **Add Project:** Click "Add Project" button
- **Edit Project:** Change the fields and click Save
- **Delete Project:** Click trash icon next to project
- **Featured Project:** First project in database is featured

---

## 🔄 Backup & Restore

### Backup Database
```bash
# Command line
mysqldump -u root -p constratech_cms > backup.sql

# Or use phpMyAdmin Export feature
```

### Restore Database
```bash
# Command line
mysql -u root -p constratech_cms < backup.sql

# Or use phpMyAdmin Import feature
```

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `company_info` | Company details (name, phone, email, etc.) |
| `hero_section` | Homepage hero banner |
| `about_section` | About page content |
| `features` | Feature boxes (3 items) |
| `services_section` | Services section header |
| `services` | Individual service items |
| `portfolio_section` | Portfolio section header |
| `portfolio` | Portfolio/project items |
| `contact_section` | Contact page content |
| `footer` | Footer content |
| `social_media` | Social media links |
| `admin_users` | CMS admin users |
| `admin_sessions` | Login sessions |

---

## 🌐 Deployment to Live Server

### 1. Upload Files
Upload all files via FTP/SFTP to your web server

### 2. Create Database
- Use cPanel or hosting control panel
- Create MySQL database
- Create MySQL user with all privileges

### 3. Update Config
Edit `api/config.php` with live database credentials

### 4. Import Database
- Use phpMyAdmin on your hosting
- Import `database/schema.sql`

### 5. Update Paths
If website is in subdirectory, update paths in:
- `cms.js` - Update `apiBase`
- `cms-admin.js` - Update API endpoints

### 6. Test
- Test website: `https://yourdomain.com`
- Test CMS: `https://yourdomain.com/cms-login.html`

---

## 🆘 Support

For technical issues:
1. Check error logs:
   - Apache: `/var/log/apache2/error.log`
   - XAMPP: `xampp/apache/logs/error.log`
   - PHP: Check `php.ini` for `error_log` location

2. Enable error reporting in `api/config.php`:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

3. Test API endpoints manually:
   - `api/content.php?section=company`
   - `api/auth.php?action=check`

---

## ✅ Post-Installation Checklist

- [ ] Database created successfully
- [ ] All tables imported (13 tables)
- [ ] Can login to CMS admin panel
- [ ] Website loads content from database
- [ ] Can edit and save content in CMS
- [ ] Changes reflect on website immediately
- [ ] setup.php file deleted
- [ ] Default password changed
- [ ] Database backup created

---

## 📝 API Endpoints Reference

### Authentication
- `POST api/auth.php?action=login` - Login
- `GET api/auth.php?action=logout` - Logout
- `GET api/auth.php?action=check` - Check session
- `POST api/auth.php?action=change-password` - Change password

### Content
- `GET api/content.php?section=all` - Get all content
- `GET api/content.php?section=company` - Get company info
- `GET api/content.php?section=hero` - Get hero section
- `GET api/content.php?section=about` - Get about section
- `GET api/content.php?section=services` - Get services
- `GET api/content.php?section=portfolio` - Get portfolio
- `PUT/POST api/content.php?section={section}` - Update section

---

**Last Updated:** December 2025  
**Version:** 2.0 (PHP/MySQL)  
**Compatible With:** PHP 7.4+, MySQL 5.7+
