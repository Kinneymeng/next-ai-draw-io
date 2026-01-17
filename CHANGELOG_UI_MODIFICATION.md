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

---

## Date: 2026-01-17 (Update 4)

### Summary
Added default base URL for CaTianshu (DeepSeek) provider to automatically use Changan Tianshu API endpoint. The base URL field now displays `http://ai.sda.changan.com.cn/api/v1` as placeholder and default value, and API requests will use this URL unless the user provides a custom one.

### Files Modified

#### 5. `lib/types/model-config.ts`

**Location**: Lines 79-82

**Change Description**:
- **Before**: CaTianshu provider had no default base URL configured
- **After**: CaTianshu provider now has default base URL: `http://ai.sda.changan.com.cn/api/v1`

**Code Changes**:
```typescript
// Before:
deepseek: { label: "CaTianshu" },

// After:
deepseek: {
    label: "CaTianshu",
    defaultBaseUrl: "http://ai.sda.changan.com.cn/api/v1",
},
```

**Impact**:
- When users create a new CaTianshu provider, the base URL field is pre-filled with the default value
- The base URL input field shows `http://ai.sda.changan.com.cn/api/v1` as placeholder text
- This value is automatically saved to the provider configuration during creation

#### 6. `lib/ai-providers.ts`

**Location**: Lines 697-710

**Change Description**:
- **Before**: Used official DeepSeek API endpoint when no base URL was provided
- **After**: Always uses Changan Tianshu endpoint (`http://ai.sda.changan.com.cn/api/v1`) as fallback

**Code Changes**:
```typescript
// Before:
case "deepseek": {
    const apiKey = overrides?.apiKey || process.env.DEEPSEEK_API_KEY
    const baseURL = overrides?.baseUrl || process.env.DEEPSEEK_BASE_URL
    if (baseURL || overrides?.apiKey) {
        const customDeepSeek = createDeepSeek({
            apiKey,
            ...(baseURL && { baseURL }),
        })
        model = customDeepSeek(modelId)
    } else {
        model = deepseek(modelId)
    }
    break
}

// After:
case "deepseek": {
    const apiKey = overrides?.apiKey || process.env.DEEPSEEK_API_KEY
    // Use default baseURL if not provided or empty
    const baseURL =
        (overrides?.baseUrl && overrides.baseUrl.trim()) ||
        process.env.DEEPSEEK_BASE_URL ||
        "http://ai.sda.changan.com.cn/api/v1"
    const customDeepSeek = createDeepSeek({
        apiKey,
        baseURL,
    })
    model = customDeepSeek(modelId)
    break
}
```

**Impact**:
- API requests from CaTianshu provider now always use a base URL (never undefined)
- Priority order for base URL selection:
  1. User-provided base URL (from UI input field, if not empty)
  2. Environment variable `DEEPSEEK_BASE_URL` (if set)
  3. Default Changan Tianshu endpoint: `http://ai.sda.changan.com.cn/api/v1`
- Empty or whitespace-only base URLs are treated as "not provided" and fall back to defaults
- All API calls are now made through `createDeepSeek()` with explicit base URL (no more default SDK behavior)

---

6. #### `lib/i18n/dictionaries/zh.json`

- 修改了一些配置

### User Experience Changes

**Before**:
- Base URL field was empty when creating a new CaTianshu provider
- Users had to manually enter the Changan Tianshu API endpoint
- If left empty, requests would go to official DeepSeek API

**After**:
- Base URL field shows `http://ai.sda.changan.com.cn/api/v1` as placeholder
- New CaTianshu providers are created with this URL pre-filled
- API requests automatically use Changan Tianshu endpoint unless user specifies otherwise
- Users can still customize the base URL by typing a different value

### Technical Notes

**UI Behavior**:
- The base URL input field in `components/model-config-dialog.tsx` (lines 1095-1119) already uses `PROVIDER_INFO[provider].defaultBaseUrl` as placeholder
- When users create a new provider, `createProviderConfig()` (line 251) sets `baseUrl: PROVIDER_INFO[provider].defaultBaseUrl`
- This means new CaTianshu providers will have the base URL already saved in localStorage

**API Request Behavior**:
- `lib/ai-providers.ts` receives `overrides.baseUrl` from the stored configuration
- If the user clears the base URL field (empty string), the system falls back to the default
- The `trim()` check ensures whitespace-only values are treated as empty
- Environment variable `DEEPSEEK_BASE_URL` can still override the default for server-side deployments

**Fallback Chain**:
```
User Input (UI) → Env Var → Default URL
       ↓              ↓           ↓
"custom.com"   DEEPSEEK_BASE_URL   "http://ai.sda.changan.com.cn/api/v1"
```

**Data Flow**:
1. **Provider Creation**: User adds CaTianshu provider
   - `createProviderConfig("deepseek")` sets `baseUrl: "http://ai.sda.changan.com.cn/api/v1"`
   - Saved to localStorage
2. **API Request**: User sends a chat message
   - Frontend reads `baseUrl` from selected model config
   - Sends to `/api/chat` as `overrides.baseUrl`
   - Backend receives and uses in `getAIModel(overrides)`
   - API call made to `http://ai.sda.changan.com.cn/api/v1/chat/completions`

### Testing Recommendations

1. **New Provider Creation**:
   - Add a new CaTianshu provider
   - Verify base URL field shows `http://ai.sda.changan.com.cn/api/v1` as placeholder
   - Verify the field is pre-filled with this value (not just a placeholder)
   - Save and verify the URL is stored in localStorage

2. **API Request Testing**:
   - Configure CaTianshu with valid API key
   - Send a test message
   - Check browser DevTools Network tab
   - Verify request goes to `http://ai.sda.changan.com.cn/api/v1/chat/completions`

3. **Custom Base URL**:
   - Edit an existing CaTianshu provider
   - Change base URL to a custom value (e.g., `https://custom.example.com`)
   - Verify API requests use the custom URL instead

4. **Empty Base URL Handling**:
   - Edit a CaTianshu provider
   - Clear the base URL field completely (empty string)
   - Save the provider
   - Verify API requests still use the default `http://ai.sda.changan.com.cn/api/v1`

5. **Environment Variable Override**:
   - Set `DEEPSEEK_BASE_URL=https://test.example.com` in `.env.local`
   - Restart the dev server
   - Create a new provider with empty base URL
   - Verify requests use `https://test.example.com` instead of the default

6. **Validation Test**:
   - Configure CaTianshu provider with Changan API key
   - Click the "测试" (Test) button
   - Verify validation request uses `http://ai.sda.changan.com.cn/api/v1`
   - Check that validation succeeds if credentials are correct

---

## Date: 2026-01-17 (Update 5)

### Summary
Migrated from Google Fonts to local font files to enable production builds in intranet environments without internet access. This change replaces `next/font/google` with `next/font/local` while maintaining identical CSS variable names and font rendering behavior.

### Problem Statement
The project failed to build with `npm run build` in intranet (offline) environments because Next.js could not fetch fonts from Google Fonts during the build process. The build errors occurred for both JetBrains Mono and Plus Jakarta Sans fonts:
```
Error: Turbopack build failed with 2 errors:
Failed to fetch JetBrains Mono from Google Fonts.
Failed to fetch Plus Jakarta Sans from Google Fonts.
```

### Solution
Downloaded font files from Google Fonts and configured Next.js to use local fonts instead of remote fonts, ensuring builds work in offline environments.

### Files Modified

#### 7. `app/fonts.ts` (New File)

**Location**: New file created in `app/` directory

**Change Description**:
- Created centralized font configuration file using `next/font/local`
- Defines local font configurations for Plus Jakarta Sans and JetBrains Mono

**Code Added**:
```typescript
import localFont from "next/font/local"

export const plusJakarta = localFont({
    src: "./fonts/PlusJakartaSans-VariableFont_wght.ttf",
    variable: "--font-sans",
    weight: "400 700",
    display: "swap",
})

export const jetbrainsMono = localFont({
    src: "./fonts/JetBrainsMono-VariableFont_wght.ttf",
    variable: "--font-mono",
    weight: "400 500",
    display: "swap",
})
```

**Impact**:
- Exports font configurations using the same variable names as before (`plusJakarta`, `jetbrainsMono`)
- Uses the same CSS variables (`--font-sans`, `--font-mono`) to ensure zero CSS changes needed
- Specifies weight ranges that match the original Google Fonts configuration
- Uses `display: "swap"` for optimal loading behavior (text remains visible during font loading)

#### 8. `app/[lang]/layout.tsx`

**Location**: Lines 1-11

**Change Description**:
- **Before**: Imported fonts from `next/font/google` and defined font configurations inline
- **After**: Imports pre-configured fonts from local `@/app/fonts` module

**Code Changes**:
```typescript
// Before (lines 3, 13-23):
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"

const plusJakarta = Plus_Jakarta_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["400", "500"],
})

// After (line 9):
import { jetbrainsMono, plusJakarta } from "@/app/fonts"
```

**Impact**:
- Simplified the layout file by removing inline font configuration
- Removed dependency on `next/font/google` and external Google Fonts CDN
- Line 161 (`className={...}`) remains unchanged as variable names are identical

### Font Files Added

#### 9. `app/fonts/JetBrainsMono-VariableFont_wght.ttf`

**Location**: New font file in `app/fonts/` directory

**Change Description**:
- Variable TrueType font supporting all weights from 100-900
- Copied from Google Fonts download package
- File size: ~189 KB
- Supports the required weights: 400 (Regular), 500 (Medium)

#### 10. `app/fonts/PlusJakartaSans-VariableFont_wght.ttf`

**Location**: New font file in `app/fonts/` directory

**Change Description**:
- Variable TrueType font supporting all weights from 200-800
- Copied from Google Fonts download package
- File size: ~174 KB
- Supports the required weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### User Experience Changes

**Before**:
- Fonts loaded from Google Fonts CDN at runtime
- Build process required internet access to fetch font metadata
- Production build failed in offline/intranet environments

**After**:
- Fonts bundled with the application as static assets
- Build process works completely offline
- Identical font rendering (same fonts, same weights, same CSS variables)
- No visual differences in the UI
- Slightly larger initial bundle size (~363 KB for both fonts)

### Technical Notes

**Why Variable Fonts**:
- Variable fonts contain all weight variations in a single file
- More efficient than including separate files for each weight (400, 500, 600, 700)
- Next.js `next/font/local` has excellent support for variable fonts
- Reduces HTTP requests and total file size compared to multiple static font files

**CSS Variables Unchanged**:
- `--font-sans` (Plus Jakarta Sans) - used throughout the app via `font-sans` Tailwind class
- `--font-mono` (JetBrains Mono) - used for code and monospace text via `font-mono` Tailwind class
- `app/globals.css` lines 11-12 and line 214 remain unchanged
- Tailwind v4 inline configuration in `globals.css` automatically picks up these variables

**Build Behavior**:
- `next/font/local` processes fonts at build time (not runtime)
- Generates optimized font loading CSS
- Creates font subsets automatically
- No network requests needed during build
- Font files are served as static assets from `.next/static/media/`

**Weight Specification**:
- Format: `"min max"` for variable fonts (e.g., `"400 700"`)
- Tells Next.js which weight range to include in CSS `@font-face`
- Does not restrict the actual weights available (variable fonts support all weights in their range)
- Matches the original Google Fonts configuration weights

### Performance Impact

**Bundle Size**:
- Added ~363 KB to the static assets (189 KB + 174 KB)
- Fonts are loaded once and cached by browser
- Eliminates external CDN dependency

**Loading Speed**:
- **Before**: Fonts loaded from Google Fonts CDN (external network request)
- **After**: Fonts served from same origin (faster, more reliable)
- No external DNS lookup or connection needed
- Better performance in intranet environments

**Build Time**:
- **Before**: Build failed in offline environments
- **After**: Build succeeds regardless of network connectivity
- Minimal build time impact from local font processing

### Testing Recommendations

1. **Build Test**:
   - Run `npm run build` in an offline environment
   - Verify build completes without font fetch errors
   - Check `.next/static/media/` for generated font files

2. **Visual Regression**:
   - Compare UI before and after in browser
   - Verify font rendering is identical
   - Test font weights: Regular (400), Medium (500), SemiBold (600), Bold (700)
   - Check both light and dark themes

3. **Performance**:
   - Check Lighthouse score for font loading
   - Verify `font-display: swap` behavior (text visible during load)
   - Test on slow connections to ensure fonts load properly

4. **Production Deployment**:
   - Build and start production server: `npm run build && npm run start`
   - Verify fonts load correctly on port 6001
   - Check browser DevTools Network tab to confirm fonts served from local origin
   - Test in multiple browsers (Chrome, Firefox, Safari, Edge)

5. **Development Mode**:
   - Verify `npm run dev` still works correctly
   - Hot reload should preserve font configurations
   - No console errors related to fonts

### Migration Path for Other Deployments

If you need to revert to Google Fonts or use a different font source:

1. **Revert to Google Fonts**:
   - Remove `app/fonts.ts`
   - Restore original imports in `app/[lang]/layout.tsx`
   - Remove font files from `app/fonts/`

2. **Add More Weights**:
   - Download additional static font files from Google Fonts
   - Update `src` in `app/fonts.ts` to array of font files
   - Adjust `weight` property to include new weight range

3. **Add Italic Variants**:
   - Copy italic variable font files to `app/fonts/`
   - Update `src` property to include italic variants:
   ```typescript
   src: [
       { path: "./fonts/Font-VariableFont_wght.ttf", style: "normal" },
       { path: "./fonts/Font-Italic-VariableFont_wght.ttf", style: "italic" }
   ]
   ```