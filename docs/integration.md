# Integration Guide

This guide explains how to integrate BuilderX into your existing applications and platforms.

## Integration Methods

### 1. Iframe Embedding

The simplest way to embed BuilderX is using an iframe:

```html
<iframe 
  src="https://your-domain.com/builderx" 
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

**Pros:**
- Complete isolation
- No conflicts with parent page
- Easy to implement

**Cons:**
- Limited communication
- Fixed dimensions
- No shared styling

### 2. JavaScript Embedding

For more control, embed BuilderX as a JavaScript widget:

```html
<div id="builderx-container"></div>
<script src="https://your-domain.com/builderx.js"></script>
<script>
  BuilderX.init({
    container: '#builderx-container',
    onSave: (data) => {
      // Handle saved data
      console.log('Page saved:', data);
    },
    onExport: (html, json) => {
      // Handle export
      console.log('HTML:', html);
      console.log('JSON:', json);
    }
  });
</script>
```

### 3. React Component

If you're using React, import BuilderX as a component:

```tsx
import { BuilderX } from '@builderx/react';

function MyApp() {
  const handleSave = (data) => {
    // Save to your backend
    fetch('/api/pages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return (
    <BuilderX
      onSave={handleSave}
      initialData={existingPageData}
      theme="light"
    />
  );
}
```

## Platform-Specific Integration

### WordPress Plugin

Create a WordPress plugin to integrate BuilderX:

```php
<?php
/**
 * Plugin Name: BuilderX Page Builder
 */

class BuilderXPlugin {
    public function __construct() {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_shortcode('builderx', [$this, 'render_shortcode']);
    }

    public function enqueue_scripts() {
        wp_enqueue_script('builderx', plugin_dir_url(__FILE__) . 'builderx.js');
        wp_enqueue_style('builderx', plugin_dir_url(__FILE__) . 'builderx.css');
    }

    public function render_shortcode($atts) {
        $page_id = $atts['id'] ?? 0;
        $page_data = get_post_meta($page_id, 'builderx_data', true);
        
        return '<div id="builderx-' . $page_id . '" data-page="' . esc_attr($page_data) . '"></div>';
    }
}

new BuilderXPlugin();
```

### Laravel Integration

For Laravel applications:

```php
// routes/web.php
Route::get('/builder', [BuilderController::class, 'index']);
Route::post('/builder/save', [BuilderController::class, 'save']);

// app/Http/Controllers/BuilderController.php
class BuilderController extends Controller
{
    public function index()
    {
        return view('builder.index');
    }

    public function save(Request $request)
    {
        $page = Page::create([
            'title' => $request->title,
            'content' => $request->content,
            'builderx_data' => $request->builderx_data
        ]);

        return response()->json(['success' => true, 'page' => $page]);
    }
}
```

```blade
{{-- resources/views/builder/index.blade.php --}}
@extends('layouts.app')

@section('content')
<div id="builderx-container"></div>
@endsection

@push('scripts')
<script src="{{ asset('js/builderx.js') }}"></script>
<script>
    BuilderX.init({
        container: '#builderx-container',
        saveUrl: '{{ route("builder.save") }}',
        csrfToken: '{{ csrf_token() }}'
    });
</script>
@endpush
```

### Ghost CMS Integration

For Ghost themes, add BuilderX support:

```handlebars
{{!-- partials/builderx.hbs --}}
<div class="builderx-content">
    {{#if page.builderx_data}}
        {{{page.builderx_data}}}
    {{else}}
        <div class="builderx-placeholder">
            <p>No content available</p>
        </div>
    {{/if}}
</div>
```

```javascript
// assets/js/builderx.js
if (document.querySelector('.builderx-content')) {
    BuilderX.init({
        container: '.builderx-content',
        mode: 'view' // Read-only mode
    });
}
```

## API Integration

### REST API Endpoints

BuilderX can communicate with your backend via REST API:

```javascript
// Save page data
const savePage = async (pageData) => {
    const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: pageData.title,
            content: pageData.html,
            schema: pageData.json
        })
    });
    
    return response.json();
};

// Load page data
const loadPage = async (pageId) => {
    const response = await fetch(`/api/pages/${pageId}`);
    const data = await response.json();
    
    return {
        html: data.content,
        json: data.schema
    };
};
```

### WebSocket Integration

For real-time collaboration:

```javascript
const socket = io('ws://your-server.com');

// Send changes
const sendChange = (change) => {
    socket.emit('page-change', {
        pageId: currentPageId,
        change: change
    });
};

// Receive changes
socket.on('page-change', (data) => {
    if (data.pageId === currentPageId) {
        applyChange(data.change);
    }
});
```

## Customization

### Theming

Customize BuilderX appearance:

```css
/* Override default styles */
.builderx-container {
    --primary-color: #your-brand-color;
    --background-color: #your-bg-color;
    --text-color: #your-text-color;
}

.builderx-sidebar {
    background: var(--background-color);
    border-color: var(--primary-color);
}

.builderx-canvas {
    background: var(--background-color);
}
```

### Custom Blocks

Add your own block types:

```javascript
// Register custom block
BuilderX.registerBlock({
    type: 'custom-block',
    name: 'Custom Block',
    icon: '🎨',
    component: CustomBlockComponent,
    defaultProps: {
        customProperty: 'default-value'
    }
});
```

### Event Hooks

Listen to BuilderX events:

```javascript
BuilderX.on('block-added', (block) => {
    console.log('Block added:', block);
});

BuilderX.on('page-saved', (data) => {
    // Auto-save to your backend
    saveToBackend(data);
});

BuilderX.on('export', (html, json) => {
    // Custom export handling
    customExportHandler(html, json);
});
```

## Security Considerations

### Content Security Policy

Ensure your CSP allows BuilderX:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

### Data Validation

Always validate data from BuilderX:

```php
// PHP example
public function savePage(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'builderx_data' => 'required|json'
    ]);
    
    // Sanitize HTML content
    $validated['content'] = strip_tags($validated['content'], '<p><div><span><img><a>');
    
    return Page::create($validated);
}
```

### Authentication

Protect BuilderX endpoints:

```javascript
// Add authentication headers
const authenticatedFetch = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
};
```

## Performance Optimization

### Lazy Loading

Load BuilderX only when needed:

```javascript
const loadBuilderX = async () => {
    const { BuilderX } = await import('./builderx.js');
    return BuilderX;
};

// Load on user interaction
document.getElementById('edit-page').addEventListener('click', async () => {
    const BuilderX = await loadBuilderX();
    BuilderX.init({ container: '#builderx-container' });
});
```

### Caching

Cache BuilderX assets:

```nginx
# nginx.conf
location /builderx/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Common Issues

1. **CSP Violations**
   - Check Content Security Policy settings
   - Ensure inline styles are allowed

2. **CORS Errors**
   - Configure CORS headers on your server
   - Use relative URLs when possible

3. **Performance Issues**
   - Enable code splitting
   - Use lazy loading for large pages

4. **Mobile Issues**
   - Test touch interactions
   - Ensure responsive design

### Debug Mode

Enable debug mode for troubleshooting:

```javascript
BuilderX.init({
    container: '#builderx-container',
    debug: true,
    logLevel: 'verbose'
});
```

## Support

For integration help:
- Check the [API Reference](./api-reference.md)
- Review [Architecture Guide](./architecture.md)
- Open an issue on GitLab
- Contact support@smackcoders.com
