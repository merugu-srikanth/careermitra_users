# CareerMitra — Project Documentation (CLAUDE.md)

> Government Jobs & Career Platform for India
> Frontend: React 19 + Vite + Tailwind CSS
> Auth API: `https://careermitra.in/api/public/api`
> Jobs API: `https://careermitra.tech/api`

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19.2.4 |
| Build Tool | Vite 8.0.1 |
| Routing | React Router v7.14.0 |
| Styling | Tailwind CSS 4.2.2 |
| Animations | Framer Motion 12.38.0 |
| HTTP Client | Axios 1.14.0 |
| State Management | React Context API (no Redux) |
| Notifications | React Toastify 11.0.5 |
| Icons | React Icons 5.6.0, Lucide React 1.8.0 |
| SEO | React Helmet Async 3.0.0 |
| XSS Sanitization | DOMPurify 3.3.3 |
| Charts/Maps | AMCharts 4 |
| Confetti | React Confetti 6.4.0 |

---

## Folder Structure

```
sootradhara.in career enduser/
├── public/                          # Static public assets
├── src/
│   ├── assets/                      # Images, logos, backgrounds
│   │   ├── NewLogo.png
│   │   ├── Careermitra-hero.webp
│   │   ├── hero.png
│   │   └── bg-images/
│   │       ├── Login.webp
│   │       ├── Login1.png
│   │       └── CenterIMG.webp
│   ├── components/                  # Reusable UI components
│   │   ├── AllJobCard.jsx           # Job card for grid display (AllJobs page)
│   │   ├── Animate.jsx              # Animation wrapper
│   │   ├── Animatedsection.jsx      # Scroll-triggered animated section
│   │   ├── AIChatBot.jsx            # AI chatbot (currently commented out in App.jsx)
│   │   ├── AuthLayout.jsx           # Auth pages layout wrapper
│   │   ├── CareerHomeJobs.jsx       # Featured jobs on Home page (grid + table)
│   │   ├── FloatingWhatsApp.jsx     # Floating WhatsApp contact button
│   │   ├── Footer.jsx               # Site-wide footer
│   │   ├── GovernmentHero.jsx       # Hero section for government jobs
│   │   ├── GovernmentHeroMobile.jsx # Mobile variant of government hero
│   │   ├── Hero.jsx                 # General hero section
│   │   ├── Heropage.jsx             # Hero page variant
│   │   ├── Heroleft.jsx             # Hero left panel
│   │   ├── Herosection.jsx          # Hero section variant
│   │   ├── IndiaMap.jsx             # Interactive India map (AMCharts)
│   │   ├── Jobcard.jsx              # Job filter card component
│   │   ├── Jobcategories.jsx        # Job category filter component
│   │   ├── Latestjobssection.jsx    # Latest jobs showcase section
│   │   ├── Lazyimage.jsx            # Lazy-loading image wrapper
│   │   ├── Loader.jsx               # Loading spinner component
│   │   ├── Navbar.jsx               # Main navigation bar
│   │   ├── NotFoundPage.jsx         # 404 error page
│   │   ├── ProtectedRoute.jsx       # Auth guard — redirects to /login if no token
│   │   ├── SEO.jsx                  # SEO head tags via react-helmet-async
│   │   └── Studentcareersession.jsx # Student career guide section
│   ├── context/
│   │   └── AuthContext.jsx          # Global auth state (user, token, all auth methods)
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Login.jsx                # Login (password + OTP + forgot password)
│   │   ├── Register.jsx             # User registration with OTP
│   │   ├── RegisterVerify.jsx       # OTP verification for registration
│   │   ├── ResetPassword.jsx        # Password reset via email link
│   │   ├── Alljobs.jsx              # Full jobs listing with filters + pagination
│   │   ├── Userprofilepage.jsx      # User dashboard (protected)
│   │   ├── Userprofilefillingpage.jsx # Profile completion form (protected)
│   │   ├── Profilre.jsx             # Profile management layout (protected)
│   │   ├── AboutPage.jsx            # About us static page
│   │   ├── ContactPage.jsx          # Contact us page
│   │   ├── CareerGuide.jsx          # Career guide educational page
│   │   ├── Internshipguide.jsx      # Internship guide educational page
│   │   ├── InternshipTable.jsx      # Internship listings table
│   │   ├── AuthorProfile.jsx        # Blog author profile page
│   │   ├── Staticjobs.js            # Static job data constants
│   │   ├── Commingsoon/
│   │   │   └── ComingSoon.jsx       # Coming soon placeholder page
│   │   └── Blogs/
│   │       ├── BlogList.jsx         # Blog listing page
│   │       └── BlogDetail.jsx       # Individual blog post page
│   ├── utils/
│   │   └── jobDeadline.js           # Deadline calculation helpers
│   ├── App.jsx                      # Root component — routing setup
│   ├── App.css                      # Global CSS overrides
│   ├── index.css                    # Tailwind base imports
│   ├── main.jsx                     # React DOM entry point
│   └── ScrollToTop.jsx              # Scrolls window to top on route change
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite config (React plugin + Tailwind)
├── package.json                     # Dependencies and scripts
└── eslint.config.js                 # ESLint configuration
```

---

## Routes & Pages

### Public Routes (accessible without login)

| Route | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Landing page with hero, featured jobs, career guides |
| `/jobs` | `Alljobs.jsx` | Full job listings with search, filter, pagination |
| `/login` | `Login.jsx` | Login page (password / OTP / forgot password) |
| `/register` | `Register.jsx` | Registration with OTP verification |
| `/verify-otp` | `RegisterVerify.jsx` | OTP verification step |
| `/reset-password` | `ResetPassword.jsx` | Password reset via email link |
| `/blogs` | `BlogList.jsx` | Blog article listing |
| `/blog/:slug` | `BlogDetail.jsx` | Individual blog post |
| `/author/:authorId` | `AuthorProfile.jsx` | Blog author profile |
| `/announcements/:slug` | `AnnouncementDetail.jsx` | Announcement detail page |
| `/about-us` | `AboutPage.jsx` | About page |
| `/internship-guide` | `InternshipGuide.jsx` | Internship guide |
| `/career-guide` | `CareerGuide.jsx` | Career guide |
| `/contact-us` | `Contact.jsx` | Contact page |
| `/coming-soon` | `ComingSoon.jsx` | Placeholder page |
| `*` | `NotFoundPage.jsx` | 404 fallback |

### Protected Routes (require auth token — wrapped in `ProtectedRoute`)

| Route | Component | Description |
|---|---|---|
| `/user-dashboard` | `Userprofilepage.jsx` | User profile dashboard |
| `/user-profile-filling` | `Userprofilefillingpage.jsx` | Profile completion form |
| `/UserProfile` | `ProfileLayout (Profilre.jsx)` | Full profile management |

---

## Authentication Architecture

### AuthContext (`src/context/AuthContext.jsx`)

Central auth state provided via React Context. Wraps the entire app in `App.jsx`.

**State:**

```js
user    // current user object (null if not logged in)
token   // JWT token from localStorage (null if not logged in)
loading // boolean — true while any auth API call is in progress
```

**Methods exposed:**

| Method | Description |
|---|---|
| `loginWithPassword(email, password)` | Password-based login → sets token + user |
| `sendOtp(email)` | Send OTP to email for OTP login |
| `verifyOtp(email, otp)` | Verify login OTP → sets token + user |
| `register(data)` | Register new account → triggers OTP |
| `verifyRegisterOtp(email, otp)` | Verify registration OTP |
| `loginPendingRegisteredUser(email, pw)` | Auto-login after registration using stored credentials |
| `forgotPassword(email)` | Send password reset email |
| `resetPassword(data)` | Reset password with token from email |
| `checkProfile(authToken)` | Check if user's profile is complete (returns boolean) |
| `logout()` | Clear token + user state + localStorage |
| `storePendingRegisterCredentials(email, pw)` | Save credentials to localStorage before OTP |
| `getPendingRegisterCredentials()` | Read pending credentials from localStorage |
| `clearPendingRegisterCredentials()` | Remove pending credentials from localStorage |

**localStorage keys:**

| Key | Purpose |
|---|---|
| `token` | JWT auth token (persists across sessions) |
| `pendingRegisterCredentials` | Temp email+password during registration OTP flow |
| `rememberedEmail` | Email remembered from login |
| `registerEmail` | Email used during registration |

### ProtectedRoute (`src/components/ProtectedRoute.jsx`)

Simple auth guard. If `token` is null → redirects to `/login`. Used in `App.jsx` around protected pages.

```jsx
// Usage in App.jsx
<Route path="/user-dashboard" element={
  <ProtectedRoute>
    <Userprofilepage />
  </ProtectedRoute>
} />
```

---

## Login Flow (step-by-step)

```
User visits /login
    │
    ├─ Password Login tab
    │     Enter email + password
    │     → loginWithPassword(email, password)
    │     → token saved to localStorage
    │     → checkProfile(token)
    │           ├─ profile complete   → redirect /
    │           └─ profile incomplete → redirect /user-profile-filling
    │
    └─ OTP Login tab
          Enter email → sendOtp(email) → OTP sent
          Enter 6-digit OTP → verifyOtp(email, otp)
          → token saved to localStorage
          → checkProfile(token)
                ├─ complete   → redirect /
                └─ incomplete → redirect /user-profile-filling

  Forgot Password link
      Enter email → forgotPassword(email) → reset link sent
      User clicks email link → /reset-password?token=...
      Enter new password → resetPassword(data) → redirect /login
```

---

## Registration Flow (step-by-step)

```
User visits /register
    │
    Fill form: name, email, phone, password, confirm password, job interest
    → register(data)
    → storePendingRegisterCredentials(email, password)
    → OTP modal appears
    │
    Enter 6-digit OTP
    → verifyRegisterOtp(email, otp)
    → Success modal with confetti
    → loginPendingRegisteredUser()  ← auto-login with stored credentials
    → clearPendingRegisterCredentials()
    → redirect / or /user-profile-filling
```

---

## Component Documentation

### CareerHomeJobs (`src/components/CareerHomeJobs.jsx`)

Displays the 8 latest government jobs on the Home page. Supports grid and table views.

**Key feature — Auth-gated buttons:**
- `Apply Now` and `View Notification` buttons are only visible when the user is **logged in**
- When logged out, a single **"Login to Apply"** button is shown instead, linking to `/login`
- This uses `token` from `useAuth()` → `isLoggedIn = !!token`

**Sub-components:**

| Component | Description |
|---|---|
| `JobGridCard` | Individual job card in grid view. Props: `job`, `onView`, `isLoggedIn` |
| `JobTableRow` | Table row for each job. Props: `job`, `onView`, `idx`, `isLoggedIn` |
| `JobModal` | Full-screen modal with job details and Apply Now. Props: `job`, `loading`, `onClose`, `isLoggedIn` |
| `GridSkeleton` | Loading skeleton for grid card |
| `TableRowSkeleton` | Loading skeleton for table row |
| `Badge` | Job type badge (permanent / contract / temporary) |

**State:**

```js
jobs          // Array of 8 latest jobs fetched from API
loading       // true while fetching jobs list
viewMode      // "grid" | "table"
selectedJob   // job object loaded for the modal
showModal     // boolean — modal visibility
loadingSingle // true while fetching single job details
```

**Data fetch:**
```
GET https://careermitra.tech/api/jobs?page=1&limit=8&sort=newest
→ filters out internship jobs
→ maps API fields to component fields
→ sorts by newest postedDate
→ slices to max 8
```

**API field mapping:**

| API Field | Component Field |
|---|---|
| `_id` | `id` |
| `title` | `title` |
| `jobSource` | `org` |
| `jobType` | `category` |
| `numberOfPosts` | `noOfPosts` |
| `ageRequirement` | `age` |
| `qualifications` | `qualifications` |
| `applyLink` | `applyLink` |
| `notificationUrl / notificationURL / notification_url` | `notificationUrl` |
| `postedDate` (split at T) | `postedDate` |
| `applicationDeadline` (split at T) | `lastDate` |

**Helper functions:**

| Function | Description |
|---|---|
| `formatDateDDMMYYYY(value)` | Converts any date to DD/MM/YYYY string |
| `getDaysLeftText(value)` | Returns "Expires in X days" / "Expires Today" / "Expired X days ago" |
| `isDeadlineExpired(value)` | Returns true if deadline has passed |
| `normalizeExternalUrl(value)` | Ensures URL starts with https:// |
| `getIsNew(postedDate)` | Returns true if job posted within last 7 days |

---

### Alljobs (`src/pages/Alljobs.jsx`)

Full paginated job listing page with advanced filtering.

**Features:**
- Search by title, organization, qualification
- Filter by category, age range, job type
- Sort by newest / oldest deadline
- Grid view and Table view toggle
- 12 jobs per page with pagination + scroll-to-top
- Shows total jobs count, total posts, organizations count, categories count

**Auth behavior:**
- `Apply` button: if user is **not logged in** → redirects to `/register`
- If user is **logged in** → opens apply link directly

**Data fetch:**
```
GET https://careermitra.tech/api/jobs?page={page}&limit=12&sort={sort}
```

---

### Navbar (`src/components/Navbar.jsx`)

Main navigation bar, present on all pages.

**Navigation links:**
- HOME → `/`
- ABOUT US → `/about-us`
- LATEST GOVT JOBS → `/jobs`
- CAREER (dropdown) → Career Guide `/career-guide`, Internship Guide `/internship-guide`
- BLOGS → `/blogs`
- CONTACT US → `/contact-us`

**Auth-aware behavior:**
- Logged out → shows Login + Register links
- Logged in → shows user profile dropdown with name, avatar, profile completion %, dashboard link, logout button
- Notifications bell → shows count of new active jobs

**Mobile:** Hamburger menu with drawer slide-in

---

### ProtectedRoute (`src/components/ProtectedRoute.jsx`)

```jsx
// Checks token from useAuth()
// No token → <Navigate to="/login" />
// Has token → renders children
```

---

## API Endpoints

### Auth API (`https://careermitra.in/api/public/api`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/user/login` | Password login → returns token |
| POST | `/login` | Send login OTP |
| POST | `/verify-otp` | Verify login OTP → returns token |
| POST | `/register` | Register new user → triggers OTP |
| POST | `/verify-register-otp` | Verify registration OTP |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password` | Reset password with token |
| GET | `/profile` | Fetch user profile (Bearer token required) |

### Jobs API (`https://careermitra.tech/api`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/jobs?page=1&limit=8&sort=newest` | Fetch latest 8 jobs (home page) |
| GET | `/jobs?page={n}&limit=12&sort={s}` | Paginated jobs list (all jobs page) |
| GET | `/jobs/{id}` | Single job details for modal |

---

## Application Flow (End-to-End)

```
Browser loads app
    │
    └── main.jsx renders <App />
            │
            └── <AuthProvider>         ← reads token from localStorage on mount
                    │
                    └── <Router>
                            │
                            ├── <ScrollToTop />    ← resets scroll on route change
                            ├── <Navbar />         ← always rendered, auth-aware
                            │
                            ├── <HeroAnnouncementTicker /> ← always rendered below the Navbar
                            │
                            ├── <Routes>
                            │       ├── / → Home
                            │       │     ├── Hero section
                            │       │     ├── CareerHomeJobs  ← fetches 8 latest jobs
                            │       │     │     ├── Logged IN  → shows Apply Now + View Notification
                            │       │     │     └── Logged OUT → shows "Login to Apply"
                            │       │     ├── Latestjobssection
                            │       │     ├── Studentcareersession
                            │       │     └── IndiaMap
                            │       │
                            │       ├── /jobs → AllJobs
                            │       │     ├── Search + Filter bar
                            │       │     ├── Grid/Table toggle
                            │       │     ├── Job cards (12 per page)
                            │       │     │     ├── Logged IN  → Apply button opens link
                            │       │     │     └── Logged OUT → Apply redirects /register
                            │       │     └── Pagination
                            │       │
                            │       ├── /login  → Login (password | OTP | forgot password)
                            │       ├── /register → Register + OTP modal
                            │       ├── /verify-otp → OTP verification
                            │       ├── /reset-password → Reset password form
                            │       │
                            │       ├── /user-dashboard [Protected]
                            │       ├── /user-profile-filling [Protected]
                            │       ├── /UserProfile [Protected]
                            │       │
                            │       ├── /blogs → BlogList
                            │       ├── /blog/:slug → BlogDetail
                            │       ├── /author/:id → AuthorProfile
                            │       ├── /announcements/:slug → AnnouncementDetail
                            │       ├── /about-us, /contact-us, /career-guide, /internship-guide, /coming-soon
                            │       └── * → NotFoundPage
                            │
                            └── <Footer />   ← always rendered
```

---

## Auth-Gated Features

The following UI elements are **only visible to logged-in users**:

### In CareerHomeJobs (Home page)

| User State | Shown |
|---|---|
| Logged IN | `View Notification` button + `Apply Now` button per job card |
| Logged OUT | Single `Login to Apply` button (redirects to `/login`) |

**Implementation:** `isLoggedIn = !!token` from `useAuth()`, passed as prop to `JobGridCard`, `JobTableRow`, and `JobModal`.

### In AllJobs page

| User State | Behavior |
|---|---|
| Logged IN | `Apply` button opens job's apply link in new tab |
| Logged OUT | `Apply` button redirects to `/register` |

### In Navbar

| User State | Shown |
|---|---|
| Logged IN | User avatar, name, dashboard link, notification bell, logout |
| Logged OUT | Login link, Register link |

### Protected Routes

Entire pages behind `ProtectedRoute`:
- `/user-dashboard` — User profile overview
- `/user-profile-filling` — Profile completion form
- `/UserProfile` — Full profile management

---

## State Management Pattern

No Redux. Uses:
- **React Context API** (`AuthContext`) for global auth state
- **`useState`** in each component for local UI state (modals, filters, pagination)
- **`useEffect`** for API data fetching on mount
- **`localStorage`** for token persistence across page refreshes

---

## Utilities (`src/utils/jobDeadline.js`)

| Function | Returns |
|---|---|
| `getDeadlineDayDifference(date)` | Number of days between today and deadline |
| `isDeadlineExpired(date)` | `true` if deadline has passed |
| `getDeadlineStatusText(date)` | Human-readable string: "Expires in X days" / "Expired X days ago" |

---

## Key Dev Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Important Notes for Development

1. **Auth token check:** Always use `const { token } = useAuth()` — never read `localStorage.getItem("token")` directly in components.

2. **Apply Now / View Notification buttons** — must check `isLoggedIn = !!token` before rendering. Show "Login to Apply" (`Link to="/login"`) for unauthenticated users.

3. **API base URLs are different** — auth uses `careermitra.in`, jobs use `careermitra.tech`. Don't mix them.

4. **ProtectedRoute** wraps only three pages. All other pages including `/jobs` are public — but individual action buttons inside are conditionally auth-gated.

5. **Internship jobs are filtered out** in `CareerHomeJobs.jsx` — jobs with `jobType` containing "intern" are excluded from the home page display.

6. **Profile completion check** — after login, `checkProfile(token)` determines if user goes to `/` (complete) or `/user-profile-filling` (incomplete).

7. **AIChatBot** — the component exists (`src/components/AIChatBot.jsx`) but is commented out in `App.jsx`. Uncomment `<AIChatBot />` to enable it.
