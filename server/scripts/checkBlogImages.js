/**
 * Test Script to Verify Blog Image Deletion
 * 
 * This script helps verify that:
 * 1. When updating a blog with new images, old images are deleted
 * 2. When deleting a blog, the entire folder is removed
 */

const fs = require('fs').promises;
const path = require('path');

const checkBlogFolders = async () => {
  try {
    const blogsDir = path.join(__dirname, '../uploads/blogs');
    
    console.log('📁 Checking blog folders in uploads/blogs/\n');
    
    try {
      const folders = await fs.readdir(blogsDir);
      
      if (folders.length === 0) {
        console.log('✅ No blog folders found (all cleaned up)');
        return;
      }
      
      console.log(`Found ${folders.length} blog folder(s):\n`);
      
      for (const folder of folders) {
        const folderPath = path.join(blogsDir, folder);
        const stats = await fs.stat(folderPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(folderPath);
          console.log(`📂 ${folder}/`);
          console.log(`   Images: ${files.length}`);
          files.forEach(file => {
            console.log(`   - ${file}`);
          });
          console.log('');
        }
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('⚠️  uploads/blogs/ directory does not exist yet');
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking blog folders:', error.message);
  }
};

// Run the check
console.log('🔍 Blog Image Cleanup Verification\n');
console.log('='.repeat(50) + '\n');
checkBlogFolders();
