// Test script to verify aboutUsDescriptions parsing logic

const testBody = {
  'aboutUsDescriptions[0][id]': '1731268140000_desc',
  'aboutUsDescriptions[0][text]': '',
  'projectTitle': 'Test Project'
};

console.log('Input body:', testBody);

const aboutUsKeys = Object.keys(testBody).filter(key => key.startsWith('aboutUsDescriptions['));
console.log('Found keys:', aboutUsKeys);

const parsed = {};
parsed.aboutUsDescriptions = [];

aboutUsKeys.forEach(key => {
  const match = key.match(/aboutUsDescriptions\[(\d+)\](?:\[(\w+)\])?/);
  if (match) {
    const index = parseInt(match[1]);
    const field = match[2]; // 'text', 'id', or undefined
    const value = testBody[key];
    
    console.log(`Processing key: ${key}, index: ${index}, field: ${field}, value: "${value}"`);
    
    if (!parsed.aboutUsDescriptions[index]) {
      parsed.aboutUsDescriptions[index] = {};
    }
    
    if (field) {
      if (typeof value === 'string') {
        parsed.aboutUsDescriptions[index][field] = value.trim();
      } else {
        parsed.aboutUsDescriptions[index][field] = value;
      }
    }
  }
});

console.log('Before filter:', parsed.aboutUsDescriptions);

// New filter logic
parsed.aboutUsDescriptions = parsed.aboutUsDescriptions
  .filter(desc => desc && Object.keys(desc).length > 0)
  .map(desc => ({ 
    id: desc.id && desc.id.trim() ? desc.id.trim() : null, 
    text: desc.text !== undefined ? (desc.text || '').toString() : '' 
  }));

console.log('After filter:', parsed.aboutUsDescriptions);
console.log('Final result:', JSON.stringify(parsed.aboutUsDescriptions, null, 2));
