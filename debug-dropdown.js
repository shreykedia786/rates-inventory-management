/**
 * Dropdown Debug Script for Property Selector
 * Paste this in the browser console to debug dropdown issues
 */

console.log('🔍 Starting Dropdown Debug...');

// Check if the property selector button exists
const propertyButton = document.querySelector('button[class*="min-w-[320px]"]');
console.log('Property Button Found:', !!propertyButton);

if (propertyButton) {
  console.log('Button element:', propertyButton);
  
  // Check for click event listeners
  const events = getEventListeners ? getEventListeners(propertyButton) : 'getEventListeners not available';
  console.log('Button Event Listeners:', events);
  
  // Simulate a click
  console.log('Simulating click...');
  propertyButton.click();
  
  // Wait a moment then check for dropdown
  setTimeout(() => {
    const dropdown = document.querySelector('[class*="z-[9999]"]') || 
                    document.querySelector('[class*="absolute top-full"]');
    console.log('Dropdown Element Found:', !!dropdown);
    
    if (dropdown) {
      console.log('Dropdown element:', dropdown);
      console.log('Dropdown visibility:', window.getComputedStyle(dropdown).display);
      console.log('Dropdown z-index:', window.getComputedStyle(dropdown).zIndex);
    } else {
      console.log('❌ Dropdown not found. Checking for any absolute positioned elements...');
      const absoluteElements = document.querySelectorAll('[class*="absolute"]');
      console.log('Absolute positioned elements:', absoluteElements.length);
      absoluteElements.forEach((el, index) => {
        console.log(`Absolute element ${index}:`, el);
      });
    }
  }, 100);
  
} else {
  console.log('❌ Property selector button not found!');
  console.log('Available buttons:', document.querySelectorAll('button'));
}

// Check for React DevTools
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('✅ React DevTools available');
} else {
  console.log('⚠️ React DevTools not available');
}

// Check for console errors
console.log('🔍 Check for any console errors above this message'); 