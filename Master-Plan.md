1. Project Overview
Title:
Manage Rates & Inventory — Date-wise Control for Multi-Channel Distribution

Prepared For:
Revenue Managers, Distribution Managers

Prepared By:
Product & UX Team — UNO

Version: v1.0
Date: 12 June 2025

2. Objective
Design a centralized interface for revenue managers and distribution teams to easily manage rates, inventory, and restrictions date-wise across multiple channels—with embedded AI insights to simplify decisions and reduce errors.

3. Target Audience
Primary: Revenue Managers, Distribution Managers, Cluster Revenue Teams (chains/multi-property)

Secondary: Corporate strategy teams, hotel owners, support/ops

4. Phase 1: MVP / Pilot (Foundational Core)
Objective: Rapidly solve the top pain points for a pilot property or cluster and validate integrations, UX, and core workflows.

User Access & Security

Username/password login

Role-based access control (RBAC)

Basic MFA (TOTP)

Multi-tenancy (property/org data isolation)

Rates & Inventory Management

Spreadsheet/grid UI (Airtable-style)

Inline and bulk editing for rates, inventory, and restrictions

Channel selection (single/multi-channel)

Bulk update/copy (dates & products)

Restrictions Management

MinLOS, MaxLOS, CTA, CTD, Stop Sell

Integrations

Channel manager API (real-time sync)

PMS/CRS data fetch

Rate shopper API (competitor rates, read-only)

AI Insights

Basic rate suggestion (comp-set average)

Inline competitor rate display

Audit & Validation

Change log/audit trail

Inline validation for inventory/pricing rules

Real-time error handling & user notifications

Admin

Channel mapping & user management

Phase 2: Post-Pilot Expansion (Growth & Depth)
Objective: Expand to more properties, deepen automation, and differentiate with explainable AI and enhanced controls.

User Access & Security

Full SSO (OAuth2/SAML)

Granular RBAC

Security/compliance audit improvements

Rates & Inventory Management

Derived/linked rates (parent-child, formulas)

Market segmentation pricing

Self-serve property onboarding

AI Insights

Explainable AI (“why” logic)

Anomaly detection for outliers

Demand overlays (occupancy, pace projections)

Custom model fine-tuning

Integrations & Automation

Broader PMS/CM partner integrations

Automated mapping for new properties

Upgraded notification system (email, SMS, webhook)

Reporting & Analytics

Dashboards (change history, sync status, basic KPIs)

Support & Monitoring

Ops dashboard (sync/error monitoring)

End-user support flows

Phase 3: Advanced & Enterprise
Objective: Deliver AI/ML-driven value, global-scale operations, and deep enterprise readiness.

User Access & Security

Device-based MFA (WebAuthn)

Delegated admin controls

Full GDPR automation

Rates & Inventory Management

Scenario modeling (“what-if”)

Calendar overlays (events, demand, market)

Full rate plan automation (rules, cascading logic)

AI Insights

Advanced forecasting (internal ML, 3rd-party)

Automated dynamic pricing recommendations

Market anomaly and trend alerts

Conversational AI assistant

Integrations & Automation

Open API ecosystem & marketplace

Real-time push notifications (Slack, Teams, mobile)

Reporting & Analytics

Custom dashboards

Cross-property analytics

Predictive analytics (future trends, demand)

Support & Ops

Enterprise support playbooks

AI-powered monitoring/alerting





5. Core Features & Functionality (MVP Scope)
Authentication/RBAC/MFA

Secure login (username/password), role-based access, MFA support

Multi-Tenancy

Full data isolation and RBAC by property/organization

Rates & Inventory Management Grid

Spreadsheet UI, inline & bulk edits, channel selection

Restrictions Management

MinLOS, MaxLOS, CTA, CTD, Stop Sell

Channel Manager Integration

Near real-time API sync for rates/inventory (with validation/retries)

Competitor Rate Insights

Display competitor pricing from Rate Shopper API (read-only)

AI Rate Suggestion

Basic: show comp-set averages as recommended rate

Change Log/Audit Trail

Full history of all changes, user/action/timestamp

Basic Notifications

Success/failure status for sync actions, errors inline

Admin Settings

Channel mapping, user management

5. User Roles & Permissions
Revenue Manager: Full control at property level

Distribution Manager: Approvals, channel sync management

Corporate Admin: Cross-property/brand controls

AI Viewer/Read-only/Ops: Segregated access by function

6. UI/UX Design Principles
Modern, clean, “Airtable meets Linear” spreadsheet grid

High data density, never cluttered

Inline-first editing, minimal modal use

Subtle color cues for context (AI, errors, restrictions)

Keyboard shortcuts and bulk actions

Fast micro-interactions for feedback

7. Integrations & Data Sources
PMS/CRS: Room, rate, inventory data (varied APIs)

Channel Manager: OTA sync (RateGain, Siteminder, Derbysoft, etc.)

Rate Shopper: Market/competitor data APIs

Standardization Layer: Orchestrates/normalizes data feeds

8. Real-Time/Validation Needs
Near-instant OTA sync for rates/inventory

1–5 min polling for PMS/CRS data

15–30 min refresh for competitor data

Audit trail on all changes

Strong validation: no negative inventory, pricing rules, channel constraints, rollback on failure

9. Security & Compliance
Username/password + SSO (phased)

MFA (configurable)

RBAC, permissions matrix, audit logs

Hierarchical multi-tenancy (brand → property)

GDPR/data privacy, encrypted at-rest/in-transit

10. Technical Stack (Summary)
Layer	Stack
Frontend	React.js, shadcn/ui/Material UI, AG Grid, React Query, Tailwind
Backend	Node.js + NestJS (APIs), Python (AI/ML), REST/GraphQL, RabbitMQ
Database	PostgreSQL (primary), Redis (cache), MongoDB (future/optional)
Cloud	AWS (RDS, S3, ECS/EKS, API Gateway, Cognito, Lambda, SageMaker)
AI	3rd-party APIs (pilot), AWS SageMaker/OpenAI (future)
DevOps	Docker, GitHub Actions, Terraform, Datadog

11. Development Phases & Milestones
Month	Milestones
0	Finalize scope, team, contracts, infra setup
1	Architecture, UX wireframes, API contracts
2–3	Build core frontend/backend modules, integrations
4	Grid UI, channel manager & rate shopper APIs
5	AI suggestions (basic), validations, audit logs
6	Pilot readiness, UAT, bug fixes
7	Go-live with 1–2 pilot properties (10–20 users)

Pilot Strategy:
Start with 1 property or cluster, 90-day pilot, tight feedback loop.
Expand to 5–10 properties after validation.
Defer full SSO, advanced AI, self-serve onboarding, deep security audits, and reporting until post-pilot.

Initial Team:
10–11 core team: Product, UX/UI, 2x FE, 2x BE, AI/ML, DevOps, QA, Integration

12. Future Expansion
Full AI demand forecasting

Explainable AI (“why” logic)

Advanced reporting & dashboards

Full SSO/enterprise onboarding

Self-serve onboarding, deep ops support

Scale to multi-brand, multi-region

13. Potential Challenges & Solutions
Challenge	Mitigation
Integration reliability	Strong validation, retry/rollback, monitoring
Data standardization	Central orchestration/normalization layer
User trust in AI	Always allow manual override, transparent logging
Pilot feedback/iteration	Tight feedback cycles, agile delivery

14. Sample Screens/Wireframes
To be developed (calendar grid, inline AI, bulk edit modal, etc.)

15. Success Metrics
Reduce manual rate update time by 50%

Achieve 90%+ sync accuracy across channels

80% user satisfaction with pilot (post-launch survey)

Measure impact on RevPAR, ADR, occupancy