# 🔐 GitHub Secrets Configuration

## Required Secrets (Add करें GitHub Repository में):

### 1. FTP_SERVER
```
Name: FTP_SERVER
Value: ftp.shilpgroup.com
(या आपका hosting provider का FTP server)
```

### 2. FTP_USERNAME
```
Name: FTP_USERNAME  
Value: [आपका cPanel FTP username]
```

### 3. FTP_PASSWORD
```
Name: FTP_PASSWORD
Value: [आपका cPanel FTP password]
```

### 4. CPANEL_USERNAME
```
Name: CPANEL_USERNAME
Value: [आपका main cPanel username]
```

## 🔍 FTP Details कैसे पाएं:

### Method 1: Hosting Provider से
- **FTP Server**: Usually `ftp.yourdomain.com` या `yourdomain.com`
- **Username**: आपका cPanel main username
- **Password**: आपका cPanel main password

### Method 2: cPanel FTP Manager से
1. cPanel login करें
2. **Files** → **FTP Accounts** 
3. Main account की details copy करें

## ✅ Test FTP Connection:
Terminal में test कर सकते हैं:
```bash
ftp ftp.shilpgroup.com
# Username/password enter करें
```

## 📁 Upload Directories:
- **Frontend**: `/public_html/admin/`
- **Backend**: `/home/[username]/mail.shilpgroup.com/`