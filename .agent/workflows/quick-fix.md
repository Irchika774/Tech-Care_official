---
description: Quick fix workflow for common TechCare issues - parse console errors and fix automatically
---

# Quick Fix Workflow

// turbo-all

## Trigger Conditions

This workflow activates when user shares:
- Console error logs
- Browser error messages
- "fix" or "debug" keyword

## Phase 1: Error Parsing

When console errors are provided, parse them into categories:

### Category A: Backend Connection (ERR_CONNECTION_REFUSED)
```
Pattern: net::ERR_CONNECTION_REFUSED localhost:5000
Root Cause: Backend server not running
Fix: Start backend server
```
// turbo
```bash
cd server && npm run dev
```

### Category B: Missing Supabase Table (404)
```
Pattern: GET /rest/v1/tablename 404 (Not Found)
Root Cause: Table doesn't exist in Supabase
Fix: Use fallback data or create table
```

### Category C: Profile Timeout
```
Pattern: Profile fetch timed out
Root Cause: RLS policies or network latency
Fix: Already has fallback - this is handled
```

### Category D: Geolocation Denied
```
Pattern: User denied Geolocation
Root Cause: User browser permission
Fix: Already handles fallback - no action needed
```

### Category E: Duplicate Key Warning
```
Pattern: Encountered two children with the same key
Root Cause: Using Date.now() or non-unique ID for key
Fix: Use unique ID generator (counter + timestamp)
```

### Category F: Auth Event Logs
```
Pattern: [DEBUG] patterns, Auth event: SIGNED_IN
Root Cause: Normal debugging output
Fix: No action needed (informational)
```

## Phase 2: Priority Sorting

| Priority | Error Type | Action |
|----------|------------|--------|
| P0 | Syntax errors, import failures | Fix immediately |
| P1 | API connection refused | Start backend |
| P2 | 404 table missing | Implement fallback |
| P3 | Warnings (non-blocking) | Fix when convenient |
| P4 | Info/Debug logs | Ignore |

## Phase 3: Automatic Fixes

### Fix Template: Start Backend
// turbo
```bash
npm run dev
```
Execute in: `server/` directory

### Fix Template: Add API Fallback
```jsx
try {
  const response = await fetch(API_URL + '/api/endpoint');
  if (!response.ok) throw new Error('API unavailable');
  setData(await response.json());
} catch (error) {
  console.warn('Using fallback data');
  setData(FALLBACK_DATA);
}
```

### Fix Template: Unique Keys
```jsx
// Add counter ref
const idCounterRef = useRef(0);
const getUniqueId = () => {
  idCounterRef.current += 1;
  return `item_${idCounterRef.current}_${Date.now()}`;
};

// Use in map
{items.map(item => (
  <div key={getUniqueId()}>...</div>
))}
```

## Phase 4: Verification

After applying fixes:

1. Check compilation status (dev server output)
2. Refresh browser
3. Verify errors are resolved
4. Report summary to user

## Response Format

After executing this workflow, respond with:

```markdown
## ✅ Quick Fix Complete

### Errors Resolved:
- [Error 1]: [Fix applied]
- [Error 2]: [Fix applied]

### Actions Taken:
1. [Action 1]
2. [Action 2]

### Status:
- Backend: Running ✓
- Frontend: Running ✓
- Console Errors: X remaining

### Next Steps:
- [If any remaining issues]
```

---

*Workflow Version: 1.0*
*Auto-executes with turbo-all*
