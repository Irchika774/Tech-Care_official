---
description: Deep dive into TechCare codebase to find and fix all issues automatically
---

# TechCare Deep Dive Workflow

// turbo-all

## Phase 1: Environment Setup

1. Check if frontend development server is running:
   ```bash
   # Should be running on port 5173 or 5174
   netstat -an | findstr :5173
   ```

2. Check if backend development server is running:
   ```bash
   # Should be running on port 5000
   netstat -an | findstr :5000
   ```

3. If backend not running, start it:
   ```bash
   cd server && npm run dev
   ```

## Phase 2: Codebase Mapping

Execute these analysis commands to understand the codebase:

1. List all frontend pages:
   ```
   find_by_name in src/pages with Extension: jsx
   ```

2. List all components:
   ```
   find_by_name in src/components with Extension: jsx
   ```

3. List all backend routes:
   ```
   find_by_name in server/routes with Extension: js
   ```

## Phase 3: Issue Detection

Search for common issue patterns:

1. Find TODO/FIXME comments:
   ```
   grep_search for "TODO" in src/
   grep_search for "FIXME" in src/
   ```

2. Find alert() usage (should be toast):
   ```
   grep_search for "alert(" in src/
   ```

3. Find console.log (should be removed in production):
   ```
   grep_search for "console.log" in src/
   ```

4. Find empty onClick handlers:
   ```
   grep_search for "onClick={() => {}}" in src/
   ```

5. Find mock data TODOs:
   ```
   grep_search for "mock" in src/
   ```

## Phase 4: Issue Categorization

Categorize findings by severity:

| Priority | Pattern | Action |
|----------|---------|--------|
| P0 | Crashes, auth broken | Fix immediately |
| P1 | Feature broken | Fix in session |
| P2 | UI bug, minor | Fix when convenient |
| P3 | Enhancement | Add to backlog |

## Phase 5: Automated Fixes

For each issue found:

1. View the affected file using `view_file`
2. Understand the context and root cause
3. Apply fix using `replace_file_content` or `multi_replace_file_content`
4. Verify no compilation errors

### Common Fix Templates:

**Replace alert() with toast():**
```jsx
// Before
alert('Message here');

// After
toast({
  title: "Title",
  description: "Message here",
  variant: "destructive" // if error
});
```

**Add onClick handler:**
```jsx
// Before
<button onClick={() => {}}>

// After
<button onClick={() => navigate('/path')}>
```

**Replace mock data with API:**
```jsx
// Before
const data = [{ mock: 'data' }];

// After
const [data, setData] = useState([]);
useEffect(() => {
  fetch('/api/endpoint')
    .then(res => res.json())
    .then(setData)
    .catch(console.error);
}, []);
```

## Phase 6: Documentation Update

After fixing issues, update:

1. `/sample doc test/MASTER_ISSUE_LOG.md` - Log all issues found/fixed
2. `/.agent/auditandfix.md` - Update session summary
3. Create git commit message with all changes

## Phase 7: Verification

1. Check browser for console errors
2. Verify all pages load correctly
3. Test key user flows:
   - Login/Logout
   - Browse technicians
   - Book a service
   - View dashboard

## Completion Criteria

- [ ] All P0/P1 issues resolved
- [ ] No new console errors introduced
- [ ] Documentation updated
- [ ] User notified with summary

---

*Workflow Version: 2.0*
*Supports: Autonomous execution with turbo-all*
