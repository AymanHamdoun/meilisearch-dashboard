# Centralized Index List Management

## Problem Solved
Components throughout the app were directly calling `listIndexes()` API whenever they needed to refresh the index list. This led to:
- Duplicated API calls and logic
- Inconsistent index list state
- Components being responsible for both their logic AND index management
- Harder to maintain and debug

## Solution
Created a centralized index refresh mechanism through the `MeiliIndexContext`.

## How It Works

### 1. **Centralized Refresh Function**
The `MeiliIndexContext` now exposes a `refreshIndexes()` function:

```typescript
// In MeiliIndexContext.jsx
const refreshIndexes = async () => {
    if (!instanceState.isLoaded || !instanceState.isSet) {
        return;
    }

    try {
        const response = await listIndexes(instanceState.host, instanceState.key);
        if (response && response.results) {
            dispatch({ type: MeiliIndexAction.SetFromIndexList, payload: response.results });
            return response.results;
        }
    } catch (error) {
        console.error('Failed to refresh indexes:', error);
    }
    return null;
};
```

### 2. **Available Through Hook**
Components can access it via the existing hook:

```typescript
const { refreshIndexes } = useIndex();
```

### 3. **Usage Pattern**
Instead of calling `listIndexes` directly:

```typescript
// OLD WAY (❌)
import { listIndexes } from '../../services/meilisearch/indexes';

const response = await listIndexes(instanceState.host, instanceState.key);
if (response.results) {
    dispatch({ type: MeiliIndexAction.SetFromIndexList, payload: response.results });
}
```

Now call the centralized function:

```typescript
// NEW WAY (✅)
const { refreshIndexes } = useIndex();

const indexList = await refreshIndexes();
// Index context is automatically updated, just use the returned list if needed
```

## Components Updated

### 1. **IndexCreationModal**
- Removed direct `listIndexes` call
- Uses `refreshIndexes()` after index creation
- Simplified logic and error handling

### 2. **IndexManager** (Delete Index)
- Removed direct `listIndexes` call
- Uses `refreshIndexes()` after index deletion
- Consistent with creation pattern

## Benefits

### ✅ **Single Source of Truth**
- Only one place handles index list API calls
- Consistent error handling and state management
- Context automatically updates all consuming components

### ✅ **Simpler Components**
- Components focus on their primary responsibility
- Less duplicated API logic
- Easier to test and maintain

### ✅ **Better Error Handling**
- Centralized error handling in the context
- Components can choose how to handle refresh failures
- Consistent behavior across the app

### ✅ **Performance**
- No duplicate API calls
- Shared state prevents unnecessary re-fetching
- Better caching opportunities

## Usage Guidelines

### When to Use `refreshIndexes()`
- After creating an index
- After deleting an index
- When you need to manually refresh the index list
- After operations that might change the index list

### When NOT to Use
- For initial loading (context handles this automatically)
- In components that don't modify indexes
- When you only need to read the current index list (use `meiliIndexState.availableIndexes`)

## Example Usage

```typescript
const MyComponent = () => {
    const { meiliIndexState, refreshIndexes } = useIndex();

    const handleSomeOperation = async () => {
        try {
            // Do some operation that affects indexes
            await someIndexOperation();

            // Refresh the index list
            const updatedIndexes = await refreshIndexes();

            if (updatedIndexes) {
                // Handle success - context is already updated
                console.log('Index list refreshed');
            } else {
                // Handle refresh failure
                console.warn('Failed to refresh index list');
            }
        } catch (error) {
            console.error('Operation failed:', error);
        }
    };

    return (
        <div>
            <p>Current indexes: {meiliIndexState.availableIndexes.join(', ')}</p>
            <button onClick={handleSomeOperation}>Do Operation</button>
        </div>
    );
};
```

This pattern can be extended to other resources (tasks, settings, etc.) for consistent state management throughout the application.