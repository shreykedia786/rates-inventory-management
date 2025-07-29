# Phase 1: MVP / Pilot (Foundational Core)
**Rates & Inventory Management Platform**

---

## Executive Summary

**Objective:** Rapidly solve the top pain points for a pilot property or cluster and validate integrations, UX, and core workflows within a 6-month timeline.

**Success Criteria:**
- Reduce manual rate update time by 50%
- Achieve 90%+ sync accuracy across channels
- 80% user satisfaction with pilot users
- Deploy to 1-2 pilot properties (10-20 users)

**Timeline:** 6 months (0-6 months)
**Team:** 10-11 core members
**Budget:** TBD based on infrastructure and integration costs

---

## 1. User Access & Security

### 1.1 Authentication System

**Requirements:**
- Secure username/password authentication
- Session management with configurable timeout
- Password complexity requirements
- Account lockout after failed attempts
- Password reset functionality

**User Stories:**
```
As a Revenue Manager,
I want to log in securely to the platform
So that I can access my property's rates and inventory data

Acceptance Criteria:
- User can log in with email/username and password
- Session expires after 8 hours of inactivity
- Failed login attempts are logged and tracked
- Password must meet complexity requirements (8+ chars, mixed case, numbers, symbols)
- User receives email notification for password reset requests
```

**Technical Specifications:**
- JWT-based authentication with refresh tokens
- Bcrypt password hashing (cost factor 12)
- Rate limiting: 5 login attempts per minute per IP
- Session storage in Redis with TTL

### 1.2 Role-Based Access Control (RBAC)

**User Roles:**

| Role | Permissions | Scope |
|------|-------------|-------|
| **Revenue Manager** | Full CRUD on rates, inventory, restrictions | Single property |
| **Distribution Manager** | Read rates, manage channel sync, approve bulk changes | Single/multiple properties |
| **Corporate Admin** | User management, property setup, cross-property access | Organization level |
| **AI Viewer** | Read-only access to AI insights and recommendations | Assigned properties |
| **Operations** | Monitor sync status, view audit logs, basic support | System-wide read-only |

**Permission Matrix:**
```
Feature Area              | Rev Mgr | Dist Mgr | Corp Admin | AI Viewer | Operations
-------------------------|---------|----------|------------|-----------|------------
View Rates/Inventory     |   ✓     |    ✓     |     ✓      |     ✓     |     ✓
Edit Rates/Inventory     |   ✓     |    ✓*    |     ✓      |     ✗     |     ✗
Bulk Operations          |   ✓     |    ✓*    |     ✓      |     ✗     |     ✗
Channel Sync             |   ✓     |    ✓     |     ✓      |     ✗     |     ✗
AI Insights              |   ✓     |    ✓     |     ✓      |     ✓     |     ✓
User Management          |   ✗     |    ✗     |     ✓      |     ✗     |     ✗
Audit Logs               |   ✓     |    ✓     |     ✓      |     ✓     |     ✓
System Settings          |   ✗     |    ✗     |     ✓      |     ✗     |     ✓

* Requires approval workflow for changes > $50 or > 50 rooms
```

**User Stories:**
```
As a Corporate Admin,
I want to assign specific roles to users
So that they can only access data and features appropriate to their responsibilities

Acceptance Criteria:
- Admin can create, edit, and deactivate user accounts
- Role assignments are immediately enforced across all features
- Users cannot access features outside their role scope
- Permission changes are logged in audit trail
- Users receive email notification of role changes
```

### 1.3 Multi-Factor Authentication (MFA)

**Requirements:**
- TOTP-based MFA (Google Authenticator, Authy compatible)
- QR code enrollment process
- Backup codes generation
- MFA bypass for trusted devices (optional)

**User Stories:**
```
As a system administrator,
I want to require MFA for all users
So that we maintain high security standards for sensitive revenue data

Acceptance Criteria:
- Users must complete MFA setup within 7 days of account creation
- TOTP codes are 6-digit with 30-second expiry
- 10 backup codes generated during setup
- Users can re-generate backup codes
- MFA can be temporarily disabled by admin for user support
```

### 1.4 Multi-Tenancy & Data Isolation

**Architecture:**
- Row-level security with property_id/organization_id
- Database-level isolation for tenant data
- API-level tenant context validation
- UI-level data filtering

**User Stories:**
```
As a Revenue Manager,
I want to see only my property's data
So that I don't accidentally modify rates for other properties

Acceptance Criteria:
- User can only access data for assigned properties
- All API responses are filtered by user's property access
- Cross-tenant data leakage is prevented at database level
- Audit logs capture tenant context for all actions
```

---

## 2. Rates & Inventory Management

### 2.1 Spreadsheet/Grid Interface

**Design Specifications:**
- **Grid Component:** AG Grid with custom styling
- **Layout:** Fixed header with scrollable content area
- **Columns:** Date, Room Type, Rate Plan, Rate, Inventory, Restrictions, Competitor Rates, AI Suggestions
- **Interaction:** Click-to-edit cells, keyboard navigation, copy/paste support
- **Visual Hierarchy:** Clear column headers, alternating row colors, selected cell highlighting

**Grid Features:**
- Infinite scrolling for large date ranges
- Column resizing, reordering, and pinning
- Row grouping by room type or rate plan
- Cell formatting based on data type (currency, numbers, dates)
- Conditional formatting for validation errors, AI suggestions, and changes

**User Stories:**
```
As a Revenue Manager,
I want to view rates and inventory in a spreadsheet-like interface
So that I can quickly scan and understand my property's pricing strategy

Acceptance Criteria:
- Grid displays 90 days of data by default
- Users can extend date range to 365 days
- All cells are keyboard accessible (Tab, Enter, Arrow keys)
- Copy/paste works between cells and external spreadsheets
- Grid performance remains smooth with 10,000+ cells
- Changes are highlighted until saved/synced
```

### 2.2 Inline Editing

**Functionality:**
- Single-click to edit cells
- Real-time validation with inline error messages
- Auto-save after 2 seconds of inactivity
- Undo/redo functionality (Ctrl+Z, Ctrl+Y)
- Batch save for multiple changes

**Validation Rules:**
- Rates: Must be positive numbers, respect min/max pricing rules
- Inventory: Must be integers, cannot exceed room capacity
- Dates: Cannot modify past dates beyond 24 hours
- Restrictions: Logical validation (e.g., MinLOS ≤ MaxLOS)

**User Stories:**
```
As a Revenue Manager,
I want to edit rates directly in the grid
So that I can make quick adjustments without navigating to separate forms

Acceptance Criteria:
- Single click activates edit mode for any cell
- Tab key moves to next editable cell
- Enter key saves current cell and moves to cell below
- Invalid entries show red border with error tooltip
- Changes are queued and batch-saved every 2 seconds
- User sees "Saving..." indicator during save operations
```

### 2.3 Bulk Editing & Operations

**Bulk Edit Modal Design:**
- **Trigger:** Multi-select cells/rows + right-click or bulk action button
- **Interface:** Modal with form fields for selected data type
- **Preview:** Before/after comparison table
- **Confirmation:** Two-step confirmation with impact summary

**Supported Operations:**
- Rate adjustments (absolute, percentage, fixed increment)
- Inventory updates (set value, adjust by amount)
- Restriction changes (apply to date range)
- Copy rates/inventory between date ranges
- Apply rate plan templates

**User Stories:**
```
As a Revenue Manager,
I want to apply a 10% rate increase to all weekends in December
So that I can efficiently implement seasonal pricing strategies

Acceptance Criteria:
- User can select multiple cells using Shift+Click or Ctrl+Click
- Bulk edit modal shows selected cell count and date range
- Preview table shows old vs new values before applying
- User can apply percentage changes, fixed amounts, or set specific values
- Bulk operations are atomic (all succeed or all fail)
- Progress indicator shows completion status for large bulk operations
```

### 2.4 Channel Selection & Management

**Channel Interface:**
- Multi-select dropdown with channel logos
- Channel status indicators (connected, syncing, error)
- Quick toggle for "Apply to all channels"
- Channel-specific rate/inventory overrides

**Supported Channels (Phase 1):**
- Booking.com
- Expedia
- Agoda
- Hotels.com
- Direct booking (PMS)

**User Stories:**
```
As a Distribution Manager,
I want to select which channels receive rate updates
So that I can maintain different pricing strategies per channel

Acceptance Criteria:
- User can select individual channels or "All channels" option
- Channel selection is persistent across sessions
- Visual indicators show sync status for each channel
- User can override global rates with channel-specific pricing
- Channel selection affects all bulk operations
```

---

## 3. Restrictions Management

### 3.1 Restriction Types

| Restriction | Description | Valid Values | Business Logic |
|-------------|-------------|--------------|----------------|
| **MinLOS** | Minimum Length of Stay | 1-30 days | Cannot exceed MaxLOS |
| **MaxLOS** | Maximum Length of Stay | 1-365 days | Must be ≥ MinLOS |
| **CTA** | Closed to Arrival | Boolean | Prevents new bookings starting on date |
| **CTD** | Closed to Departure | Boolean | Prevents bookings ending on date |
| **Stop Sell** | Close inventory | Boolean | Overrides all other settings |

### 3.2 Restrictions Interface

**Design:**
- Dedicated columns in main grid
- Color-coded cell backgrounds (red for restrictions, green for open)
- Bulk restriction tools in sidebar
- Calendar overlay for visual restriction patterns

**User Stories:**
```
As a Revenue Manager,
I want to set a 3-night minimum stay for New Year's weekend
So that I can maximize revenue during high-demand periods

Acceptance Criteria:
- User can set MinLOS values directly in grid cells
- Restriction changes are immediately visible with color coding
- Bulk restriction tools allow setting patterns (e.g., all weekends)
- Conflicts between restrictions are flagged (e.g., CTA + CTD)
- Restrictions sync to all selected channels within 5 minutes
```

### 3.3 Restriction Validation

**Validation Rules:**
- MinLOS/MaxLOS logical consistency
- CTA/CTD conflict detection
- Stop Sell overrides all other restrictions
- Historical restriction changes require approval
- Channel-specific restriction compatibility checks

---

## 4. Integrations

### 4.1 Channel Manager API Integration

**Supported Channel Managers:**
- RateGain
- SiteMinder
- Derbysoft
- TravelClick
- eviivo

**Integration Requirements:**
- Real-time bidirectional sync (rates, inventory, restrictions)
- Error handling and retry logic
- Sync status monitoring
- Conflict resolution (last-write-wins with audit trail)

**API Specifications:**
```
POST /api/v1/channel-sync
{
  "property_id": "string",
  "channel_id": "string",
  "sync_type": "rates|inventory|restrictions",
  "data": {
    "date_range": {
      "start_date": "2024-01-01",
      "end_date": "2024-01-31"
    },
    "room_types": ["standard", "deluxe"],
    "rate_plans": ["bar", "corporate"],
    "updates": [
      {
        "date": "2024-01-01",
        "room_type": "standard",
        "rate_plan": "bar",
        "rate": 199.00,
        "inventory": 10,
        "restrictions": {
          "min_los": 2,
          "max_los": 7,
          "cta": false,
          "ctd": false,
          "stop_sell": false
        }
      }
    ]
  }
}
```

**User Stories:**
```
As a Distribution Manager,
I want rate changes to sync automatically to all connected channels
So that pricing is consistent across all distribution points

Acceptance Criteria:
- Rate changes sync to channels within 5 minutes
- Sync status is visible in the interface (success, pending, failed)
- Failed syncs trigger retry mechanism (3 attempts with exponential backoff)
- User receives notification for persistent sync failures
- Sync history is available in audit logs
```

### 4.2 PMS/CRS Data Integration

**Data Sources:**
- Property Management System (Opera, Protel, etc.)
- Central Reservation System
- Revenue Management System

**Data Sync Requirements:**
- Hourly sync for inventory updates
- Daily sync for rate plans and room types
- Real-time sync for restriction changes
- Historical data import for baseline setup

**User Stories:**
```
As a Revenue Manager,
I want current inventory levels automatically updated from our PMS
So that I don't oversell rooms or miss revenue opportunities

Acceptance Criteria:
- Inventory levels sync from PMS every hour
- Discrepancies between PMS and platform are flagged
- User can manually trigger sync for immediate updates
- Sync errors are logged and reported to operations team
- Historical sync data is retained for 90 days
```

### 4.3 Rate Shopper API Integration

**Competitor Data:**
- Daily rate collection for comp set properties
- Rate parity monitoring
- Market positioning insights
- Pricing gap analysis

**Rate Shopper Display:**
- Dedicated column in main grid
- Competitor rate overlay on hover
- Rate positioning indicators (above/below market)
- Historical competitor rate trends

**User Stories:**
```
As a Revenue Manager,
I want to see competitor rates alongside my rates
So that I can make informed pricing decisions

Acceptance Criteria:
- Competitor rates display in dedicated grid column
- Rates are updated daily at 6 AM local time
- User can see rate positioning vs. comp set average
- Historical competitor data is available for 30 days
- Missing competitor data is clearly indicated
```

---

## 5. AI Insights

### 5.1 Basic Rate Suggestions

**Algorithm (Phase 1):**
- Comp set average calculation
- Seasonal adjustment factors
- Day-of-week patterns
- Simple demand indicators

**Suggestion Display:**
- Subtle badge/icon in rate cells
- Hover tooltip with suggestion details
- Percentage variance from current rate
- Confidence level indicator

**User Stories:**
```
As a Revenue Manager,
I want to see AI-suggested rates based on competitor pricing
So that I can stay competitive while maximizing revenue

Acceptance Criteria:
- AI suggestions appear as subtle icons next to rate cells
- Hover shows suggested rate and reasoning (e.g., "5% below comp set avg")
- User can accept suggestion with single click
- Suggestions are updated daily based on fresh competitor data
- User can disable AI suggestions by room type or rate plan
```

### 5.2 Inline Competitor Rate Display

**Features:**
- Real-time competitor rate overlay
- Rate parity alerts
- Market position indicators
- Trend analysis (7-day, 30-day)

**Visual Design:**
- Color-coded rate comparison (green = competitive, red = overpriced)
- Compact competitor rate list on hover
- Market position badge (e.g., "2nd lowest in comp set")

---

## 6. Audit & Validation

### 6.1 Change Log & Audit Trail

**Audit Data Capture:**
- User ID and timestamp for all changes
- Before/after values for rate/inventory/restriction changes
- Source of change (manual, API, bulk operation)
- IP address and session information
- Channel sync status and results

**Audit Interface:**
- Searchable audit log with filters
- Change history for specific dates/rooms
- User activity reports
- Export functionality for compliance

**User Stories:**
```
As a Corporate Admin,
I want to see a complete history of all rate changes
So that I can ensure compliance and resolve discrepancies

Acceptance Criteria:
- All changes are logged with user, timestamp, and values
- Audit log is searchable by user, date range, and change type
- Export functionality available in CSV/Excel format
- Audit data is retained for 7 years
- Logs are tamper-proof and include data integrity checks
```

### 6.2 Inline Validation

**Validation Rules:**
- Rate limits (minimum $10, maximum $10,000)
- Inventory limits (cannot exceed room capacity)
- Logical restrictions (MinLOS ≤ MaxLOS)
- Channel-specific requirements
- Business rule compliance

**Validation Display:**
- Red cell borders for errors
- Warning icons for soft validations
- Tooltip explanations for validation failures
- Bulk validation summary in sidebar

**User Stories:**
```
As a Revenue Manager,
I want immediate feedback when I enter invalid data
So that I can correct errors before they impact bookings

Acceptance Criteria:
- Invalid entries show red border immediately
- Tooltip explains validation error clearly
- User cannot save/sync invalid data
- Bulk operations show validation summary before execution
- Warnings are shown for unusual but valid entries
```

### 6.3 Real-time Error Handling & Notifications

**Error Categories:**
- Validation errors (user input)
- Sync failures (integration issues)
- System errors (technical problems)
- Business rule violations

**Notification System:**
- In-app toast notifications
- Email alerts for critical errors
- Dashboard error summary
- Escalation to operations team

---

## 7. Admin Features

### 7.1 Channel Mapping & Configuration

**Channel Setup:**
- Channel authentication (API keys, credentials)
- Room type and rate plan mapping
- Sync frequency configuration
- Channel-specific business rules

**Mapping Interface:**
- Drag-and-drop mapping between PMS and channel room types
- Rate plan alignment tools
- Bulk mapping templates
- Validation of mapping completeness

**User Stories:**
```
As a Corporate Admin,
I want to map PMS room types to channel room types
So that rates and inventory sync correctly across all channels

Acceptance Criteria:
- Admin can create mappings between PMS and channel room types
- Mapping validation prevents orphaned or duplicate mappings
- Bulk mapping tools for multi-property setup
- Mapping changes require confirmation before activation
- Mapping history is maintained for troubleshooting
```

### 7.2 User Management

**User Administration:**
- User account creation and management
- Role assignment and modification
- Property access control
- Account activation/deactivation

**User Interface:**
- User list with search and filtering
- Bulk user operations
- Role assignment matrix
- Activity monitoring dashboard

---

## 8. Technical Architecture

### 8.1 Frontend Stack
- **Framework:** React 18 with TypeScript
- **UI Components:** shadcn/ui with Tailwind CSS
- **Grid Component:** AG Grid Enterprise
- **State Management:** React Query + Zustand
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation

### 8.2 Backend Stack
- **Framework:** Node.js + NestJS
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis for sessions and temporary data
- **Message Queue:** RabbitMQ for async processing
- **Authentication:** JWT with refresh tokens
- **API Documentation:** OpenAPI/Swagger

### 8.3 Infrastructure
- **Cloud Provider:** AWS
- **Containerization:** Docker + ECS
- **Database:** RDS PostgreSQL
- **CDN:** CloudFront
- **Monitoring:** DataDog
- **CI/CD:** GitHub Actions

---

## 9. Success Metrics & KPIs

### 9.1 User Experience Metrics
- **Time to update rates:** < 30 seconds for single property
- **Bulk operation completion:** < 2 minutes for 1000 updates
- **Page load time:** < 3 seconds for grid with 90 days of data
- **Error rate:** < 1% for all user operations
- **User satisfaction:** > 80% in post-pilot survey

### 9.2 Integration Reliability
- **Sync success rate:** > 99% for all channel integrations
- **Sync latency:** < 5 minutes for rate/inventory updates
- **API uptime:** > 99.9% availability
- **Data accuracy:** > 99.5% matching between systems

### 9.3 Business Impact
- **Manual work reduction:** 50% decrease in time spent on rate updates
- **Revenue optimization:** 3-5% improvement in RevPAR
- **Error reduction:** 80% fewer pricing errors
- **User adoption:** 90% of pilot users actively using the platform

---

## 10. Implementation Timeline

### Month 1: Foundation & Architecture
- **Week 1-2:** Infrastructure setup, database design, API contracts
- **Week 3-4:** Authentication system, RBAC implementation, basic UI framework

### Month 2: Core Grid & Editing
- **Week 1-2:** AG Grid integration, inline editing, validation framework
- **Week 3-4:** Bulk operations, restrictions management, audit logging

### Month 3: Integrations
- **Week 1-2:** Channel manager API integration, sync framework
- **Week 3-4:** PMS/CRS integration, rate shopper API connection

### Month 4: AI & Advanced Features
- **Week 1-2:** Basic AI suggestions, competitor rate display
- **Week 3-4:** Admin features, user management, channel mapping

### Month 5: Testing & Refinement
- **Week 1-2:** End-to-end testing, performance optimization
- **Week 3-4:** Security audit, user acceptance testing preparation

### Month 6: Pilot Launch
- **Week 1-2:** Pilot property onboarding, user training
- **Week 3-4:** Live pilot monitoring, feedback collection, bug fixes

---

## 11. Risk Mitigation

### 11.1 Technical Risks
- **Integration failures:** Comprehensive testing with sandbox environments
- **Performance issues:** Load testing with realistic data volumes
- **Data inconsistency:** Strong validation and reconciliation processes
- **Security vulnerabilities:** Regular security audits and penetration testing

### 11.2 User Adoption Risks
- **Learning curve:** Comprehensive training materials and onboarding
- **Resistance to change:** Gradual rollout with pilot champions
- **Feature gaps:** Tight feedback loops during pilot phase
- **Support burden:** Dedicated support team and documentation

---

## 12. Open Questions & Assumptions

### Assumptions Made:
1. Pilot properties have existing channel manager integrations
2. Users are comfortable with spreadsheet-like interfaces
3. Basic AI suggestions will provide immediate value
4. 6-month timeline is sufficient for MVP development

### Questions for Stakeholder Alignment:
1. What is the preferred channel manager for pilot integration?
2. Are there specific compliance requirements we need to address?
3. What level of historical data needs to be imported?
4. Should we include mobile responsiveness in Phase 1?
5. What is the budget for third-party AI/ML services?

---

## 13. Next Steps

1. **Stakeholder Review:** Present Phase 1 plan to leadership team
2. **Technical Deep Dive:** Detailed architecture review with engineering team
3. **Pilot Selection:** Identify and onboard 1-2 pilot properties
4. **Integration Planning:** Finalize API contracts with channel manager partners
5. **Team Assembly:** Complete hiring for remaining team positions
6. **Development Kickoff:** Begin Month 1 development activities

---

*This document serves as the comprehensive blueprint for Phase 1 development. All specifications are subject to refinement based on stakeholder feedback and technical discoveries during implementation.* 