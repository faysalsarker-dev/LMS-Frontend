# Frontend Static Code Audit Report

## 1. Unused Code Analysis

### Unused Components
- `src/components/custom/SingleFileUpload.tsx`: Never imported/used in the project.
- `src/components/shared/DemoAccess.tsx`: Never imported/used.
- `src/components/shared/LanguageToggle.tsx`: Never imported/used.
- `src/components/shared/LogoIcon.tsx`: Never imported/used.
- `src/components/modules/home/InstructorSpotlight.tsx`: Never imported/used.
- `src/components/modules/User/EditUserDialog.tsx`: Never imported/used.
- `src/components/modules/User/UserStats.tsx`: Never imported/used.
- `src/components/modules/lesson-editor/quiz/QuizUi/ActiveState.tsx`: Never imported/used.
- `src/components/modules/lesson-editor/quiz/QuizUi/CountdownState.tsx`: Never imported/used.
- `src/components/modules/lesson-editor/quiz/QuizUi/IdleState.tsx`: Never imported/used.

#### Unused Shadcn UI Components
These components were added to the project but are never imported or rendered:
- `src/components/ui/accordion.tsx`
- `src/components/ui/collapsible.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/toggle-group.tsx`
- `src/components/ui/toggle.tsx`

### Unused Hooks
- `src/hooks/use-file-upload.ts`: Dead file
- `src/hooks/use-mobile.tsx`: Dead file
- `src/hooks/useConfirmOnLeave.tsx`: Dead file
- `src/hooks/useUploadFile.ts`: Dead file

### Unused Utilities
- `src/utils/convertFromBackendFormat.tsx`: Dead file
- `src/utils/timezone.ts`: Dead file

### Unused Pages / Routing
- `src/pages/PublicPages/ErrorPages/NotFoundPage.tsx` - Has unused exports and clones, may not be cleanly integrated.

### Dead Files & Types
- `src/App.css`: Unused stylesheet.
- `src/App.tsx`: Unused entry point leftover from CRA/Vite init.
- `src/data/mockPromoData.ts`: Unused mock data.
- `src/types/course.ts`: Unused types.
- `src/types/dashboard.ts`: Unused types.
- `src/types/swiper.d.ts`: Unused types.

---

## 2. Duplicated Code

### Duplicate UI / State Logic
- **Quiz States**: Duplication between `CountdownState.tsx`, `IdleState.tsx`, and `ActiveState.tsx` in `src/components/modules/lesson-editor/quiz/QuizUi/`. Also, heavy duplication between these components and `src/pages/Student/course/QuizLesson.tsx`.
  - *Suggestion*: Extract the quiz UI rendering logic into a single generic `QuizEngine` component that accepts state props (idle, active, countdown) instead of duplicating the layout.
- **Payment Pages**: Heavy duplication between `PaymentFailed.tsx`, `PaymentSuccessPage.tsx`, and `PaymentCancelled.tsx`. Hundreds of identical lines for the layout and animated card containers.
  - *Suggestion*: Create a reusable `PaymentResultLayout` component that takes `status`, `title`, `description`, and `icon` as props.
- **Error Pages**: Duplication between `NotFoundPage.tsx`, `Unauthorized.tsx`, and `AccessDenied.tsx`.
  - *Suggestion*: Create a single `ErrorLayout` component.
- **Auth Forms**: Duplication between `ForgotPassword.tsx` and `ResetPassword.tsx` form layouts. Duplication between `Login.tsx` checkout promo codes, and `Register.tsx` layouts.
  - *Suggestion*: Create a shared `AuthFormLayout` wrapper.
- **Practice & Mock Test Dialogs**: Over 200 lines duplicated between `PracticeItemDialog.tsx` and `PracticeItemUpdateDialog.tsx`. Similarly, large duplications between `CreateMockTestDialog.tsx` and `UpdateMockTestDialog.tsx`.
  - *Suggestion*: Create a single `PracticeFormDialog` and `MockTestFormDialog` that take a `mode="create" | "update"` prop and initial data.
- **Tables & Pagination**: Duplication between `AssignmentTable.tsx` / `EnrolmentTable.tsx` / `RecentEnrollmentsTable.tsx`, and `AssignmentPagination.tsx` / `LessonPagination.tsx`.
  - *Suggestion*: Use a generic `DataTable` and `DataPagination` component.
- **Admin Course/Module Forms**: Giant duplications between `UpdateCourse.tsx` / `CreateCourse.tsx`, and `AudioModule.tsx` / `VideoModule.tsx`.
  - *Suggestion*: Consolidate form layouts and use configurable fields.

---

## 3. Component Structure Problems

### Analysis of Current Structure
The current `src/components` folder is messy because:
- **Lack of Domain Separation**: The `modules` folder contains everything from `auth` and `home` (Public) to `adminDashboard` (Admin) and `student` (Student) without clear domain boundaries.
- **Mixed Responsibilities**: Global UI components (like `shared/Header.tsx`, `LogoutDialog.tsx`) are mixed with highly specific domain components in ways that make it hard to enforce layout boundaries.
- **Inconsistent Naming**: Folders use a mix of PascalCase (`Course`, `Category`, `Testimonial`) and camelCase (`adminDashboard`, `mockTest`, `lesson-editor`).

### Component Types Categorization
Based on the audit, the components fall into these distinct categories:

**Global UI Components**
- Everything in `src/components/ui` (Shadcn UI components)
- `src/components/magicui`
- `src/components/custom`
- `src/components/form`

**Shared Components (Used across multiple domains)**
- `src/components/shared/` (Header, NavBars, LogoutDialog, PDF generators)
- `src/components/VideoPlayer/`

**Public Components**
- `src/components/modules/home`
- `src/components/modules/auth`
- `src/components/modules/checkout`

**Student Components**
- `src/components/modules/lessonPage`
- `src/components/modules/student`
- `src/components/modules/practice` (Student-facing parts)
- `src/components/modules/mockTest` (Student-facing parts)
- `src/components/modules/profile`

**Admin Components**
- `src/components/modules/adminDashboard`
- `src/components/modules/Course`
- `src/components/modules/Category`
- `src/components/modules/Testimonial`
- `src/components/modules/User`
- `src/components/modules/assignment`
- `src/components/modules/enrolment`
- `src/components/modules/milestone`
- `src/components/modules/promo`
- `src/components/modules/lesson-editor`

---

## 4. Proposed Folder Structure

### Proposed Structure
```text
src/
  components/
    ui/                (shadcn based global UI)
    form/              (reusable form controls)
    custom/            (custom global UI like FileUpload)
    magicui/           (global animated UI)
    shared/            (components used across layouts: Headers, Footers)

    public/            (components specific to PublicLayout)
      home/
      auth/
      checkout/

    student/           (components specific to StudentLayout)
      profile/
      lesson-viewer/
      practice/
      mock-test/

    admin/             (components specific to AdminLayout)
      dashboard/
      course-management/
      user-management/
      promos/
      assignments/
      lesson-editor/   (complex admin builder)

  pages/
    public/
    student/
    admin/

  layouts/
    PublicLayout/
    StudentLayout/
    AdminLayout/
```

### Why this structure is better:
1. **Domain-Driven**: Components are split strictly by the layout/consumer they belong to. An admin course editor won't accidentally be imported into the public layout.
2. **Scalability**: As the LMS grows, finding components becomes predictable. "I need to fix the student mock test UI" -> `src/components/student/mock-test/`.
3. **Consistency**: Aligns the component structure perfectly with the existing `src/pages` and routing structure (`admin.ts`, `public.ts`, `student.ts`).

---

## 5. Safe Migration Plan

This plan relies ONLY on moving files and updating imports. No logic is changed.

**Step 1: Create New Domain Directories**
- Create `src/components/public`
- Create `src/components/student`
- Create `src/components/admin`

**Step 2: Move Public Domain Components**
- Move `src/components/modules/home` -> `src/components/public/home`
- Move `src/components/modules/auth` -> `src/components/public/auth`
- Move `src/components/modules/checkout` -> `src/components/public/checkout`

**Step 3: Move Admin Domain Components**
- Move `src/components/modules/adminDashboard` -> `src/components/admin/dashboard`
- Move `src/components/modules/Course` -> `src/components/admin/course`
- Move `src/components/modules/Category` -> `src/components/admin/category`
- Move `src/components/modules/Testimonial` -> `src/components/admin/testimonial`
- Move `src/components/modules/User` -> `src/components/admin/user`
- Move `src/components/modules/assignment` -> `src/components/admin/assignment`
- Move `src/components/modules/enrolment` -> `src/components/admin/enrolment`
- Move `src/components/modules/lesson-editor` -> `src/components/admin/lesson-editor`
- Move `src/components/modules/milestone` -> `src/components/admin/milestone`
- Move `src/components/modules/promo` -> `src/components/admin/promo`

**Step 4: Move Student Domain Components**
- Move `src/components/modules/lessonPage` -> `src/components/student/lesson-page`
- Move `src/components/modules/profile` -> `src/components/student/profile`
- Move `src/components/modules/student` -> `src/components/student/dashboard`
- Move `src/components/modules/practice` -> `src/components/student/practice` (Note: split admin practice parts if necessary, otherwise keep grouped).
- Move `src/components/modules/mockTest` -> `src/components/student/mock-test` (Note: split admin mock-test parts if necessary, otherwise keep grouped).

**Step 5: Cleanup & Update Imports**
- Delete the now-empty `src/components/modules` directory to enforce the new structure.
- Run a global search and replace (or leverage your IDE's auto-import refactoring by moving folders natively via your IDE/TypeScript server) to update all paths from `components/modules/...` to their new respective `components/admin/...` or `components/public/...` locations.
- Ensure Vite builds successfully (`npm run build`).

*Do not proceed with this migration without explicit approval.*
