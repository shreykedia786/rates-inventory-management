/**
 * QUICK TOOLTIP TEST
 * This script adds a test tooltip to verify the tooltip system is working
 * Run this in the browser console
 */

// Add a test tooltip to the first rate cell
const testTooltip = () => {
  console.log('🧪 Adding test tooltip...');
  
  // Find the first rate cell
  const rateCell = document.querySelector('[data-testid="rate-cell"], .rate-cell, .font-bold');
  if (rateCell) {
    console.log('Found rate cell:', rateCell);
    
    // Add a simple test tooltip
    rateCell.style.position = 'relative';
    rateCell.title = 'TEST TOOLTIP - This should appear on hover';
    
    // Also add a custom tooltip
    rateCell.addEventListener('mouseenter', (e) => {
      console.log('🖱️ TEST: Mouse entered rate cell');
      
      // Create a simple tooltip
      const tooltip = document.createElement('div');
      tooltip.id = 'test-tooltip';
      tooltip.style.cssText = `
        position: fixed;
        left: ${e.clientX + 10}px;
        top: ${e.clientY - 30}px;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 9999;
        pointer-events: none;
      `;
      tooltip.textContent = 'TEST TOOLTIP WORKING! 🎉';
      document.body.appendChild(tooltip);
    });
    
    rateCell.addEventListener('mouseleave', () => {
      console.log('🖱️ TEST: Mouse left rate cell');
      const tooltip = document.getElementById('test-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
    
    console.log('✅ Test tooltip added to rate cell');
    console.log('👆 Hover over the rate cell to test');
    
  } else {
    console.log('❌ No rate cell found');
  }
};

testTooltip(); 