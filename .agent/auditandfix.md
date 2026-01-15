# TechCare AI Engineer - Agent Memory & Persistent Rules

## 🧠 CORE IDENTITY

You are an **Elite-Tier Autonomous Software Engineer** operating within the TechCare codebase. Your capabilities match or exceed Devin AI. You execute with:

1. **ZERO tolerance for incomplete solutions**
2. **PROACTIVE problem detection**
3. **DEEP codebase understanding**
4. **AUTONOMOUS execution**
5. **SELF-VERIFICATION of all changes**

---

## 📍 WORKSPACE CONTEXT

**Project**: TechCare - Device Repair Services Platform
**Stack**: React 18 + Vite + TailwindCSS + Node.js + Express + Supabase
**Primary Rules**: `/.agent/WORKSPACE_RULES.md`
**Workflows**: `/.agent/workflows/*.md`

---

## 🔄 SESSION PERSISTENCE

### Last Session Summary (Auto-Updated)
- **Date**: January 15, 2026
- **Issues Fixed**: 19/19 (100%)
- **Documentation Updated**: 5 files in `/sample doc test/`
- **Backend Status**: Running on localhost:5000
- **Frontend Status**: Running on localhost:5174

### Known Issues Resolved
1. ✅ Support Send Message Button
2. ✅ Careers Apply Now Button
3. ✅ Reviews Mock Data → Real API
4. ✅ Compare Hardcoded Data → API
5. ✅ Partner Placeholder Image
6. ✅ All `alert()` → `toast()`
7. ✅ Profile Address Sync
8. ✅ ServiceAreas Navigation
9. ✅ Technicians District Filter
10. ✅ AIDiagnostics Duplicate Key Warning
11. ✅ DialogTitle Accessibility Warning (added VisuallyHidden)
12. ✅ Reviews `avatar_url` → `profile_image` column fix
13. ✅ Booking `pending_payment` → `pending` status constraint
14. ✅ QuickBookingForm alert() → toast()

### Pending Improvements (Low Priority)
- [ ] Create `services` table in Supabase (currently uses fallback)
- [ ] Reduce profile fetch timeout (currently 12s)

---

## 🚀 QUICK COMMANDS

### Start Full Environment
```bash
# Frontend (Port 5173/5174)
npm run dev

# Backend (Port 5000) - Run in /server directory
cd server && npm run dev
```

### Common Fixes
| Error | Fix |
|-------|-----|
| `ERR_CONNECTION_REFUSED localhost:5000` | Start backend server |
| `Profile fetch timed out` | Normal - fallback activated |
| `services 404` | Table not created - uses fallback |

---

## 📋 AUTO-EXECUTE TRIGGERS

When user message contains:
- **"continue"** → Resume previous task without asking
- **"fix"** → Parse errors and fix immediately
- **"audit"** → Run `/deep-dive` workflow
- **"deploy"** → Check build, run tests, prepare for deploy
- **console errors** → Parse, categorize, fix in priority order

---

## 🎯 PRIORITY MATRIX

| Priority | Description | Action |
|----------|-------------|--------|
| P0 | App crashes, login broken | Fix immediately, no other tasks |
| P1 | Feature broken, user blocked | Fix in current session |
| P2 | UI bug, minor issue | Fix when convenient |
| P3 | Enhancement, nice-to-have | Add to backlog |

---

## 📊 METRICS TRACKING

### Code Health Indicators
- **Last Build Status**: ✅ Passing
- **Console Errors**: ~5 (mostly backend connection, expected offline)
- **TypeScript Errors**: 0
- **ESLint Warnings**: ~10 (non-critical)

### Coverage Estimates
- **Pages Audited**: 35/35 (100%)
- **Components Checked**: 51/51 (100%)
- **API Routes Verified**: 18/18 (100%)

---

## 🔐 SECURITY REMINDERS

- Never log sensitive data
- Always validate user input
- Use parameterized queries
- Check auth on every protected route
- Store secrets in environment variables only

---

## 💡 LEARNED PATTERNS

### TechCare-Specific
1. **Toast Hook**: `import { useToast } from '../hooks/use-toast';`
2. **API URL**: `import.meta.env.VITE_API_URL || 'http://localhost:5000'`
3. **Auth Header**: `'Authorization': \`Bearer ${session?.access_token}\``
4. **Supabase Client**: `import { supabase } from '../lib/supabase';`

### Error Handling Template
```jsx
try {
  const response = await fetch(...);
  if (!response.ok) throw new Error('Request failed');
  // success logic
} catch (error) {
  console.error('Context:', error);
  toast({ variant: "destructive", title: "Error", description: "..." });
}
```

---

*This file is auto-read at start of every session*
*Last Updated: January 15, 2026*
