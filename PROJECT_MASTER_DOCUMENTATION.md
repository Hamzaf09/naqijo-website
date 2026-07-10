# NaqiJo Website --- Project Master Documentation

> **Version:** 1.0\
> **Status:** In Progress\
> **Project:** NaqiJo Website (نقي الرابية)

# 1. Project Vision

The objective of this project is to rebuild the Naqi Al Rabia website
from scratch as a premium engineering and marketing website that
reflects the company's identity rather than a traditional water filter
store.

The website is intended to: - Present the company's services
professionally. - Build trust. - Generate leads. - Highlight engineering
expertise. - Provide an excellent Arabic-first user experience. - Be
scalable for a future dashboard and CMS.

# 2. Technology Stack

-   Next.js (App Router)
-   TypeScript
-   React
-   Git
-   GitHub
-   Vercel
-   Local Alexandria font
-   RTL-first architecture

# 3. Design Philosophy

The design direction throughout development was based on:

-   Premium minimalism.
-   Architectural photography.
-   Engineering precision.
-   Luxury branding.
-   Strong typography.
-   Arabic-first experience.
-   Responsive-first implementation.

References included premium brands such as Apple, Dyson and
architectural studio websites.

# 4. Decisions Made

## Typography

-   Switched to Alexandria font.
-   Arabic typography prioritized.
-   English numerals requested in both Arabic and English interfaces.
-   Focus on larger readable body text.

## Navigation

-   Products should be a single navigation link.
-   No fake product categories.
-   Larger logo requested.
-   Balanced spacing across navigation.

## Products

Current demo products:

1.  Jumbo Central Filter
2.  Residential Water Softener
3.  Digital 8-Stage Water Filter

Only real Naqi products should appear.

# 5. UI Review Findings

Main observations during review:

-   Hero heading needed Arabic overlap fixes.
-   Golden label above hero required better contrast.
-   Logo too small.
-   Secondary text too small.
-   Excessive spacing between sections.
-   Product descriptions lacked visual hierarchy.
-   Some sections felt visually empty.
-   Testimonials required stronger visual identity.
-   Statistics labels required rebalancing.

# 6. Images

Initially many images were considered.

Later the strategy changed:

No more unnecessary images.

Focus moved toward: - Better layout. - Better typography. - Better
spacing. - Better hierarchy. - Future cinematic videos.

# 7. Git & GitHub Journey

Repository created successfully.

Main branch established.

Production commits created.

GitHub connected successfully.

# 8. Vercel Deployment

Project deployed successfully.

Problems encountered:

## Missing Alexandria Font

Problem:

Font file ignored by Git because of:

/src/fonts/\*\*/\*.ttf

Solution:

Added exception in .gitignore.

Tracked font.

Committed.

Pushed.

Deployment succeeded.

## Deployment Protection

Problem:

Website opened only while logged into Vercel.

Cause:

Require Log In enabled.

Reviewed deployment protection configuration.

## Runtime Issue

Runtime logs reported:

TypeError: Cannot read properties of undefined (reading 'hero')

Investigation pointed toward localization/messages loading during
metadata/runtime.

Further investigation planned before production launch.

# 9. ESLint & Build

Problems encountered:

-   React hook warnings.
-   setState inside useEffect.
-   unused imports.
-   React Hook Form watch warning.

Solutions:

-   Reworked state flow.
-   Switched to useWatch().
-   Removed unused imports.
-   Localized font implementation.
-   Added robots.
-   Added sitemap.
-   Accessibility improvements.

Final status:

-   lint passes
-   build passes
-   typecheck passes

# 10. Deployment Status

Current state:

-   GitHub connected.
-   Vercel connected.
-   Automatic deployment enabled.
-   Production environment active.

# 11. Remaining Work

High Priority

-   Hero typography refinement.
-   Logo enlargement.
-   Navbar cleanup.
-   Remove products dropdown.
-   Improve body typography.
-   Reduce excessive whitespace.
-   Improve testimonials.
-   Improve statistics section.
-   Final responsive review.
-   Complete runtime investigation.
-   Connect official domain.

Medium Priority

-   SEO refinement.
-   Analytics.
-   Search Console.
-   Open Graph images.
-   Performance audit.

Future

-   Admin Dashboard.
-   CMS.
-   Lead management.
-   Maintenance requests.
-   Customer portal.

# 12. Lessons Learned

-   Always validate builds before deployment.
-   Track local assets in Git.
-   Avoid suppressing lint rules.
-   Fix root causes instead of hiding warnings.
-   Separate visual work from infrastructure work.
-   Deploy early for continuous validation.

# 13. Current Overall Status

Infrastructure: Complete.

GitHub: Complete.

Deployment: Complete.

Design Polish: In Progress.

Content Refinement: In Progress.

Production Launch: Pending final visual review and runtime verification.

# 14. Next Milestone

Before connecting the official domain:

-   Finish typography polish.
-   Fix remaining UI observations.
-   Validate production runtime.
-   Final QA across desktop, tablet and mobile.
-   Connect naqijo.com.
-   Launch version 1.0.
