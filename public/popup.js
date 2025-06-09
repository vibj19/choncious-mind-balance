
// Popup functionality for Choncious
class ChonciousPopup {
  constructor() {
    this.loadData();
    this.setupEventListeners();
    this.updateMindfulMessage();
  }

  async loadData() {
    // Load current session data
    const sessionData = await chrome.storage.local.get(['currentSession']);
    const settings = await chrome.storage.sync.get({
      timeThreshold: 15,
      pageThreshold: 10,
      blacklistedSites: [],
      enableNotifications: true
    });

    this.session = sessionData.currentSession || {
      totalTime: 0,
      pagesVisited: 0,
      startTime: Date.now(),
      active: false
    };

    this.settings = settings;
    this.updateDisplay();
    this.populateSettings();
  }

  updateDisplay() {
    // Update session time
    const totalMinutes = Math.floor(this.session.totalTime / (1000 * 60));
    const seconds = Math.floor((this.session.totalTime % (1000 * 60)) / 1000);
    document.getElementById('session-time').textContent = 
      `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;

    // Update pages visited
    document.getElementById('pages-visited').textContent = this.session.pagesVisited;
  }

  updateMindfulMessage() {
    const messages = [
      "Remember to breathe and be gentle with yourself",
      "Your feelings are valid, and seeking help is brave",
      "Take a moment to notice how you're feeling right now",
      "Health anxiety is common - you're not alone in this",
      "Consider whether this research is helping or increasing worry",
      "Trust your healthcare provider's guidance over online searches",
      "Your body knows how to heal - give it time and care"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('mindful-message').textContent = randomMessage;
  }

  setupEventListeners() {
    // Breathing exercise
    document.getElementById('breathing-exercise').addEventListener('click', () => {
      this.startBreathingExercise();
    });

    // Pause browsing
    document.getElementById('pause-browsing').addEventListener('click', () => {
      this.pauseBrowsing();
    });

    // Settings modal
    document.getElementById('open-settings').addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'block';
    });

    document.getElementById('close-settings').addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'none';
    });

    // Save settings
    document.getElementById('save-settings').addEventListener('click', () => {
      this.saveSettings();
    });

    // Add blocked site
    document.getElementById('add-site-btn').addEventListener('click', () => {
      this.addBlockedSite();
    });

    // Enter key for adding sites
    document.getElementById('new-site').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addBlockedSite();
      }
    });
  }

  startBreathingExercise() {
    // Create breathing exercise overlay
    const overlay = document.createElement('div');
    overlay.className = 'breathing-overlay';
    overlay.innerHTML = `
      <div class="breathing-content">
        <h3>Mindful Breathing</h3>
        <div class="breathing-circle"></div>
        <p class="breathing-text">Breathe in...</p>
        <button class="close-breathing">Close</button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .breathing-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(102, 126, 234, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        color: white;
        text-align: center;
      }
      .breathing-content h3 {
        margin-bottom: 30px;
        font-size: 24px;
      }
      .breathing-circle {
        width: 100px;
        height: 100px;
        border: 3px solid white;
        border-radius: 50%;
        margin: 20px auto;
        animation: breathe 8s infinite;
      }
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.2); }
        50% { transform: scale(1); }
        75% { transform: scale(1.2); }
      }
      .breathing-text {
        font-size: 18px;
        margin: 20px 0;
      }
      .close-breathing {
        background: white;
        color: #667eea;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 20px;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Breathing cycle
    let phase = 0;
    const phases = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'];
    const textElement = overlay.querySelector('.breathing-text');

    const breathingInterval = setInterval(() => {
      textElement.textContent = phases[phase];
      phase = (phase + 1) % phases.length;
    }, 2000);

    // Close breathing exercise
    overlay.querySelector('.close-breathing').addEventListener('click', () => {
      clearInterval(breathingInterval);
      document.body.removeChild(overlay);
      document.head.removeChild(style);
    });
  }

  async pauseBrowsing() {
    // Show confirmation
    const confirmed = confirm('This will close all health-related tabs. Continue?');
    if (confirmed) {
      const tabs = await chrome.tabs.query({});
      const healthDomains = [
        'webmd.com', 'mayoclinic.org', 'healthline.com', 
        'medicalnewstoday.com', 'verywellhealth.com'
      ];

      for (const tab of tabs) {
        if (healthDomains.some(domain => tab.url.includes(domain))) {
          chrome.tabs.remove(tab.id);
        }
      }

      // Show success message
      alert('Health browsing paused. Take some time for yourself! 💙');
    }
  }

  populateSettings() {
    document.getElementById('time-threshold').value = this.settings.timeThreshold;
    document.getElementById('page-threshold').value = this.settings.pageThreshold;
    document.getElementById('enable-notifications').checked = this.settings.enableNotifications;

    this.renderBlockedSites();
  }

  renderBlockedSites() {
    const container = document.getElementById('blocked-sites-list');
    container.innerHTML = '';

    this.settings.blacklistedSites.forEach((site, index) => {
      const item = document.createElement('div');
      item.className = 'blocked-site-item';
      item.innerHTML = `
        <span>${site}</span>
        <button class="remove-site" data-index="${index}">Remove</button>
      `;
      container.appendChild(item);
    });

    // Add remove listeners
    container.querySelectorAll('.remove-site').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.settings.blacklistedSites.splice(index, 1);
        this.renderBlockedSites();
      });
    });
  }

  addBlockedSite() {
    const input = document.getElementById('new-site');
    const site = input.value.trim();
    
    if (site && !this.settings.blacklistedSites.includes(site)) {
      this.settings.blacklistedSites.push(site);
      this.renderBlockedSites();
      input.value = '';
    }
  }

  async saveSettings() {
    const newSettings = {
      timeThreshold: parseInt(document.getElementById('time-threshold').value),
      pageThreshold: parseInt(document.getElementById('page-threshold').value),
      enableNotifications: document.getElementById('enable-notifications').checked,
      blacklistedSites: this.settings.blacklistedSites
    };

    await chrome.storage.sync.set(newSettings);
    this.settings = newSettings;
    
    // Close modal
    document.getElementById('settings-modal').style.display = 'none';
    
    // Show success
    alert('Settings saved successfully! 💙');
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChonciousPopup();
});
