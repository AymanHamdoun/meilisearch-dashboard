# How to Test the Error Page

The error page will be displayed in the following scenarios:

## 1. Connection Error (Dead Instance)
- Save a Meilisearch instance configuration in the dashboard
- Stop the Meilisearch server
- Navigate to any dashboard page (Overview, Index, etc.)
- You should see the error page with "Oh no! Connection Lost" message

## 2. Invalid API Key Error
- Configure an instance with an incorrect API key
- Try to access any feature that requires authentication
- You should see the error page with "Authentication Failed" message

## 3. Timeout Error
- Configure an instance with a URL that doesn't respond (e.g., a wrong port)
- Wait for the request to timeout (10 seconds by default)
- You should see the error page with "Connection Timeout" message

## Features of the Error Page:

1. **Different Error Messages**: The page shows appropriate messages based on the error type
2. **Clear All Data**: Clicking "Configure New Instance" clears ALL localStorage data
3. **Retry Option**: "Try Again" button attempts to reconnect without clearing data
4. **Instance Information**: Shows the failed instance URL for debugging

## Testing Steps:

### Test 1: Dead Instance
```bash
# 1. Start Meilisearch normally
meilisearch --master-key=test

# 2. Configure the instance in the dashboard
# 3. Stop Meilisearch (Ctrl+C)
# 4. Refresh the dashboard page
# Expected: Error page appears with connection error
```

### Test 2: Wrong API Key
```bash
# 1. Start Meilisearch with a master key
meilisearch --master-key=correct-key

# 2. Configure dashboard with wrong key
# Instance URL: http://localhost:7700
# API Key: wrong-key

# 3. Try to access any page
# Expected: Error page appears with authentication error
```

### Test 3: Timeout
```bash
# 1. Configure dashboard with non-existent server
# Instance URL: http://localhost:9999
# API Key: any-key

# 2. Try to access any page
# 3. Wait for timeout
# Expected: Error page appears with timeout error
```

## Implementation Details:

- All fetch requests now use `fetchWithTimeout` with a 10-second timeout
- Error types are detected and passed to the error page
- The error boundary catches unhandled errors
- `localStorage.clear()` is called when navigating to the form page
- Different error messages and icons based on error type