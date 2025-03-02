@echo off
cd src

:: Create the "components" folder if it doesn't exist
if not exist components mkdir components

:: Create files inside the "components" folder
type nul > components\Navbar.tsx
type nul > components\Hero.tsx
type nul > components\Features.tsx
type nul > components\CTA.tsx
type nul > components\Footer.tsx

:: Create "App.tsx" and "index.css" in the "src" folder
type nul > App.tsx
type nul > index.css

echo ✅ All files have been created successfully!
pause
