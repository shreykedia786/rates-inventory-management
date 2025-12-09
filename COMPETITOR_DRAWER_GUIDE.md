# 🎯 Competitor Drawer & Parity Data - User Guide

## 📍 Where to Find It

### Step 1: Open the Application
- Navigate to: **http://localhost:3003**
- You should see the main pricing grid with room types and rate plans

### Step 2: Locate the Competitor Button
The competitor button appears in **every pricing cell** that has competitor data. Look for:

**Visual Location:**
```
┌─────────────────────────┐
│  ₹6,500                 │  ← Price (top-left)
│                         │
│                         │
│                    👥📊 │  ← Competitor Button (bottom-right)
└─────────────────────────┘
```

**Button Appearance:**
- **Parity (within 3%)**: Shows `👥 ➖ PARITY` with yellow color
- **Above Market**: Shows `👥 ⬆️ 5%` with green color  
- **Below Market**: Shows `👥 ⬇️ 8%` with red color

### Step 3: Click the Button
Click anywhere on the competitor button to open the **Competitor Side Drawer**

## 🔍 What You'll See in the Drawer

### Tab 1: Competitors
1. **Your Rates Section** (Top)
   - Shows your pricing across all channels
   - Displays current cell price vs. your lowest rate
   - Live channel data with availability

2. **Competitor List** (Scrollable)
   - Each competitor shows:
     - Name, rating, distance
     - Average rate vs. lowest available rate
     - Channel-by-channel breakdown
     - Scraping timestamps (Fresh/Recent/Stale indicators)

3. **Features:**
   - Search competitors by name
   - Filter by channels (All Channels dropdown)
   - Sort by rate, rating, or distance
   - Synchronized horizontal scrolling across all competitor channels

### Tab 2: AI Insights
1. **Strategic Market Positioning**
   - Your market ranking (#1, #2, etc.)
   - Percentage difference vs. market average
   - Market spread analysis

2. **Strategic Revenue Management Framework**
   - AI-powered recommendations
   - Revenue optimization strategies
   - Risk assessments
   - Expected impact and timeframes

3. **Executive Revenue Intelligence Dashboard**
   - Monthly revenue gap analysis
   - Market share estimates
   - Market efficiency metrics
   - Pricing opportunity assessment

## 🎨 Visual Indicators

### In the Grid Cells:
- **Yellow "PARITY"**: Your rate is within 3% of market average
- **Green with %**: Your rate is above market (premium position)
- **Red with %**: Your rate is below market (value position)

### In the Drawer:
- **Green badges**: Fresh data (< 30 minutes)
- **Yellow badges**: Recent data (30-90 minutes)
- **Red badges**: Stale data (> 90 minutes)
- **Green highlight**: Lowest rate channel for each competitor

## 🧪 Testing Checklist

✅ **Test 1: Button Visibility**
- [ ] Can you see competitor buttons on pricing cells?
- [ ] Do buttons show "PARITY" when rates are similar?
- [ ] Do buttons show percentages when rates differ?

✅ **Test 2: Drawer Opening**
- [ ] Click a competitor button - does drawer open from the right?
- [ ] Is the drawer full-width and properly styled?
- [ ] Can you close it with the X button or by clicking outside?

✅ **Test 3: Competitors Tab**
- [ ] Do you see "Your Rates" section at the top?
- [ ] Are competitor cards showing with channel breakdowns?
- [ ] Can you scroll horizontally through channels?
- [ ] Do scraping timestamps show correctly?

✅ **Test 4: AI Insights Tab**
- [ ] Click "AI Insights" tab - does it switch?
- [ ] Do you see market positioning metrics?
- [ ] Are strategic recommendations displayed?
- [ ] Is the executive dashboard visible?

✅ **Test 5: Date Navigation**
- [ ] Use prev/next arrows in drawer header
- [ ] Does the date change correctly?
- [ ] Does competitor data update for new date?

✅ **Test 6: Filters & Search**
- [ ] Try searching for a competitor name
- [ ] Use channel filter dropdown
- [ ] Sort by rate/rating/distance
- [ ] Do filters work correctly?

## 🐛 Troubleshooting

### Button Not Visible?
- Check if the cell has `competitorData` in the data structure
- Look in browser console for errors
- Verify the cell is not in edit mode

### Drawer Not Opening?
- Check browser console for JavaScript errors
- Verify z-index is not blocked by other elements
- Try clicking different cells

### No Data Showing?
- Check that `competitorData.competitors` array has items
- Verify `userChannels` data is being passed
- Look for data transformation errors in console

## 📊 Expected Data Structure

Each pricing cell should have:
```typescript
{
  rate: 6500,
  competitorData: {
    competitors: [
      {
        name: "Paradise Resort",
        rate: 8200,
        rating: 4.2,
        distance: 2.1,
        channels: [...]
      },
      // ... more competitors
    ],
    ownChannels: [
      {
        channel: "Direct Website",
        rate: 6500,
        availability: 75,
        // ...
      }
    ]
  }
}
```

## 🎯 Quick Test Locations

**Best cells to test:**
1. **Standard Room > Best Available Rate** - First cell (should have competitor data)
2. **Standard Room > Advance Purchase** - Should show different competitor rates
3. **Any weekend cell** - May show different parity status

**Look for cells with:**
- Multiple competitors (4+ competitors)
- Different rate ranges (to see parity vs. percentage)
- Weekend vs. weekday differences

---

**Need Help?** Check the browser console (F12) for any errors or warnings.

