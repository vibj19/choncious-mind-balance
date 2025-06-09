
// Background script for tracking and managing extension state
class ChonciousTracker {
  constructor() {
    this.currentSession = null;
    this.setupListeners();
    this.loadSettings();
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get({
      timeThreshold: 15, // minutes before first nudge
      pageThreshold: 10, // pages before nudge
      blacklistedSites: [],
      nudgeFrequency: 10, // minutes between nudges
      enableNotifications: true,
      customSites: []
    });
    this.settings = result;
  }

  setupListeners() {
    // Tab activation listener
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      this.handleTabChange(tab);
    });

    // Tab update listener
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabChange(tab);
      }
    });

    // Window focus change
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        this.pauseSession();
      }
    });
  }

  isHealthSite(url) {
    const healthDomains = [
      'webmd.com', 'mayoclinic.org', 'healthline.com', 
      'medicalnewstoday.com', 'verywellhealth.com', 
      'emedicinehealth.com', 'drugs.com', 'symptomchecker.com',
      ...this.settings.customSites
    ];
    
    return healthDomains.some(domain => url.includes(domain));
  }

  async handleTabChange(tab) {
    if (!tab.url) return;

    const isHealth = this.isHealthSite(tab.url);
    
    if (isHealth) {
      this.startOrContinueSession(tab.url);
    } else {
      this.pauseSession();
    }
  }

  async startOrContinueSession(url) {
    const now = Date.now();
    
    if (!this.currentSession || now - this.currentSession.lastActivity > 300000) { // 5 min gap = new session
      this.currentSession = {
        startTime: now,
        lastActivity: now,
        pagesVisited: 1,
        totalTime: 0,
        sites: [url],
        active: true
      };
    } else {
      this.currentSession.lastActivity = now;
      this.currentSession.pagesVisited++;
      if (!this.currentSession.sites.includes(url)) {
        this.currentSession.sites.push(url);
      }
    }

    await this.saveSession();
    this.checkForNudge();
  }

  pauseSession() {
    if (this.currentSession && this.currentSession.active) {
      const now = Date.now();
      this.currentSession.totalTime += now - this.currentSession.lastActivity;
      this.currentSession.active = false;
      this.saveSession();
    }
  }

  async saveSession() {
    if (this.currentSession) {
      await chrome.storage.local.set({
        currentSession: this.currentSession,
        lastSave: Date.now()
      });
    }
  }

  async checkForNudge() {
    if (!this.settings.enableNotifications || !this.currentSession) return;

    const sessionMinutes = (this.currentSession.totalTime + 
      (Date.now() - this.currentSession.lastActivity)) / (1000 * 60);

    const shouldNudge = sessionMinutes >= this.settings.timeThreshold || 
                       this.currentSession.pagesVisited >= this.settings.pageThreshold;

    if (shouldNudge) {
      this.sendNudgeNotification();
    }
  }

  async sendNudgeNotification() {
    const messages = [
      "💙 Take a mindful pause - you've been browsing health sites for a while",
      "🌱 Remember to breathe - consider taking a break from health research",
      "✨ Your wellbeing matters - maybe it's time to step away for a moment",
      "🤗 Be gentle with yourself - taking breaks can reduce anxiety"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'Choncious - Gentle Reminder',
      message: randomMessage,
      priority: 1
    });
  }
}

// Initialize the tracker
const tracker = new ChonciousTracker();

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
});
