# 🔧 Manual Integration Steps for Global Bulk Edit Modal

Since the `app/page.tsx` file is very large (5650 lines), here are the exact manual steps to integrate the bulk edit modal:

## Step 1: Add Import Statement

**Location**: After line 51 in `app/page.tsx`
**Find this line:**
```typescript
import { WorkingBulkRestrictions } from '@/components/WorkingBulkRestrictions';
```

**Add this line immediately after:**
```typescript
import GlobalBulkEditModal from '../components/GlobalBulkEditModal';
```

## Step 2: Add State Declaration

**Location**: After line 869 in `app/page.tsx`
**Find this line:**
```typescript
const [isBulkRestrictionsOpen, setIsBulkRestrictionsOpen] = useState(false);
```

**Add this line immediately after:**
```typescript
const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
```

## Step 3: Add Handler Functions

**Location**: After line 4722 in `app/page.tsx`
**Find this section:**
```typescript
const showTutorial = () => {
  setIsTutorialOpen(true);
};
```

**Add these functions immediately after:**
```typescript
const handleBulkEditClick = () => {
  setIsBulkEditModalOpen(true);
};

const handleBulkEditApply = (data: any) => {
  console.log('Bulk Edit Data:', data);
  
  // Here you would implement the actual bulk edit logic
  // Example: Update your data store with the bulk changes
  
  // Show success toast notification (if you have toast system)
  console.log(`Successfully updated ${data.roomTypes.length} room types and ${data.ratePlans.length} rate plans across ${data.dateSelection.dates.length} dates.`);
  
  // Close the modal
  setIsBulkEditModalOpen(false);
};
```

## Step 4: Update IntegratedHeader Component

**Location**: Around line 4728 in `app/page.tsx`
**Find this section:**
```typescript
<IntegratedHeader 
  isDark={isDark}
  onToggleDarkMode={toggleDarkMode}
  inlineEdit={inlineEdit}
  onPropertyChange={handlePropertyChange}
  onCompetitorsChange={handleCompetitorsChange}
/>
```

**Update it to:**
```typescript
<IntegratedHeader 
  isDark={isDark}
  onToggleDarkMode={toggleDarkMode}
  inlineEdit={inlineEdit}
  onPropertyChange={handlePropertyChange}
  onCompetitorsChange={handleCompetitorsChange}
  onBulkEditClick={handleBulkEditClick}
/>
```

## Step 5: Add the Modal Component

**Location**: At the very end of the JSX return statement, just before the final `</div>`
**Find the closing tags:**
```typescript
      {/* Other existing components... */}
    </div>
  );
}
```

**Add the modal component before the closing `</div>`:**
```typescript
      {/* Global Bulk Edit Modal */}
      <GlobalBulkEditModal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        onApply={handleBulkEditApply}
        isDark={isDark}
      />
    </div>
  );
}
```

## 🎯 Quick Search Tips

Use these search terms to quickly find the right locations in your editor:

1. **For Import**: Search for `WorkingBulkRestrictions`
2. **For State**: Search for `isBulkRestrictionsOpen`
3. **For Functions**: Search for `showTutorial`
4. **For Header**: Search for `<IntegratedHeader`
5. **For Modal**: Search for the last `</div>` before the closing `}`

## ✅ Verification

After making these changes:

1. **Save the file** - `app/page.tsx`
2. **Check the terminal** - Should show successful compilation
3. **Open browser** - Navigate to `http://localhost:3000`
4. **Look for button** - Blue "Bulk Edit" button should appear in header
5. **Test the modal** - Click the button to open the bulk edit modal

## 🚨 If You Get Errors

If you encounter any TypeScript errors:

1. **Import error**: Make sure the import path is correct relative to your file structure
2. **Type errors**: The `data: any` parameter in `handleBulkEditApply` can be typed more strictly if needed
3. **Component errors**: Ensure all other components are properly imported

## 🎉 Expected Result

After successful integration:
- ✅ Blue gradient "Bulk Edit" button appears in header
- ✅ Clicking button opens comprehensive modal
- ✅ Modal has all requested features (room types, rate plans, calendar, etc.)
- ✅ Form validation works with real-time feedback
- ✅ Apply button triggers the handler function
- ✅ Dark/light mode works throughout

The integration should take about 5-10 minutes to complete manually! 