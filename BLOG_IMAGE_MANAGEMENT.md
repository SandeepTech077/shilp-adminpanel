# Blog Image Management System

## Features

### 1. **Auto-Delete Old Images on Update**
Jab aap blog update karte ho aur naye images upload karte ho:
- ✅ Purani main image automatically delete ho jati hai
- ✅ Point images bhi update hone par purani images delete ho jati hain
- ✅ Only replaced images delete hoti hain, existing images safe rahti hain

**Example:**
```
Initial Blog:
- Main Image: image-old.jpg
- Point 1 Image: point1-old.jpg

Update with new main image:
- Old main image deleted: image-old.jpg ❌
- New main image saved: image-new.jpg ✅
- Point 1 Image unchanged: point1-old.jpg ✅
```

### 2. **Complete Folder Deletion on Blog Delete**
Jab aap poora blog delete karte ho:
- ✅ Database se blog entry delete hoti hai
- ✅ Poora blog folder (`/uploads/blogs/{blog-url}/`) delete ho jata hai
- ✅ Folder ke andar ki saari images automatically delete ho jati hain

**Example:**
```
Before Delete:
/uploads/blogs/my-blog/
  ├── image-main.jpg
  ├── point1-image.jpg
  └── point2-image.jpg

After Delete:
/uploads/blogs/
  (my-blog folder completely removed)
```

## Implementation Details

### Update Blog Flow:
1. Get existing blog from database
2. Track old images that will be replaced
3. Upload new images to blog folder
4. Update database with new image paths
5. Delete old images from filesystem

### Delete Blog Flow:
1. Get blog details from database
2. Delete blog from database first
3. Delete entire blog folder with all images
4. Return success message

## File Structure

### Modified Files:
- `server/src/controllers/blogController.js` - Added old image tracking and deletion
- `server/src/services/blogService.js` - Added `deleteSpecificImages()` function
- `server/src/services/blogService.js` - Improved `deleteBlog()` to remove folder

### Helper Scripts:
- `server/scripts/checkBlogImages.js` - Check all blog folders and images

## Testing

### Check Current Blog Images:
```bash
cd server
node scripts/checkBlogImages.js
```

### Test Update Flow:
1. Create a blog with images
2. Update the blog with new images
3. Check folder - old images should be deleted
4. Run: `node scripts/checkBlogImages.js`

### Test Delete Flow:
1. Delete a blog
2. Check uploads/blogs/ folder
3. Blog folder should be completely removed
4. Run: `node scripts/checkBlogImages.js`

## Benefits

✅ **No Orphaned Files** - Purani images automatically clean ho jati hain
✅ **Save Disk Space** - Unnecessary files nahi rehti
✅ **Clean File System** - Organized aur clean folder structure
✅ **Automatic Cleanup** - Manual deletion ki zaroorat nahi
✅ **Safe Updates** - Existing images preserve hoti hain jab replace nahi ki jati

## Technical Details

### Image Deletion Logic:
```javascript
// Update: Delete specific replaced images
const oldImages = []; // Track images to delete
if (newMainImage) {
  oldImages.push(existingBlog.image); // Add old main image
}
await deleteSpecificImages(oldImages); // Delete after successful update

// Delete: Remove entire folder
await fs.rm(blogFolder, { recursive: true, force: true });
```

### Safety Features:
- Database update first, then file deletion
- Error handling to prevent data loss
- Force flag for complete folder removal
- Logging for debugging

## Error Handling

- If image deletion fails, blog update still succeeds (images remain)
- If folder deletion fails on blog delete, database entry is already removed
- Console logs for tracking deletion success/failure
- No user-facing errors for cleanup operations
