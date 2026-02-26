# ChromaBase - Client & Lead Management App

## Project Overview

- **Project Name:** ChromaBase
- **Type:** Desktop Application (Tauri + React)
- **Core Functionality:** Client and lead management system for Chromapages with campaign tracking, content management, and deliverables tracking
- **Target Users:** Chromapages team members managing clients and marketing campaigns

## Tech Stack

- **Desktop Framework:** Tauri v2 (Rust backend + WebView frontend)
- **Frontend:** React 18 with TypeScript + Vite
- **Database:** SQLite with Prisma ORM
- **API Server:** FastAPI (Python) on localhost:3001
- **Styling:** CSS Modules or Tailwind CSS

## Data Models

### 1. Client
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Client name |
| email | String | Contact email |
| phone | String | Contact phone |
| company | String | Company name |
| status | Enum | active, inactive, archived |
| notes | Text | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 2. Lead
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| clientId | UUID | FK to Client |
| name | String | Lead name |
| email | String | Lead email |
| phone | String | Lead phone |
| source | String | Lead source |
| pipelineStage | Enum | new, contacted, qualified, won, lost |
| value | Decimal | Potential deal value |
| notes | Text | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 3. Campaign
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| clientId | UUID | FK to Client |
| name | String | Campaign name |
| description | Text | Campaign description |
| status | Enum | planning, active, paused, completed |
| startDate | Date | Campaign start date |
| endDate | Date | Campaign end date |
| budget | Decimal | Campaign budget |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 4. Content
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| campaignId | UUID | FK to Campaign (nullable) |
| clientId | UUID | FK to Client (nullable) |
| title | String | Content title |
| type | Enum | blog, social, email, ad, other |
| status | Enum | draft, review, published |
| content | Text | Content body |
| publishedAt | DateTime | Publication timestamp |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 5. Deliverable
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| campaignId | UUID | FK to Campaign (nullable) |
| clientId | UUID | FK to Client |
| name | String | Deliverable name |
| description | Text | Description |
| dueDate | Date | Due date |
| status | Enum | pending, in_progress, completed, overdue |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## UI/UX Specification

### Layout Structure

- **Sidebar (240px fixed):** Navigation menu with entity links
- **Main Content Area:** Dynamic content based on selected entity
- **Modal Overlay:** For create/edit forms

### Visual Design

- **Primary Color:** #6366F1 (Indigo)
- **Secondary Color:** #8B5CF6 (Violet)
- **Accent Color:** #10B981 (Emerald)
- **Background:** #F9FAFB (Light gray)
- **Surface:** #FFFFFF (White)
- **Text Primary:** #111827 (Near black)
- **Text Secondary:** #6B7280 (Gray)
- **Border:** #E5E7EB (Light gray)

### Typography

- **Font Family:** Inter, system-ui, sans-serif
- **Headings:** 24px (h1), 20px (h2), 16px (h3)
- **Body:** 14px
- **Small:** 12px

### Components

1. **Sidebar Navigation**
   - Logo/Brand at top
   - Navigation items with icons
   - Active state indicator

2. **Data Tables**
   - Sortable columns
   - Row hover state
   - Action buttons (edit, delete)
   - Pagination

3. **Modal Forms**
   - Overlay backdrop
   - Form fields with labels
   - Save/Cancel buttons
   - Close button

4. **Status Badges**
   - Color-coded by status
   - Small rounded pills

### Responsive Behavior

- Minimum window size: 1024x768
- Sidebar collapses on smaller screens (optional)

## Functionality Specification

### Core Features

1. **Dashboard**
   - Overview statistics
   - Recent activity
   - Quick actions

2. **Client Management**
   - List all clients
   - Create new client
   - Edit client details
   - Archive client
   - View client details (related leads, campaigns, deliverables)

3. **Lead Management**
   - List all leads with pipeline view
   - Filter by pipeline stage
   - Create new lead
   - Edit lead details
   - Move lead through pipeline
   - Convert lead to client

4. **Campaign Management**
   - List all campaigns
   - Filter by status
   - Create new campaign
   - Edit campaign details
   - Link to client
   - Track campaign status

5. **Content Management**
   - List all content
   - Filter by type and status
   - Create new content
   - Edit content
   - Change content status (draft→review→published)

6. **Deliverable Tracking**
   - List all deliverables
   - Filter by status
   - Create new deliverable
   - Edit deliverable
   - Track due dates
   - Mark as complete

### User Interactions

- Click sidebar item → Navigate to entity view
- Click "Add New" → Open create modal
- Click table row edit → Open edit modal
- Click delete → Confirm and delete
- Click status badge → Quick status change (for leads/content/deliverables)

### Data Handling

- All data stored in SQLite database via Prisma
- API layer via Tauri commands for CRUD operations
- FastAPI server provides Chroma AI integration on port 3001

## Acceptance Criteria

1. ✅ Application launches without errors
2. ✅ Sidebar navigation works for all 5 entities
3. ✅ Table views display data correctly
4. ✅ Create modal adds new records
5. ✅ Edit modal updates existing records
6. ✅ Delete functionality works with confirmation
7. ✅ Status changes reflect immediately in UI
8. ✅ Database persists between sessions
9. ✅ FastAPI server runs on localhost:3001
10. ✅ Build produces working .exe/.app file

## File Structure

```
chromabase/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/              # Tauri/Rust backend
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── server/                 # FastAPI server (Chroma AI)
│   ├── main.py
│   └── requirements.txt
├── prisma/                 # Database schema
│   ├── schema.prisma
│   └── seed.ts
├── package.json
├── vite.config.ts
└── SPEC.md
```

## Running ChromaBase

### Development
```bash
# Frontend
npm run dev

# Backend (Tauri)
cargo tauri dev

# FastAPI AI Server
cd server && pip install -r requirements.txt && python main.py
```

### Production Build
```bash
npm run tauri build
```
```
