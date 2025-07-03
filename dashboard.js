// dashboard.js - TuneSwap Analytics Dashboard

class TuneSwapDashboard {
  constructor() {
    // Backend endpoint - change this to your deployed backend URL
    this.apiEndpoint = this.getApiEndpoint();
    this.autoRefreshInterval = null;
    this.refreshRate = 30000; // 30 seconds

    console.log("🎵 TuneSwap Dashboard initialized");
    console.log("📡 API Endpoint:", this.apiEndpoint);
  }

  // Get API endpoint based on environment
  getApiEndpoint() {
    // For development
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:3000";
    }

    // For production - change this to your deployed backend URL
    return "https://tuneswap-backend.vercel.app";

    // Alternative endpoints you might use:
    // return 'https://your-backend.railway.app';
    // return 'https://api.tuneswap.xyz';
  }

  // Load analytics data
  async loadAnalytics() {
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");
    const content = document.getElementById("dashboard-content");
    const lastUpdated = document.getElementById("last-updated");

    loading.style.display = "block";
    error.style.display = "none";
    content.style.display = "none";
    lastUpdated.style.display = "none";

    try {
      console.log("📊 Loading analytics data...");

      // Check server health first
      await this.checkServerHealth();

      // Load dashboard data
      const response = await fetch(`${this.apiEndpoint}/analytics/dashboard`);

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Analytics data loaded:", data);

      this.displayAnalytics(data);

      loading.style.display = "none";
      content.style.display = "block";
      lastUpdated.style.display = "block";

      // Update last refresh time
      document.getElementById("update-time").textContent =
        new Date().toLocaleTimeString();
    } catch (err) {
      console.error("❌ Error loading analytics:", err);

      loading.style.display = "none";
      error.style.display = "block";

      document.getElementById("error-message").textContent = err.message;

      // Update server status
      this.updateServerStatus(false);
    }
  }

  // Check server health
  async checkServerHealth() {
    try {
      const response = await fetch(`${this.apiEndpoint}/health`);
      const health = await response.json();

      console.log("💓 Server health:", health);
      this.updateServerStatus(true, health);

      return health;
    } catch (error) {
      console.warn("⚠️ Health check failed:", error);
      this.updateServerStatus(false);
      throw error;
    }
  }

  // Update server status indicator
  updateServerStatus(isOnline, healthData = null) {
    const statusIndicator = document.getElementById("server-status");
    const statusText = document.getElementById("status-text");

    if (isOnline) {
      statusIndicator.className = "status-indicator status-online";

      if (healthData) {
        statusText.textContent = `Online (${healthData.events || 0} events, ${
          healthData.users || 0
        } users)`;
      } else {
        statusText.textContent = "Online";
      }
    } else {
      statusIndicator.className = "status-indicator status-offline";
      statusText.textContent = "Offline";
    }
  }

  // Display analytics data
  displayAnalytics(data) {
    // Update stats
    document.getElementById("total-users").textContent = this.formatNumber(
      data.totalUsers || 0
    );
    document.getElementById("total-conversions").textContent =
      this.formatNumber(data.totalConversions || 0);
    document.getElementById("daily-conversions").textContent =
      this.formatNumber(data.dailyConversions || 0);
    document.getElementById("success-rate").textContent =
      (data.successRate || 0) + "%";

    // Display top songs
    this.displayTopSongs(data.topSongs || []);

    // Display top websites
    this.displayTopWebsites(data.topWebsites || []);

    // Display real-time activity
    this.displayRealtimeActivity(data.realtimeActivity || []);
  }

  // Display top songs
  displayTopSongs(songs) {
    const container = document.getElementById("top-songs-list");

    if (songs.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No conversions yet</h3>
                    <p>Songs will appear here once users start converting Spotify links</p>
                </div>
            `;
      return;
    }

    container.innerHTML = songs
      .map(
        (song) => `
            <div class="list-item">
                <div class="song-info">
                    <div class="song-title">${this.escapeHtml(song.title)}</div>
                    <div class="song-artist">${this.escapeHtml(
                      song.artist
                    )}</div>
                </div>
                <div class="conversion-count">${this.formatNumber(
                  song.conversions
                )}</div>
            </div>
        `
      )
      .join("");
  }

  // Display top websites
  displayTopWebsites(websites) {
    const container = document.getElementById("top-websites-list");

    if (websites.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No page visits yet</h3>
                    <p>Websites will appear here once users visit pages with Spotify links</p>
                </div>
            `;
      return;
    }

    container.innerHTML = websites
      .map(
        (site) => `
            <div class="list-item">
                <div class="song-info">
                    <div class="website">${this.escapeHtml(site.hostname)}</div>
                    <span class="category">${(site.category || "other").replace(
                      "_",
                      " "
                    )}</span>
                </div>
                <div class="conversion-count">${this.formatNumber(
                  site.conversions
                )}</div>
            </div>
        `
      )
      .join("");
  }

  // Display real-time activity
  displayRealtimeActivity(activities) {
    const container = document.getElementById("realtime-activity");

    if (activities.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>No recent activity</h3>
                    <p>Recent conversions will appear here in real-time</p>
                </div>
            `;
      return;
    }

    container.innerHTML = activities
      .map(
        (activity) => `
            <div class="list-item">
                <div class="song-info">
                    <div class="song-title">${this.escapeHtml(
                      activity.song
                    )} - ${this.escapeHtml(activity.artist)}</div>
                    <div class="song-artist">from ${activity.website}</div>
                </div>
                <div style="color: #666; font-size: 0.9rem;">${
                  activity.time
                }</div>
            </div>
        `
      )
      .join("");
  }

  // Toggle auto-refresh
  toggleAutoRefresh() {
    const button = document.getElementById("autoRefreshText");

    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
      button.textContent = "Enable Auto-refresh";
      console.log("⏸️ Auto-refresh disabled");
    } else {
      this.autoRefreshInterval = setInterval(() => {
        this.loadAnalytics();
      }, this.refreshRate);
      button.textContent = "Disable Auto-refresh";
      console.log("▶️ Auto-refresh enabled (30s intervals)");
    }
  }

  // Export data as CSV
  async exportData() {
    try {
      const response = await fetch(`${this.apiEndpoint}/analytics/dashboard`);
      const data = await response.json();

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add summary stats
      csvContent += "Metric,Value\n";
      csvContent += `Total Users,${data.totalUsers || 0}\n`;
      csvContent += `Total Conversions,${data.totalConversions || 0}\n`;
      csvContent += `Daily Conversions,${data.dailyConversions || 0}\n`;
      csvContent += `Success Rate,${data.successRate || 0}%\n\n`;

      // Add top songs
      csvContent += "Top Songs\n";
      csvContent += "Title,Artist,Conversions\n";
      (data.topSongs || []).forEach((song) => {
        csvContent += `"${song.title}","${song.artist}",${song.conversions}\n`;
      });

      csvContent += "\nTop Websites\n";
      csvContent += "Hostname,Category,Conversions\n";
      (data.topWebsites || []).forEach((site) => {
        csvContent += `"${site.hostname}","${site.category}",${site.conversions}\n`;
      });

      // Create and download file
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `tuneswap-analytics-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("📄 Analytics data exported");
    } catch (error) {
      console.error("❌ Export failed:", error);
      alert("Export failed: " + error.message);
    }
  }

  // Helper functions
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Global dashboard instance
let dashboard;

// Initialize dashboard when page loads
document.addEventListener("DOMContentLoaded", function () {
  dashboard = new TuneSwapDashboard();

  // Load initial data
  dashboard.loadAnalytics();

  // Set up auto-refresh every 5 minutes by default
  setTimeout(() => {
    if (dashboard && !dashboard.autoRefreshInterval) {
      dashboard.toggleAutoRefresh();
    }
  }, 2000);
});

// Global functions for buttons
function loadAnalytics() {
  if (dashboard) {
    dashboard.loadAnalytics();
  }
}

function exportData() {
  if (dashboard) {
    dashboard.exportData();
  }
}

function toggleAutoRefresh() {
  if (dashboard) {
    dashboard.toggleAutoRefresh();
  }
}

// Handle window focus to refresh data
window.addEventListener("focus", function () {
  if (dashboard) {
    dashboard.loadAnalytics();
  }
});

// Handle online/offline events
window.addEventListener("online", function () {
  console.log("🌐 Connection restored");
  if (dashboard) {
    dashboard.loadAnalytics();
  }
});

window.addEventListener("offline", function () {
  console.log("📶 Connection lost");
  if (dashboard) {
    dashboard.updateServerStatus(false);
  }
});
