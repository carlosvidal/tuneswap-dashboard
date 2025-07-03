# TuneSwap Analytics Dashboard

🎵 Real-time analytics dashboard for TuneSwap extension usage.

## 🚀 Features

- **Real-time Statistics**: Live view of conversions, users, and success rates
- **Top Content**: Most popular songs and source websites
- **Activity Feed**: Recent conversions in real-time
- **Auto-refresh**: Automatic data updates every 30 seconds
- **Export**: Download analytics data as CSV
- **Responsive**: Works on desktop and mobile

## 📊 Metrics Displayed

### Overview Stats
- Total Active Users
- Total Conversions
- Daily Conversions  
- Success Rate %

### Detailed Analytics
- Top converted songs with artist names
- Most active source websites (Twitter, Reddit, etc.)
- Real-time activity feed
- Server health status

## 🛠️ Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/tuneswap-dashboard.git
cd tuneswap-dashboard

# Serve locally (any static server)
python -m http.server 8080
# or
npx serve .
# or
php -S localhost:8080
```

### Configuration
Edit `dashboard.js` to point to your backend:

```javascript
getApiEndpoint() {
    // For production
    return 'https://your-backend.vercel.app';
    
    // For development
    return 'http://localhost:3000';
}
```

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository
2. Deploy settings:
   - Build command: (none)
   - Publish directory: `/`
3. Deploy automatically on push

### Vercel
```bash
npm install -g vercel
vercel
```

### Other Static Hosts
- GitHub Pages
- Firebase Hosting
- Surge.sh
- Any static hosting provider

## 🔗 API Endpoints Used

- `GET /health` - Server health check
- `GET /analytics/dashboard` - Main dashboard data

## 🎨 Customization

### Styling
- Edit CSS in `index.html` 
- Gradient background and glassmorphism effects
- Responsive grid layouts
- Smooth animations and transitions

### Functionality
- Modify refresh intervals in `dashboard.js`
- Add new metrics or charts
- Customize export formats
- Add filtering and date ranges

## 📱 Mobile Support

Fully responsive design that works on:
- Desktop browsers
- Tablets
- Mobile phones
- Progressive Web App ready

## 🔒 Security

- No sensitive data stored locally
- CORS-compliant API calls
- No authentication required (analytics are anonymized)

## 🐛 Troubleshooting

### Dashboard shows "Connection Error"
- Check that the backend server is running
- Verify the API endpoint URL in `dashboard.js`
- Check browser console for CORS errors

### No data displayed
- Ensure the TuneSwap extension is installed and being used
- Check that analytics are enabled in the extension
- Wait a few minutes for data to accumulate

### Auto-refresh not working
- Check browser console for JavaScript errors
- Ensure stable internet connection
- Manually refresh if needed

## 📈 Analytics Insights

Use this dashboard to:
- **Track growth** - Monitor user adoption and engagement
- **Optimize features** - See which songs/sites are most popular
- **Identify issues** - Monitor success rates and errors
- **Plan expansion** - Understand geographic usage patterns

---

Made with ❤️ for the TuneSwap community