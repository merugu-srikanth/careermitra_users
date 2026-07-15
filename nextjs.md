# Career Mitra - Next.js Migration & Scope Documentation

This file documents the overall project scope, structure, migrations, custom updates, and architectural fixes implemented during the transition from the legacy React + Vite application to the modern **Next.js (App Router)** setup.

---

## 📁 Project Structure & Routes

The application has been converted to Next.js's file-based App Router structure under `src/app/`:

* **`src/app/page.js`**: Home landing page featuring the Hero page, announcement ticker, and search elements.
* **`src/app/user-dashboard/page.js`**: Personalized Student Dashboard featuring:
  * **My Profile**: Displays user profile details, subscription statuses, and profile completion gauge.
  * **Job Posts**: Dynamically lists recommended/eligible jobs based on qualification level.
  * **Settings**: Profile editing link, reset password modal, and secure logout.
* **`src/app/user-profile-filling/page.js`**: Multi-step student profile onboarding and profile details update form.
* **`src/app/internships/page.js`**: Public internships page listing approved internships with comprehensive sorting, categories, and closing-soon filters.
* **`src/app/internships/[slug]/page.js`**: Detailed single view page for a specific internship posting.
* **`src/app/latest-job-notifications/page.js`**: Feed for recent government job updates.
* **`src/app/author/[authorId]/page.js`**: Author profile detail pages showing author bios, social networks, and a dynamic feed of their assigned blog posts.
* **`src/app/[parentSlug]/[slug]/page.js`**: Dynamic route resolver routing users to category views (`ArticleList`) or detail blog views (`ArticleDetail`).

---

## 🛠️ Key Feature Integrations & Custom Fixes

### 1. Sidebar Tab Navigation (User Dashboard)
* **Behavior**: Sidebar options (My Profile, Job Posts, Settings) keep URL parameters synchronized.
* **Fix**: URL query states (`?tab=`) are resolved dynamically on load and synced via Next.js's router replace hook inside `handleTabSwitch`, resolving navigation lock issues.

### 2. Hydration Mismatch Safety (SSR vs. Client State)
Client-only states (like authentication tokens or local storage flags) do not match during the initial server render phase.
* **Navbar Fix**: Delayed rendering of profile menu components until post-hydration via a `mounted` state trigger inside `src/components/Navbar.jsx`.
* **Home Page Fix**: Prevented icon layout shift (`FaUserPlus` vs. `FaArrowRight`) in the dashboard feature card during server rendering by applying post-mount token evaluation inside `src/components/HeroFinalPage.jsx`.
* **HomeBlogs Spacer Fix**: Deferred conditional empty grid spacers in `src/components/HomeBlogs/HomeBlogs.jsx` until mount.

### 3. Static Asset Resource URLs
* **Navbar Logo Fix**: Local static imports (e.g. `import Logo from "../assets/NewLogo.png"`) are compiled to objects in Next.js. Updated image elements to target `src={Logo.src || Logo}` to render correctly on both server and client engines.

### 4. Input Field Auto-Population & Data Formatting
When students update their profile at `/user-profile-filling`, pre-existing database data is parsed properly:
* **Gender Option**: Corrected casing conflicts (database returns lowercase `"male"` / `"female"`, while `<Select>` options expect `"Male"` / `"Female"`) by auto-capitalizing values on fetch.
* **Date of Birth Input**: Extracted standard format strings (`YYYY-MM-DD`) by slicing ISO datetime values (`api.date_of_birth.substring(0, 10)`) so HTML5 date elements display correctly.

### 5. Disabled 404 Event Services
* **Fix**: Commented out all query events pointing to `/api/marketing-events/my-events` inside the dashboard panels and main lifecycle triggers. Replaced with mock promise resolves to bypass production API 404 network warnings.

### 6. Dockerfile Compilation for Next.js SSR
* **Fix**: Replaced the static Vite asset copy build process (which looked for `/app/dist`) in the root `Dockerfile` with a Node.js SSR runtime container that builds inside `.next` and serves production pages dynamically via `npm run start`.

---

## ⚙️ How to Build and Run Locally

1. **Local Development**:
   ```bash
   npm run dev
   ```
2. **Production Build Compilation**:
   ```bash
   npm run build
   ```
3. **Production Server Startup**:
   ```bash
   npm run start
   ```

*Use this reference file whenever making modifications or designing new features for the Career Mitra portal.*
