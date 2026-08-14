# MsaFacture — Design System & UI Components Standard Rule

This document defines the strict, mandatory design system standards for MsaFacture SaaS application. All new components, pages, forms, tables, modals, badges, and layout elements generated or modified within this repository MUST follow these rules without exception.

---

## 1. Global Visual Identity & Color Palette

- **Primary Accent / Brand**: Indigo (`indigo-600` / `primary-600`).
  - Active/Button: `bg-indigo-600 hover:bg-indigo-700 text-white`
  - Subtle background: `bg-indigo-50/50 border border-indigo-100 text-indigo-700`
  - Focus Ring: `focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`

- **Success Palette**: Soft Emerald/Green.
  - Badge / Status: `bg-emerald-50 text-emerald-700 border border-emerald-200/60`
  - Action Button: `bg-emerald-600 hover:bg-emerald-700 text-white`

- **Warning Palette**: Soft Warm Amber.
  - Badge / Card: `bg-amber-50 text-amber-800 border border-amber-200/80`

- **Overdue / Danger Palette**: Soft Rose Red (**No harsh dark red!**).
  - Status Badge: `bg-rose-50 text-rose-700 border border-rose-200/60`
  - Alert Box: `bg-rose-50/50 border border-rose-100 text-rose-800`
  - Button: `bg-rose-500 hover:bg-rose-600 text-white border border-rose-400 shadow-2xs`

- **Neutral Backgrounds & Borders**:
  - Page Background: `bg-slate-50/60`
  - Cards & Containers: `bg-white border border-slate-200/80 shadow-xs rounded-2xl`
  - Subdued Text: `text-slate-500` / `text-slate-400`
  - Dark Headings: `text-slate-900` / `font-bold`

---

## 2. Layout & Header Architecture Rules

1. **Top Header Bar (`Header.tsx`)**:
   - Height: `h-[58px]`, `sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80`.
   - Left: Mobile menu toggle + Breadcrumbs link.
   - Right: Search input, plan badge, notifications bell, user profile avatar (`Moussa Mbow`).

2. **No Duplicate Top-Right CTA Buttons**:
   - Primary creation buttons ("+ Nouvelle facture", "Nouveau client") reside in the left sidebar or single page CTA. **NEVER duplicate the primary creation button at the top-right header next to secondary actions** (*CSV*, *Imprimer*, *PDF*).

3. **Action Button Sizing**:
   - Left sidebar primary CTA: `btn-primary text-xs py-1.5 px-3 rounded-lg font-semibold h-8`.
   - Top-right secondary buttons (*CSV*, *Imprimer*, *PDF*): `btn-secondary text-xs py-1.5 px-3 h-8 gap-1.5`.

---

## 3. Cards, Tables & Component Patterns

1. **Card Container Standard**:
   ```tsx
   <div className="card bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
     <div className="card-header flex items-center justify-between px-5 py-4 border-b border-slate-100">
       <h2 className="text-base font-bold text-slate-900">{title}</h2>
     </div>
     <div className="card-body p-5">
       {/* Content */}
     </div>
   </div>
   ```

2. **Table Design & Clean Columns**:
   - Container: `.table-container overflow-x-auto`.
   - Table element: `.table w-full text-left border-collapse`.
   - Rows: `hover:bg-slate-50/60 transition-colors`.
   - **No Initials Circle Avatars**: Client name columns MUST render clean typography (`text-sm font-semibold text-slate-900`) without avatar circles (`[KT]`, `[AB]`).

3. **Status Badges (`InvoiceStatusBadge`)**:
   - `payee`: `bg-emerald-50 text-emerald-700 border border-emerald-200/60`
   - `envoyee`: `bg-indigo-50 text-indigo-700 border border-indigo-200/60`
   - `brouillon`: `bg-slate-100 text-slate-700 border border-slate-200`
   - `en_retard`: `bg-rose-50 text-rose-700 border border-rose-200/60`

4. **FCFA Currency Formatting**:
   - Always format currency using `formatCFA(amount)` from `@/lib/utils`.
   - All amounts MUST be rounded to the nearest integer (`Math.round(...)`). Ex: `125 000 F CFA`.

---

## 4. Micro-Animations & Responsiveness

- Active state Feedback: `active:scale-[0.98] transition-transform` on buttons.
- Mobile Drawer: Sliding menu with backdrop blur `bg-slate-900/60 backdrop-blur-xs`.
- Responsive Grid layouts: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`.

---

## 5. Compliance Enforcement

Whenever generating or modifying pages, dialogs, forms, or components for MsaFacture:
- Automatically apply these CSS tokens and design patterns.
- Always start responses to the user with `"Salam Moussa"`.
