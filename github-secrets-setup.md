# 🔐 GitHub Repository Secrets Setup

## Required Secrets for Auto-Deployment

### 1. GitHub Repository में जाएं:
- Repository page पर जाएं: `https://github.com/SandeepTech077/shilp-adminpanel`
- **Settings** tab पर click करें
- Left sidebar में **Secrets and variables** → **Actions** पर click करें

### 2. Add Repository Secrets:
Click **"New repository secret"** और ये secrets add करें:

#### a) **FTP_SERVER**
```
Value: ftp.yourdomain.com
(या आपका cPanel FTP server address)
```

#### b) **FTP_USERNAME** 
```
Value: your-cpanel-username
(आपका cPanel FTP username)
```

#### c) **FTP_PASSWORD**
```
Value: your-cpanel-password
(आपका cPanel FTP password)
```

#### d) **CPANEL_USERNAME**
```
Value: your-cpanel-username
(आपका cPanel main username)
```

### 3. cPanel FTP Details कैसे पाएं:

#### Method 1: cPanel से
1. cPanel login करें
2. **Files** section में **FTP Accounts** पर click करें
3. Main account के FTP details देखें

#### Method 2: Hosting Provider से
- FTP Server: Usually `ftp.yourdomain.com` या `yourdomain.com`
- Username: आपका cPanel username
- Password: आपका cPanel password

### 4. Test FTP Connection:
```bash
# Terminal में test कर सकते हैं
ftp ftp.yourdomain.com
# Username और password enter करें
```

### 5. Directory Structure (Important):
```
Frontend: /public_html/admin/
Backend: /home/username/mail.shilpgroup.com/
```

## 🚀 How Auto-Deployment Works:

1. **Code Push**: आप GitHub पर code push करते हैं
2. **GitHub Actions Trigger**: Automatically workflow start होता है
3. **Build Process**: 
   - Client build होता है
   - Server dependencies install होती हैं
4. **Deploy Process**:
   - Frontend files → `/public_html/admin/`
   - Backend files → `/home/username/mail.shilpgroup.com/`
5. **Manual Step**: cPanel में Node.js app restart करना पड़ सकता है

## 📋 Setup Checklist:
- [ ] GitHub repository secrets added
- [ ] FTP credentials tested
- [ ] Directory paths verified in cPanel
- [ ] First deployment को manually test करें

## 🔄 Usage:
```bash
# Local changes करें
git add .
git commit -m "Update admin panel"
git push origin main

# Automatic deployment start हो जाएगा!
```

## 🔧 Troubleshooting:
- **FTP Connection Failed**: Check credentials और server address
- **Permission Denied**: Check directory permissions in cPanel
- **Files Not Updating**: Check file paths और clear browser cache
- **Node.js App Not Starting**: Manually restart in cPanel Node.js Apps