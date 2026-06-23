# CareerMitra — Project Documentation (CLAUDE.md)

> Government Jobs & Career Platform for India
> Frontend: React 19 + Vite + Tailwind CSS
> Auth API: `https://careermitra.in/api/public/api`
> Jobs API: `https://careermitra.in/api`
> Articles API: `https://careermitra.in/api/articles`

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.2.4 |
| Build Tool | Vite | 8.0.1 |
| Routing | React Router | v7.14.0 |
| Styling | Tailwind CSS | 4.2.2 |
| Animations | Framer Motion | 12.38.0 |
| HTTP Client | Axios | 1.14.0 |
| State Management | React Context API (no Redux) | — |
| Notifications | React Toastify | 11.0.5 |
| Icons | React Icons + Lucide React | 5.6.0 / 1.8.0 |
| SEO | React Helmet Async | 3.0.0 |
| XSS Sanitization | DOMPurify | 3.3.3 |
| Charts/Maps | AMCharts 4 | — |
| Confetti | React Confetti | 6.4.0 |

---

## Global Context Providers

App.jsx wraps everything in three context providers:

```jsx
<AuthProvider>        ← auth state (user, token, login/logout methods)
  <JobProvider>       ← jobs data shared across pages
    <BlogProvider>    ← blog/article categories shared across pages
      ...
    </BlogProvider>
  </JobProvider>
</AuthProvider>
```

| Context | File | Purpose |
|---|---|---|
| `AuthContext` | `src/context/AuthContext.jsx` | Global auth state — user, token, all auth methods |
| `JobContext` | `src/context/JobContext.jsx` | Shared job listings state |
| `BlogContext` | `src/context/BlogContext.jsx` | Shared blog/article categories state |

---

## Folder Structure

```
sootradhara.in career enduser/
├── public/                          # Static public assets (favicons, manifest)
├── src/
│   ├── assets/                      # Images, logos, backgrounds
│   │   ├── NewLogo.png
│   │   ├── Careermitra-hero.webp
│   │   ├── hero.png
│   │   ├── blog-sample.png          # Fallback image for articles
│   │   └── bg-images/
│   │       ├── Login.webp
│   │       ├── Login1.png
│   │       └── CenterIMG.webp
│   ├── components/                  # Reusable UI components
│   │   ├── AllJobCard.jsx           # Job card for grid display (AllJobs page)
│   │   ├── Animate.jsx              # Animation wrapper
│   │   ├── Animatedsection.jsx      # Scroll-triggered animated section
│   │   ├── AIChatBot.jsx            # AI chatbot (commented out in App.jsx)
│   │   ├── AuthLayout.jsx           # Auth pages layout wrapper
│   │   ├── BlogAuthor.jsx           # Author card used in ArticleDetail
│   │   ├── CareerHomeJobs.jsx       # Featured jobs on Home page (grid + table)
│   │   ├── FloatingWhatsApp.jsx     # Floating WhatsApp contact button
│   │   ├── Footer.jsx               # Site-wide footer
│   │   ├── GovernmentHero.jsx       # Hero section for government jobs
│   │   ├── GovernmentHeroMobile.jsx # Mobile variant of government hero
│   │   ├── Hero.jsx                 # General hero section
│   │   ├── HeroFinalPage.jsx        # Final hero page variant
│   │   ├── Heropage.jsx             # Hero page variant
│   │   ├── Heroleft.jsx             # Hero left panel
│   │   ├── Herosection.jsx          # Hero section variant
│   │   ├── HeroAnnouncementTicker.jsx # Scrolling ticker below Navbar (currently commented out)
│   │   ├── IndiaMap.jsx             # Interactive India map (AMCharts)
│   │   ├── Jobcard.jsx              # Job filter card component
│   │   ├── Jobcategories.jsx        # Job category filter component
│   │   ├── Latestjobssection.jsx    # Latest jobs showcase section
│   │   ├── Lazyimage.jsx            # Lazy-loading image wrapper
│   │   ├── Loader.jsx               # Loading spinner component
│   │   ├── Navbar.jsx               # Main navigation bar
│   │   ├── NotFoundPage.jsx         # 404 error page
│   │   ├── ProtectedRoute.jsx       # Auth guard — redirects to /login if no token
│   │   ├── PWAUpdatePrompt.jsx      # PWA update banner (always rendered)
│   │   ├── SEO.jsx                  # SEO head tags via react-helmet-async
│   │   └── Studentcareersession.jsx # Student career guide section
│   ├── context/
│   │   ├── AuthContext.jsx          # Global auth state (user, token, all auth methods)
│   │   ├── JobContext.jsx           # Shared jobs state
│   │   └── BlogContext.jsx          # Shared blog/article categories state
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Login.jsx                # Login (password + OTP + forgot password)
│   │   ├── Register.jsx             # User registration with OTP
│   │   ├── RegisterVerify.jsx       # OTP verification for registration
│   │   ├── ResetPassword.jsx        # Password reset via email link
│   │   ├── Alljobs.jsx              # Jobs listing → route: /latest-job-notifications
│   │   ├── Userprofilepage.jsx      # User dashboard (protected)
│   │   ├── Userprofilefillingpage.jsx # Profile completion form (protected)
│   │   ├── Profilre.jsx             # Profile management layout (protected)
│   │   ├── Dashabord.jsx            # Dashboard component
│   │   ├── AboutPage.jsx            # About us static page
│   │   ├── ContactPage.jsx          # Contact us page
│   │   ├── CareerGuide.jsx          # Career guide educational page
│   │   ├── Internshipguide.jsx      # Internship guide educational page
│   │   ├── InternshipTable.jsx      # Internship listings table
│   │   ├── EventsPage.jsx           # Events listing → route: /events
│   │   ├── AnnouncementDetail.jsx   # Single announcement → route: /announcements/:slug
│   │   ├── TermsOfService.jsx       # Terms of service → route: /terms-of-service
│   │   ├── PrivacyPolicy.jsx        # Privacy policy → route: /privacy-policy
│   │   ├── AuthorProfile.jsx        # Blog author profile → route: /author/:authorId
│   │   ├── Staticjobs.js            # Static job data constants
│   │   ├── Commingsoon/
│   │   │   └── ComingSoon.jsx       # Coming soon placeholder
│   │   ├── Articles/                # NEW article system
│   │   │   ├── ArticleList.jsx      # Articles listing → /articles + clean URLs
│   │   │   ├── ArticleDetail.jsx    # Article detail → /articles/:slug + clean URLs
│   │   │   └── TwoSegmentResolver.jsx # Resolves /:parent/:slug → category OR article
│   │   └── Blogs/                   # Legacy blog system (backward compat only)
│   │       ├── BlogList.jsx         # Blog listing → /government-jobs
│   │       ├── BlogCategory.jsx     # Category listing → /category/:categorySlug
│   │       └── BlogDetail.jsx       # Blog detail (old /blog/:slug now returns 404)
│   ├── utils/
│   │   ├── jobDeadline.js           # Deadline calculation helpers
│   │   └── profileCompletion.js     # Profile completion % + flattenEducation
│   ├── App.jsx                      # Root component — routing + providers
│   ├── App.css                      # Global CSS overrides
│   ├── index.css                    # Tailwind base imports
│   ├── main.jsx                     # React DOM entry point
│   └── ScrollToTop.jsx              # Scrolls to top on route change
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite config
├── package.json
└── eslint.config.js
```

---

## Routes & Pages

### Public Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Landing page |
| `/latest-job-notifications` | `Alljobs.jsx` | Full job listings with filters + pagination |
| `/login` | `Login.jsx` | Login (password / OTP / forgot password) |
| `/register` | `Register.jsx` | Registration with OTP verification |
| `/verify-otp` | `RegisterVerify.jsx` | OTP verification step |
| `/reset-password` | `ResetPassword.jsx` | Password reset via email link |
| `/articles` | `ArticleList.jsx` | All articles with search/category filters |
| `/articles/:slug` | `ArticleDetail.jsx` | Article detail — flat slug |
| `/articles/:parentSlug/:slug` | `ArticleDetail.jsx` | Article detail — 2-level |
| `/articles/:parentSlug/:childSlug/:slug` | `ArticleDetail.jsx` | Article detail — 3-level |
| `/events` | `EventsPage.jsx` | Events listing |
| `/announcements/:slug` | `AnnouncementDetail.jsx` | Single announcement detail |
| `/about-us` | `AboutPage.jsx` | About page |
| `/internship-guide` | `InternshipGuide.jsx` | Internship guide |
| `/career-guide` | `CareerGuide.jsx` | Career guide |
| `/contact-us` | `Contact.jsx` | Contact page |
| `/terms-of-service` | `TermsOfService.jsx` | Terms of service |
| `/privacy-policy` | `PrivacyPolicy.jsx` | Privacy policy |
| `/coming-soon` | `ComingSoon.jsx` | Placeholder page |
| `/author/:authorId` | `AuthorProfile.jsx` | Author profile |

### Clean URL Routes (must be declared last before `*`)

| Route | Component | Notes |
|---|---|---|
| `/:parentSlug/:childSlug/:articleSlug` | `ArticleDetail.jsx` | 3-segment = always article |
| `/:parentSlug/:slug` | `TwoSegmentResolver.jsx` | Resolves → category list OR article |
| `/:parentSlug` | `ArticleList.jsx` | 1-segment = parent category listing |

### Legacy Routes

| Route | Component | Notes |
|---|---|---|
| `/government-jobs` | `BlogList.jsx` | Old blog list |
| `/category/:categorySlug` | `BlogCategory.jsx` | Old category listing |
| `/blogs`, `/blog` | redirect → `/articles` | |
| `/blogs/:a`, `/blog/:a` etc. | `NotFoundPage.jsx` | Blocked |

### Protected Routes

| Route | Component | Description |
|---|---|---|
| `/user-dashboard` | `Userprofilepage.jsx` | User profile dashboard |
| `/user-profile-filling` | `Userprofilefillingpage.jsx` | Profile completion form |
| `/UserProfile` | `ProfileLayout (Profilre.jsx)` | Full profile management |

---

## Navbar (`src/components/Navbar.jsx`)

### Nav Links

| Label | Route/Behavior |
|---|---|
| Home | `/` |
| About Us | `/about-us` |
| Latest Job Notifications | `/latest-job-notifications` |
| Career | Dropdown: Career Overview `/career-guide`, Internship FAQ's `/internship-guide` |
| Jobs 2026 | `blogsDropdown: true` — mega menu with article categories from API |
| Events | `/events` |
| Contact Us | `/contact-us` |
| YouTube | `https://www.youtube.com/@CareerMitraaa` (icon-only) |

### Jobs 2026 Mega Menu

- Source: `GET /api/blogs/filters` → `{ parents[], children[] }`
- Desktop: two-panel — parents left, children right on hover
- Mobile: accordion — parent `<Link>` navigates + chevron `<button>` toggles children
- Parent links: `/articles?parent_category_id=<id>`
- Child links: `/articles?child_category_id=<id>`

### Profile Dropdown (logged in)

- Shows: avatar, name, profile completion %, notification bell (new jobs count)
- Links: `/user-dashboard`, logout button

---

## Articles System

### ArticleList (`src/pages/Articles/ArticleList.jsx`)

- Filter options from: `GET /api/articles/filters`
- Single filter rule: only one of `search` / `parent_category_id` / `child_category_id` active
- URL-driven filters via `useSearchParams` (shareable links)
- `buildArticleUrl(article)` → canonical URL from `article.categoryTree[0]`
- Uses `BlogContext` for shared category data

### ArticleDetail (`src/pages/Articles/ArticleDetail.jsx`)

Features:
- Reading progress bar (fixed top, orange)
- AI Summary with typewriter effect
- Text-to-Speech (Web Speech API, en-IN)
- Share bar (WhatsApp, Facebook, Telegram, Twitter, copy link)
- Table of Contents from H2/H3 headings
- Breadcrumb: `Home › Parent › Child › Title`
- DOMPurify sanitized HTML content
- Related articles sidebar
- Author card (`BlogAuthor` component)
- Tags → `/articles?search=<tag>`

### TwoSegmentResolver (`src/pages/Articles/TwoSegmentResolver.jsx`)

- Route: `/:parentSlug/:slug`
- Checks `/api/blogs/filters` (5-min module-level cache)
- If slug = child category → renders `<ArticleList />`
- If slug ≠ any category → renders `<ArticleDetail />`

### Article URL Builder

```js
buildArticleUrl(article):
  tree = article.categoryTree[0]
  → has parent + child  : /{parentSlug}/{childSlug}/{article.slug}
  → has parent only     : /{parentSlug}/{article.slug}
  → no tree             : /{article.slug}
```

---

## API Endpoints

### Auth (`https://careermitra.in/api/public/api`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/user/login` | Password login |
| POST | `/login` | Send login OTP |
| POST | `/verify-otp` | Verify login OTP → token |
| POST | `/register` | Register new user |
| POST | `/verify-register-otp` | Verify registration OTP |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password` | Reset with token |
| GET | `/profile` | Get user profile (Bearer token) |

### Jobs (`https://careermitra.in/api`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/jobs?page=1&limit=8&sort=newest` | 8 latest jobs (home) |
| GET | `/jobs?page={n}&limit=12&sort={s}` | Paginated jobs list |
| GET | `/jobs/{id}` | Single job detail |

### Articles (`https://careermitra.in/api`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/articles` | All articles |
| GET | `/articles?parent_category_id=<id>` | Filter by parent category |
| GET | `/articles?child_category_id=<id>` | Filter by child category |
| GET | `/articles?search=<term>` | Search articles |
| GET | `/articles/slug/:slug` | Article by slug |
| GET | `/articles/filters` | Categories with published articles |
| GET | `/blogs/filters` | Category tree for Navbar + resolver |

---

## Authentication Architecture

### AuthContext

| State | Type | Description |
|---|---|---|
| `user` | object \| null | Current user |
| `token` | string \| null | JWT from localStorage |
| `loading` | boolean | Auth API in progress |

| Method | Description |
|---|---|
| `loginWithPassword(email, password)` | Sets token + user |
| `sendOtp(email)` | Sends OTP |
| `verifyOtp(email, otp)` | Verifies → sets token |
| `register(data)` | Registers → triggers OTP |
| `verifyRegisterOtp(email, otp)` | Verifies registration OTP |
| `loginPendingRegisteredUser(email, pw)` | Auto-login after register |
| `forgotPassword(email)` | Sends reset email |
| `resetPassword(data)` | Resets with token |
| `checkProfile(authToken)` | Returns boolean — profile complete? |
| `logout()` | Clears all state + localStorage |

**localStorage keys:** `token`, `pendingRegisterCredentials`, `rememberedEmail`, `registerEmail`

---

## Auth-Gated Features

### CareerHomeJobs (Home page)

| State | Shown |
|---|---|
| Logged IN | `View Notification` + `Apply Now` per card |
| Logged OUT | `Login to Apply` → `/login` |

### AllJobs page

| State | Behavior |
|---|---|
| Logged IN | Apply opens job link in new tab |
| Logged OUT | Apply redirects to `/register` |

### Navbar

| State | Shown |
|---|---|
| Logged IN | Avatar, name, completion %, bell, dashboard, logout |
| Logged OUT | Login link, Register link |

---

## Key Dev Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Mobile App (Separate Project)

Location: `d:\Sootradhara\CareerMitraApp\`

| Detail | Value |
|---|---|
| Framework | Expo SDK 51 |
| React Native | 0.74.5 |
| WebView | react-native-webview 13.8.6 |
| Package name | `com.careermitra.app` |
| Entry | `App.js` → WebView → `https://careermitra.in/` |
| EAS Project | `@srikanthmerugu/careermitra-app` |
| APK (test) | `eas build -p android --profile preview` |
| AAB (Play Store) | `eas build -p android --profile production` |

App features: orange progress bar, hardware back button, offline error + retry, custom user agent, `window.isCareerMitraApp = true` JS bridge, external links open in system browser.

---

## Important Dev Rules

1. **Auth token:** Always `const { token } = useAuth()` — never `localStorage.getItem("token")` in components.

2. **Article URLs:** Always `buildArticleUrl(article)` from `article.categoryTree[0]` — never rebuild from `article.categories[]`.

3. **Single filter rule:** In `ArticleList`, only one of `search` / `parent_category_id` / `child_category_id` active at once.

4. **Navbar categories:** `GET /api/blogs/filters` — returns `{ parents[], children[] }` where children have `parent_id`.

5. **No "blog" naming** in new code — use "article" everywhere in the Articles system.

6. **Jobs route changed:** `/jobs` is now `/latest-job-notifications`.

7. **Internship jobs filtered out** in `CareerHomeJobs.jsx` — `jobType` containing "intern" excluded from home page.

8. **AIChatBot** — exists but commented out. Uncomment `<AIChatBot />` in `App.jsx` to enable.

9. **HeroAnnouncementTicker** — exists but commented out. Uncomment `<HeroAnnouncementTicker />` in `App.jsx` to enable.

10. **PWAUpdatePrompt** — always rendered in `App.jsx`, handles service worker updates automatically.

11. **profileCompletion util** — `calculateProfileCompletion()` and `flattenEducation()` used in Navbar for the profile % badge.
