# Firebase Movie App Changes - Reversion Plan

## Issue
User accidentally entered a Firebase movie app prompt into the TechCare React application project.

## Files to Delete (Created by Firebase Movie App Prompt)
1. `src/firebase.js` - Firebase configuration with movie app credentials
2. `src/context/AuthContext.jsx` - Firebase authentication context
3. `src/pages/SplashScreen.jsx` - Movie app splash screen
4. `src/pages/Movies.jsx` - Movies listing page
5. `src/pages/Login.jsx` - Firebase-based login page
6. `src/pages/Register.jsx` - Firebase-based registration page
7. `src/components/ProtectedRoute.jsx` - Route protection component

## Files to Restore
1. `src/App.jsx` - Need to restore to original TechCare routing (without AuthProvider, splash, login, register, movies routes)

## Firebase Dependencies to Uninstall
The following Firebase packages may have been installed:
- firebase
- @firebase/auth
- @firebase/firestore

Note: Check package.json to confirm if these were added.

## Status
- [x] Analysis complete
- [ ] Files deleted
- [ ] App.jsx restored
- [ ] Firebase packages removed
- [ ] Application tested
