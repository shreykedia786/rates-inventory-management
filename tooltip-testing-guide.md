# 🔒 Lock Icon Tooltip Testing Guide

## ✅ **Quick Validation Steps**

### 1. **Check if Lock Icons Appear**
- Open: `http://localhost:3000` (or your Next.js port)
- Look for **orange lock icons** 🔒 in these specific locations:
  - **Deluxe Room** → **BAR** columns (today through next 7 days)
  - **Superior Room** → **BAR** and **CORP** columns (tomorrow through 3 days from now)

### 2. **Test Tooltip Functionality**
```javascript
// Run this in browser console for instant validation:
const lockIcons = document.querySelectorAll('.tooltip-icon-area');
console.log(`Found ${lockIcons.length} lock icon tooltip areas`);

// Test hover on first lock icon
if (lockIcons.length > 0) {
  lockIcons[0].dispatchEvent(new MouseEvent('mouseenter', {
    bubbles: true, clientX: 100, clientY: 100
  }));
  console.log('✅ Hover event triggered!');
}
```

### 3. **Expected Tooltip Content**
When hovering over a lock icon, you should see:

```
🔒 Active Restrictions
2 restrictions applied

• MinLOS (Minimum Length of Stay) [MINLOS]
  MinLOS enforces a minimum number of nights...
  Value: 3
  Note: Sample restriction for tooltip testing

• CTA (Closed to Arrival) [CTA]
  CTA blocks guests from starting their stay...
  Note: Test CTA restriction for maintenance period
```

## 🔧 **Troubleshooting**

### If No Lock Icons Appear:
1. **Check Console for Errors**: Press F12 → Console tab
2. **Verify Restrictions**: Run in console:
   ```javascript
   // Check if restrictions exist
   console.log('Restrictions:', window.__NEXT_DATA__ || 'Check React DevTools');
   ```
3. **Check Date Range**: Restrictions are set for today + next 7 days
4. **Hard Refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### If Lock Icons Appear But No Tooltips:
1. **Check Hover Events**: Look for console logs when hovering
2. **Check CSS Z-Index**: Tooltip should have z-index: 1000+
3. **Verify Event Handlers**: 
   ```javascript
   // Check if event handlers are attached
   const lockArea = document.querySelector('.tooltip-icon-area');
   console.log('Has mouseenter:', lockArea?.onmouseenter !== null);
   ```

### If Tooltips Appear But Wrong Content:
1. **Check Restriction Data**: Tooltip should show restriction details
2. **Verify getRestrictionTooltipData**: Function should return valid data
3. **Check showRichTooltip**: Function should set richTooltip state

## 📍 **Exact Testing Locations**

### Primary Test Area (MinLOS restriction):
- **Row**: "Deluxe Room" 
- **Column**: "BAR" rate plan
- **Dates**: Today through next 7 days
- **Expected**: Orange lock icon with MinLOS tooltip

### Secondary Test Area (CTA restriction):
- **Row**: "Superior Room"
- **Columns**: "BAR" and "CORP" rate plans  
- **Dates**: Tomorrow through 3 days from now
- **Expected**: Orange lock icon with CTA tooltip

## 🎯 **Success Criteria**

✅ **Visual Confirmation**:
- Orange lock icons visible in rate grid
- Icons positioned in correct cells based on restrictions

✅ **Interaction Confirmation**:
- Console logs when hovering: `🖱️ Hovering on restriction icon:`
- Tooltip appears after 150ms delay
- Tooltip shows restriction details

✅ **Content Confirmation**:
- Tooltip header shows "Active Restrictions"
- Shows restriction count
- Lists restriction details with codes and descriptions

## 🚀 **Advanced Testing**

### Test Multiple Restrictions:
```javascript
// Create additional test restriction
const newRestriction = {
  id: 'test-advanced',
  restrictionType: { 
    name: 'Test Restriction', 
    code: 'TEST',
    description: 'Advanced testing restriction'
  },
  // ... other properties
};
```

### Test Tooltip Positioning:
- Hover near screen edges to test auto-positioning
- Verify tooltip doesn't go off-screen
- Check different room types and date columns

## 📝 **Report Results**

If tooltips are working:
- ✅ "Lock icons visible and tooltips working!"
- Share screenshot of tooltip showing restriction details

If tooltips are not working:
- ❌ Specify: "No lock icons" OR "Icons but no tooltips" OR "Wrong content"
- Share browser console errors
- Confirm you're testing the correct locations above 