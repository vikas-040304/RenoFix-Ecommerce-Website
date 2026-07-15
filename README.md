# RenoFix - Ecommerce Website

A modern, feature-rich WordPress-based ecommerce platform built with Hostinger integration, advanced caching, and interactive Vue.js components.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Available Commands](#available-commands)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **WordPress Core**: Full WordPress CMS functionality
- **Ecommerce Ready**: Complete online store capabilities
- **Performance Optimized**: LiteSpeed Cache integration for fast loading
- **Hostinger Integration**: Seamless Hostinger plugin integration
- **Interactive Components**: Vue.js 3 for dynamic frontend experiences
- **Form Management**: Forminator plugin for advanced form building
- **Responsive Design**: Mobile-first responsive layouts
- **Security**: Built-in WordPress security with authentication keys

## 🛠 Tech Stack

| Component | Version | Percent |
|-----------|---------|---------|
| PHP | 8.0+ | 52.8% |
| JavaScript | ES6+ | 27.3% |
| HTML5 | - | 12.4% |
| CSS/SCSS | - | 7.5% |
| Vue.js | 3.4+ | Framework |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP**: 8.0 or higher
- **MySQL/MariaDB**: 5.7 or higher
- **Node.js**: 14.x or higher
- **npm**: 6.x or higher
- **Composer**: Latest version
- **Web Server**: Apache (with mod_rewrite) or Nginx
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vikas-040304/RenoFix-Ecommerce-Website.git
cd RenoFix-Ecommerce-Website
```

### 2. Database Setup

Create a MySQL database and update `wp-config.php` with your credentials:

```php
define( 'DB_NAME', 'your_database_name' );
define( 'DB_USER', 'your_database_user' );
define( 'DB_PASSWORD', 'your_database_password' );
define( 'DB_HOST', 'localhost' );
```

**Default Credentials (if using provided config):**
- Database: `u717068494_SFbMs`
- User: `u717068494_2fdgf`
- Host: `127.0.0.1`

### 3. Install PHP Dependencies

```bash
composer install
```

### 4. Install Node Dependencies

```bash
npm install
```

For specific plugins:

```bash
cd wp-content/plugins/hostinger/
npm install

cd ../hostinger-easy-onboarding/
npm install
```

### 5. Build Assets

```bash
npm run prod
```

### 6. Set File Permissions

```bash
chmod 755 wp-content
chmod 644 wp-config.php
```

### 7. Access WordPress

- Navigate to `http://localhost/RenoFix-Ecommerce-Website`
- Complete WordPress installation wizard
- Login to admin dashboard at `/wp-admin`

## ⚙️ Configuration

### WordPress Configuration (`wp-config.php`)

- Update database credentials
- Set `WP_DEBUG` to `false` in production
- Configure WordPress security keys
- Set `WP_CACHE` for performance

### Web Server Configuration

**Apache** (.htaccess already included):
```bash
a2enmod rewrite
systemctl restart apache2
```

**Nginx**: Use appropriate WordPress configuration

### Environment Variables

Create `.env` file (recommended for production):

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
WP_HOME=https://yourdomain.com
WP_SITEURL=https://yourdomain.com
```

## 👨‍💻 Development

### Start Development Server

Using PHP built-in server:

```bash
php -S localhost:8000
```

Or use Docker:

```bash
docker run --rm -p 8000:80 -v $(pwd):/var/www/html php:8.0-apache
```

### Watch Assets During Development

```bash
cd wp-content/plugins/hostinger/
npm run watch

# In another terminal
cd wp-content/plugins/hostinger-easy-onboarding/
npm run start
```

### Build for Production

```bash
npm run production
```

## 📁 Project Structure

```
RenoFix-Ecommerce-Website/
├── wp-admin/              # WordPress admin files
├── wp-content/
│   ├── plugins/
│   │   ├── hostinger/     # Main Hostinger plugin
│   │   ├── hostinger-easy-onboarding/  # Onboarding plugin
│   │   ├── forminator/    # Form builder
│   │   └── litespeed-cache/  # Performance caching
│   └── themes/            # Custom themes
├── wp-includes/           # WordPress core includes
├── wp-config.php          # WordPress configuration
├── index.php              # WordPress entry point
├── .htaccess              # Apache URL rewriting
├── composer.json          # PHP dependencies
└── README.md              # This file
```

## 🎯 Available Commands

### NPM Scripts

```bash
npm run dev              # Development build
npm run prod            # Production build
npm run watch           # Watch files for changes
npm run production      # Optimized production build
npm run format          # Format code with Prettier
npm run format-check    # Check code formatting
```

### Composer Commands

```bash
composer install        # Install PHP dependencies
composer update         # Update dependencies
composer require <pkg>  # Add new package
```

### Plugin-Specific Commands

**Hostinger Plugin:**
```bash
cd wp-content/plugins/hostinger/
npm run dev
npm run prod
npm run watch
```

**Hostinger Easy Onboarding:**
```bash
cd wp-content/plugins/hostinger-easy-onboarding/
npm run production
npm run start
```

## 🔧 Troubleshooting

### Issue: White Screen of Death

```bash
# Enable debugging in wp-config.php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );

# Check wp-content/debug.log
```

### Issue: Permission Denied

```bash
# Fix file permissions
chmod -R 755 wp-content
chmod -R 755 wp-admin
chmod 644 wp-config.php
```

### Issue: Database Connection Error

- Verify MySQL is running
- Check database credentials in `wp-config.php`
- Ensure database exists: `CREATE DATABASE your_db_name;`

### Issue: npm/Node Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Missing Assets

```bash
# Rebuild assets
npm run prod

# If still missing, check webpack config
cat wp-content/plugins/hostinger/webpack.mix.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- Code follows WordPress coding standards
- All changes are documented in `CHANGELOG.md`
- Tests pass before submitting PR

## 📄 License

This project is licensed under the GPL License - see the `license.txt` file for details.

## 📞 Support & Contact

- **Issue Tracker**: [GitHub Issues](https://github.com/vikas-040304/RenoFix-Ecommerce-Website/issues)
- **Documentation**: See `wp-content/plugins/*/README.md` for plugin-specific docs
- **WordPress Help**: https://wordpress.org/support/

## 🔐 Security

- Keep WordPress and all plugins updated
- Use strong database passwords
- Never commit `wp-config.php` with real credentials
- Use `.env` files for sensitive data in production
- Regularly backup database and files

## 📊 Performance Tips

- Enable LiteSpeed Cache plugin
- Use CDN for static assets
- Optimize images before uploading
- Enable GZIP compression
- Minimize CSS/JS files
- Use caching headers

---

**Last Updated**: 2026-07-15  
**Maintained By**: vikas-040304
