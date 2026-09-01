Purpose: Route layout shells that decide the persistent structure around a page.

`PublicLayout` owns unauthenticated and public routes. `CreatorLayout` and
`BrandLayout` are separate authenticated application shells. The older layout
modules remain in place for compatibility while routes use the role-specific
layouts.
