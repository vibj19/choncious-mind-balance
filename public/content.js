
// Content script for health websites
class ChonciousContent {
  constructor() {
    this.pageStartTime = Date.now();
    this.init();
  }

  init() {
    this.createFloatingTimer();
    this.trackPageTime();
    this.setupPageLeaveDetection();
  }

  createFloatingTimer() {
    // Create floating timer widget
    const timer = document.createElement('div');
    timer.id = 'choncious-timer';
    timer.innerHTML = `
      <div class="choncious-timer-content">
        <div class="timer-icon">🕒</div>
        <div class="timer-text">
          <div class="timer-label">Time on health sites</div>
          <div class="timer-value">0:00</div>
        </div>
        <button class="timer-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
      </div>
    `;
    
    document.body.appendChild(timer);
    this.updateTimer();
    
    // Update timer every second
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  async updateTimer() {
    const result = await chrome.storage.local.get(['currentSession']);
    const session = result.currentSession;
    
    if (session && session.active) {
      const totalTime = session.totalTime + (Date.now() - session.lastActivity);
      const minutes = Math.floor(totalTime / (1000 * 60));
      const seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
      
      const timerElement = document.querySelector('#choncious-timer .timer-value');
      if (timerElement) {
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  }

  trackPageTime() {
    // Send page visit data to background script
    chrome.runtime.sendMessage({
      type: 'PAGE_VISIT',
      url: window.location.href,
      timestamp: this.pageStartTime
    });
  }

  setupPageLeaveDetection() {
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - this.pageStartTime;
      chrome.runtime.sendMessage({
        type: 'PAGE_LEAVE',
        url: window.location.href,
        timeSpent: timeOnPage
      });
    });
  }
}

// Initialize content script
new ChonciousContent();
