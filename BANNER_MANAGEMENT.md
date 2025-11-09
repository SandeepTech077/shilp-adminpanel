# Banner Management System

This document explains the complete banner management system implemented for the Shilp Admin Panel.

## Overview

The banner management system allows administrators to:
- Upload and manage desktop and mobile banners for different website sections
- Set alt text for accessibility
- Preview banner images
- Delete individual banners
- Update banner information

## Database Structure

The system uses a single MongoDB document with the following structure:

```javascript
{
  homepageBanner: {
    banner: "URL to desktop banner image",
    mobilebanner: "URL to mobile banner image", 
    alt: "Alt text for accessibility"
  },
  aboutUs: {
    banner: "URL to desktop banner image",
    mobilebanner: "URL to mobile banner image",
    alt: "Alt text for accessibility"
  },
  commercialBanner: { /* same structure */ },
  plotBanner: { /* same structure */ },
  residentialBanner: { /* same structure */ },
  contactBanners: { /* same structure */ },
  careerBanner: { /* same structure */ },
  ourTeamBanner: { /* same structure */ },
  termsConditionsBanner: { /* same structure */ },
  privacyPolicyBanner: { /* same structure */ }
}
```

## API Endpoints

### Get All Banners
```
GET /api/banners
Authorization: Bearer <admin_token>
```

### Upload Banner Image
```
POST /api/banners/:section/:field
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

FormData:
- image: File (required)
- alt: String (optional)
```

### Update Alt Text
```
PATCH /api/banners/:section/alt
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "alt": "New alt text"
}
```

### Delete Banner Image
```
DELETE /api/banners/:section/:field
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "oldImageUrl": "URL of image to delete"
}
```

## Parameters

- **section**: Banner section name (homepageBanner, aboutUs, commercialBanner, etc.)
- **field**: Image type (banner for desktop, mobilebanner for mobile)

## File Structure

### Server Files
```
server/
├── src/
│   ├── models/Banner.js          # MongoDB schema
│   ├── repositories/bannerRepository.js  # Database operations
│   ├── services/bannerService.js # Business logic
│   ├── controllers/bannerController.js   # HTTP handlers
│   ├── routes/bannerRoutes.js    # API routes
│   └── server.js                 # Updated with banner routes
├── scripts/
│   └── initializeBanners.js      # Database initialization
└── uploads/
    └── banners/                  # Uploaded banner images
```

### Client Files
```
client/src/pages/admin/
└── BannerPage.tsx               # React component for banner management
```

## Setup Instructions

### 1. Initialize Database
```bash
cd server
npm run init-banners
```

### 2. Start Server
```bash
npm start
```

### 3. Access Banner Management
Navigate to `/admin/banners` in the admin panel.

## Features

### Image Upload
- Supports common image formats (JPEG, PNG, GIF, WebP)
- Automatic file type validation
- Multer integration for secure file handling
- Physical file storage in `/uploads/banners/`

### Image Management
- Preview images in modal
- Replace existing images
- Delete images (removes both database reference and physical file)
- Hover effects for better UX

### Accessibility
- Alt text support for all images
- Screen reader friendly
- Keyboard navigation support

### Error Handling
- File size validation
- File type validation
- Database error handling
- User-friendly error messages

## Security Features

- JWT authentication required for all operations
- File type validation
- Secure file naming (timestamp + original name)
- Path traversal protection
- CORS configuration

## Usage Examples

### Upload a Homepage Desktop Banner
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('alt', 'Homepage hero banner');

fetch('/api/banners/homepageBanner/banner', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Update Alt Text
```javascript
fetch('/api/banners/homepageBanner/alt', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    alt: 'New homepage banner description'
  })
});
```

### Get All Banners
```javascript
fetch('/api/banners', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid section or field specified"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Access denied. Admin token required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Banner document not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Maintenance

### Clean Up Unused Images
Periodically check the `/uploads/banners/` directory for orphaned files that may remain after deletion errors.

### Database Backup
Regularly backup the banner collection to prevent data loss.

### Image Optimization
Consider implementing image compression for uploaded banners to improve website performance.

## Future Enhancements

1. **Image Compression**: Automatic compression of uploaded images
2. **Multiple Image Sizes**: Generate different sizes automatically
3. **CDN Integration**: Store images on external CDN
4. **Batch Operations**: Upload multiple images at once
5. **Image Editor**: Basic editing capabilities (crop, resize)
6. **Version History**: Keep track of previous banner versions
7. **Analytics**: Track banner performance and engagement

## Troubleshooting

### Common Issues

1. **Upload fails**: Check file permissions on `/uploads/banners/` directory
2. **Images not displaying**: Verify static file serving is configured
3. **Database errors**: Ensure MongoDB connection is working
4. **Authentication errors**: Verify JWT token is valid and not expired

### Logs
Check server logs for detailed error information:
```bash
npm start
```

### Database Reset
To reset all banners:
```bash
npm run init-banners
```

This will recreate the banner document with empty values for all sections.