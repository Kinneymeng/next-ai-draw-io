# UI Modification Changelog

## Date: 2026-01-16

### Summary
Modified the frontend UI to display only DeepSeek as an available AI provider option in the Model Configuration dialog.

### Files Modified

#### 1. `components/model-config-dialog.tsx`

**Location**: Line 376-377

**Change Description**:
- **Before**: The dialog showed all available AI providers (OpenAI, Anthropic, Google, Azure OpenAI, Amazon Bedrock, OpenRouter, DeepSeek, SiliconFlow, SGLang, AI Gateway, EdgeOne Pages, Doubao)
- **After**: The dialog now only shows DeepSeek as an available provider option

**Code Changes**:
```typescript
// Before:
const availableProviders = Object.keys(PROVIDER_INFO) as ProviderName[]

// After:
const availableProviders: ProviderName[] = ["deepseek"]
```

**Impact**:
- When users click the "添加提供商" (Add Provider) button in the Model Configuration dialog, the dropdown will only display DeepSeek as an option
- Users can still use existing provider configurations that were already saved before this change
- Backend functionality remains unchanged - all providers are still supported by the backend API
- This is a frontend-only restriction that simplifies the UI for users who only need DeepSeek

### User Experience Changes

**Before**:
- Users could select from 12+ different AI providers when adding a new provider configuration
- The provider selection dropdown showed: OpenAI, Anthropic, Google, Azure OpenAI, Amazon Bedrock, OpenRouter, DeepSeek, SiliconFlow, SGLang, AI Gateway, EdgeOne Pages, Doubao (ByteDance), ModelScope

**After**:
- Users can only select DeepSeek when adding a new provider configuration
- The provider selection dropdown shows only: DeepSeek

### Technical Notes

- This change only affects the frontend display
- Backend API endpoints (`/api/chat`, `/api/validate-model`) still support all provider types
- Provider configuration data structure (`MultiModelConfig`) remains unchanged
- Existing provider configurations in localStorage are not affected
- If users manually edit localStorage or import configurations with other providers, those will still work

### Testing Recommendations

1. Clear browser localStorage and verify that only DeepSeek appears in the "Add Provider" dropdown
2. Verify that DeepSeek provider can be added and configured successfully
3. Verify that existing non-DeepSeek providers (if any) still function correctly
4. Test model validation with DeepSeek API keys

---

## Date: 2026-01-16 (Update 2)

### Summary
Changed the display label for DeepSeek provider from "DeepSeek" to "CaTianshu" throughout the UI, while maintaining the backend API logic to continue using DeepSeek endpoints.

### Files Modified

#### 2. `lib/types/model-config.ts`

**Location**: Line 79

**Change Description**:
- **Before**: DeepSeek provider displayed as "DeepSeek" in the UI
- **After**: DeepSeek provider now displays as "CaTianshu" in the UI
- **Backend**: The provider internal name remains `"deepseek"` to ensure API calls continue working correctly

**Code Changes**:
```typescript
// Before:
deepseek: { label: "DeepSeek" },

// After:
deepseek: { label: "CaTianshu" },
```

**Impact**:
- All UI elements showing the provider name will now display "CaTianshu" instead of "DeepSeek"
- This includes:
  - Provider selection dropdown when adding a new provider
  - Provider name in the left sidebar of the Model Configuration dialog
  - Provider header in the configuration panel
  - Provider name in the model selection dropdown in the chat panel
- Backend API requests remain unchanged and continue to use the DeepSeek API endpoints
- The internal provider identifier (`ProviderName` type) remains `"deepseek"`
- All API integration logic in `lib/ai-providers.ts` continues to work without modification
- localStorage data structure is unchanged
- Existing configurations will automatically show "CaTianshu" label on reload

### User Experience Changes

**Before**:
- Provider displayed as "DeepSeek" throughout the application

**After**:
- Provider displays as "CaTianshu" throughout the application
- When selecting models, users see "CaTianshu" as the provider name
- When configuring the provider, the header shows "CaTianshu"

### Technical Notes

- **UI Layer**: Only the display label (`PROVIDER_INFO.deepseek.label`) was changed
- **Data Layer**: The provider type (`ProviderName = "deepseek"`) remains unchanged
- **API Layer**: All API calls continue to use `provider: "deepseek"` internally
- **Backend Route**: `/app/api/chat/route.ts` receives `provider: "deepseek"` and routes to correct DeepSeek API
- **No Breaking Changes**: This is purely a display/branding change with zero impact on functionality

### Code Flow Verification

1. **User sees**: "CaTianshu" in UI (from `PROVIDER_INFO.deepseek.label`)
2. **Config stores**: `provider: "deepseek"` (the `ProviderName` enum value)
3. **API receives**: `{ provider: "deepseek", ... }` in request body
4. **Backend processes**: Routes to DeepSeek API using the `"deepseek"` identifier
5. **API calls**: DeepSeek endpoints with the configured API key

### Testing Recommendations

1. Verify "CaTianshu" displays in the "Add Provider" dropdown
2. Verify "CaTianshu" shows in the provider list sidebar after adding
3. Verify "CaTianshu" appears in the provider header when selected
4. Verify model dropdown shows "CaTianshu" as the provider label
5. Test that API calls still work correctly with DeepSeek API keys
6. Verify that model validation succeeds with DeepSeek endpoints
7. Check localStorage to confirm it still stores `provider: "deepseek"` internally

---

## Date: 2026-01-16 (Update 3)

### Summary
Updated the CaTianshu (DeepSeek) provider icon to use a custom Changan Automobile logo image instead of the default DeepSeek logo from models.dev.

### Files Modified

#### 3. `components/model-config-dialog.tsx`

**Location**: Lines 93-104 (ProviderLogo function)

**Change Description**:
- **Before**: DeepSeek provider used the logo from `https://models.dev/logos/deepseek.svg`
- **After**: CaTianshu provider now displays the Changan Automobile logo from `/changan.png`

**Code Changes**:
```typescript
// Added at the beginning of ProviderLogo function:
// Use custom local logo for CaTianshu (deepseek)
if (provider === "deepseek") {
    return (
        <img
            alt="CaTianshu logo"
            className={cn("size-4", className)}
            height={16}
            src="/changan.png"
            width={16}
        />
    )
}
```

#### 4. `public/changan.png`

**Location**: New file added to public directory

**Change Description**:
- Added Changan Automobile logo image file to the public assets directory
- File path: `/public/changan.png`
- This image is now served as a static asset accessible at `/changan.png`

**Impact**:
- The CaTianshu provider now displays the Changan Automobile logo in all locations:
  - Provider selection dropdown when adding a new provider (16x16px)
  - Provider list sidebar (16x16px in 32x32px container)
  - Provider configuration header (24x24px in 48x48px container)
- Logo uses the exact branding from Changan Automobile (长安汽车)
- The logo image is loaded from local public directory instead of external CDN
- Removed the `dark:invert` class to preserve original logo colors in dark mode

### User Experience Changes

**Before**:
- DeepSeek provider displayed the DeepSeek brand logo (blue/white SVG from models.dev)

**After**:
- CaTianshu provider displays the Changan Automobile V-shaped logo
- Logo maintains consistent appearance across light and dark themes
- Provides better brand association with the Tianshu (天枢) intelligent platform

### Technical Notes

- **Logo Rendering**: Custom PNG image served from Next.js public directory
- **Size Adaptation**: Logo automatically scales to fit different container sizes:
  - Small: 16x16px (dropdown and sidebar)
  - Medium: 24x24px (configuration header)
- **Dark Mode**: Unlike other logos that use `dark:invert` filter, the Changan logo preserves its original colors
- **Loading**: Local file eliminates external network dependency
- **Fallback**: If image fails to load, browser shows standard broken image icon
- **Performance**: Small PNG file loaded once and cached by browser

### Styling Differences

```typescript
// Other providers (with dark mode inversion):
<img className="size-4 dark:invert" src="https://models.dev/logos/..." />

// CaTianshu (preserves original colors):
<img className="size-4" src="/changan.png" />
```

### File Structure

```
next-ai-draw-io/
├── public/
│   ├── changan.png          ← New: Changan logo
│   ├── doubao-color.png     ← Existing: Similar pattern
│   ├── doubao-color.svg
│   └── ...
└── components/
    └── model-config-dialog.tsx  ← Modified: Custom logo handling
```

### Testing Recommendations

1. Verify Changan logo displays correctly in "Add Provider" dropdown
2. Verify logo appears in provider list sidebar after adding CaTianshu
3. Verify logo shows in the provider configuration header
4. Test logo display in both light and dark themes
5. Verify logo scales properly at different sizes (16px and 24px)
6. Check browser DevTools Network tab to confirm image loads from `/changan.png`
7. Test with slow network to ensure image loading doesn't break UI
8. Verify alt text "CaTianshu logo" appears if image fails to load