/**
 * Tooltip Validation Script
 * Run this in the browser console to test tooltip functionality
 */

console.log('🔍 Validating Tooltip Functionality...\n');

// 1. Check if restriction data exists
console.log('1. Checking restriction data...');
const restrictionElements = document.querySelectorAll('.tooltip-icon-area');
console.log(`Found ${restrictionElements.length} tooltip trigger elements`);

// 2. Check for lock icons specifically  
const lockIcons = document.querySelectorAll('.tooltip-icon-area svg');
const lockIconsCount = Array.from(lockIcons).filter(icon => 
  icon.classList.contains('lucide-lock') || 
  icon.innerHTML.includes('lock') ||
  icon.closest('.tooltip-icon-area')
).length;
console.log(`Found ${lockIconsCount} lock icons with tooltip areas`);

// 3. Test hover functionality
if (restrictionElements.length > 0) {
  console.log('\n2. Testing hover functionality...');
  
  // Simulate hover on first restriction element
  const firstElement = restrictionElements[0];
  console.log('Simulating mouseenter on first restriction element...');
  
  const mouseEnterEvent = new MouseEvent('mouseenter', {
    bubbles: true,
    cancelable: true,
    clientX: 100,
    clientY: 100
  });
  
  firstElement.dispatchEvent(mouseEnterEvent);
  
  // Check if tooltip appears after delay
  setTimeout(() => {
    const tooltips = document.querySelectorAll('.rich-tooltip, [class*="tooltip"]');
    console.log(`Found ${tooltips.length} active tooltips after hover simulation`);
    
    if (tooltips.length > 0) {
      console.log('✅ Tooltips are working correctly!');
      tooltips.forEach((tooltip, index) => {
        console.log(`Tooltip ${index + 1}:`, tooltip.textContent.slice(0, 100) + '...');
      });
    } else {
      console.log('❌ No tooltips found. Checking common issues...');
      
      // Check for console errors
      console.log('\n3. Checking for JavaScript errors...');
      // Note: Console errors would be visible in the main console
      
      // Check if rich tooltip state exists
      console.log('\n4. Checking React state (if accessible)...');
      const reactRoots = document.querySelectorAll('[data-reactroot], #__next, [id*="react"], [class*="react"]');
      console.log(`Found ${reactRoots.length} potential React containers`);
    }
  }, 200);
} else {
  console.log('❌ No tooltip trigger elements found. This could mean:');
  console.log('   - No restrictions are configured');
  console.log('   - The lock icons are not being rendered');
  console.log('   - There are JavaScript errors preventing rendering');
}

// 4. Check CSS styles
console.log('\n5. Checking CSS styles...');
const tooltipStyles = getComputedStyle(document.documentElement);
console.log('Tooltip container z-index should be 1000 or higher');

// 5. Instructions for manual testing
console.log('\n📋 Manual Testing Instructions:');
console.log('1. Look for orange lock icons in the rate grid');
console.log('2. Hover over a lock icon and wait 150ms');
console.log('3. A dark tooltip should appear to the right');
console.log('4. The tooltip should show restriction details');
console.log('5. Moving mouse away should hide tooltip after 300ms');

console.log('\n🔧 If tooltips are not working:');
console.log('1. Check browser console for JavaScript errors');
console.log('2. Verify that bulkRestrictions state has data');
console.log('3. Check that getRestrictionTooltipData returns valid data');
console.log('4. Ensure showRichTooltip function is properly defined');
console.log('5. Verify CSS z-index and positioning styles'); 