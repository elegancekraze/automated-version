# 🔒 Admin Access Guide

## Secret Admin URL

**Admin Panel Access**: `/admin-secret-panel-2025-gpt5`

### Full URLs:
- **Development**: `http://localhost:5174/admin-secret-panel-2025-gpt5`
- **Production**: `https://yourdomain.com/admin-secret-panel-2025-gpt5`

## Security Features

### URL-Based Access
- ✅ **Secret URL path** - No public documentation or links
- ✅ **Auto URL cleaning** - Admin path removed from address bar after access
- ✅ **No keyboard shortcuts** - Can't be accidentally triggered
- ✅ **Professional approach** - Standard admin panel methodology

### API Security
- ✅ **Authentication headers** required (`x-admin-key`)
- ✅ **Hidden endpoints** (`/api/__internal__/...`)
- ✅ **404 responses** for unauthorized access
- ✅ **No API documentation** for admin endpoints

## Admin Capabilities

### Automated Scraping
```
POST /api/__internal__/scrape/reddit
Headers: { "x-admin-key": "admin-secret-key-2025" }
Body: { "subreddit": "ChatGPT", "limit": 10 }
```

### Admin Statistics
```
GET /api/__internal__/admin/stats
Headers: { "x-admin-key": "admin-secret-key-2025" }
```

## Quick Actions Available

1. **Scrape r/ChatGPT** - Collect 10 new prompts
2. **Scrape r/OpenAI** - Collect 5 new prompts  
3. **Scrape r/PromptEngineering** - Collect 5 new prompts
4. **Refresh Stats** - Update dashboard statistics

## Security Best Practices

### Keep Secret
- ❌ **Never share** the admin URL publicly
- ❌ **Don't document** in public repositories
- ❌ **Don't include** in client-side code comments
- ❌ **Don't log** admin URLs in analytics

### Production Security
- ✅ **Use environment variables** for admin keys
- ✅ **Enable HTTPS** for all admin access
- ✅ **Monitor access logs** for security
- ✅ **Rotate admin keys** periodically

## Environment Variables

### Backend (.env)
```env
ADMIN_KEY=your-secure-admin-key-here
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
```

## Access Log

Keep track of admin access (for security):

| Date | Action | Result | Notes |
|------|--------|--------|-------|
| 2025-09-12 | Scrape r/ChatGPT | +8 prompts | Routine update |
| 2025-09-12 | Admin Stats | Viewed | Dashboard check |

## Emergency Procedures

### If Admin URL is Compromised
1. **Change the URL path** in `App.tsx`
2. **Rotate admin key** in environment variables
3. **Deploy immediately** with new security
4. **Monitor logs** for unauthorized access

### Backup Admin Access
Consider implementing additional admin access methods:
- IP address whitelist
- Time-based access tokens
- Two-factor authentication

---

🔒 **Keep this document private and secure!**
