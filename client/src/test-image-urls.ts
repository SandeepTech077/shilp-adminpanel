// Test Image URL Construction
import { getImageUrl } from '../src/api/imageUtils';

// Test with the actual data from your response
const testImagePath = "/uploads/banners/homepageBanner_banner_1762681381497_20555929_1920_X_1080.jpg";
const mobileImagePath = "/uploads/banners/homepageBanner_mobilebanner_1762682066601_849651893_mobileBanner.jpg";

console.log('=== Image URL Test ===');
console.log('Environment Variables:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_IMAGE_BASE_URL:', import.meta.env.VITE_IMAGE_BASE_URL);
console.log('VITE_DEV_PORT:', import.meta.env.VITE_DEV_PORT);

console.log('\nImage URL Construction:');
console.log('Desktop Banner:', getImageUrl(testImagePath));
console.log('Mobile Banner:', getImageUrl(mobileImagePath));

console.log('\nExpected URLs (in development):');
console.log('Desktop: http://localhost:5174/uploads/banners/homepageBanner_banner_1762681381497_20555929_1920_X_1080.jpg');
console.log('Mobile: http://localhost:5174/uploads/banners/homepageBanner_mobilebanner_1762682066601_849651893_mobileBanner.jpg');

console.log('\nProxy should forward to:');
console.log('Backend: http://localhost:8081/uploads/banners/...');

export {};