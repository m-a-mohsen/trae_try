// Dashboard JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize language switcher
  initLanguageSwitcher();
  
  // Initialize the attendance chart
  initAttendanceChart();
  
  // Initialize event listeners
  initEventListeners();
  
  // Update greeting based on time of day
  updateGreeting();
  
  // Initialize theme switching functionality
  initThemeSwitch();
  
  // Apply initial translations
  applyTranslations();
});

// Get current language or set default to English
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

// Get translation for the current language
function getTranslation(key) {
  const lang = getCurrentLanguage();
  const keys = key.split('.');
  let translation = translations[lang];
  
  for (const k of keys) {
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      // Fallback to English if translation not found
      let fallback = translations['en'];
      for (const k of keys) {
        if (fallback && fallback[k] !== undefined) {
          fallback = fallback[k];
        } else {
          return key; // Return the key if no translation found
        }
      }
      return fallback;
    }
  }
  
  return translation;
}

// Initialize language switcher
function initLanguageSwitcher() {
  // Create language switcher dropdown if it doesn't exist
  if (!document.querySelector('.language-switch')) {
    const headerIcons = document.querySelector('.header-icons');
    const tryAiElement = document.querySelector('.try-ai');
    
    const languageSwitch = document.createElement('div');
    languageSwitch.className = 'language-switch';
    languageSwitch.innerHTML = `
      <i class="fas fa-globe"></i>
      <select id="language-select">
        <option value="en">${getTranslation('languages.english')}</option>
        <option value="ar">${getTranslation('languages.arabic')}</option>
      </select>
    `;
    
    headerIcons.insertBefore(languageSwitch, tryAiElement);
    
    // Set the current language in the dropdown
    const languageSelect = document.getElementById('language-select');
    languageSelect.value = getCurrentLanguage();
    
    // Add event listener for language change
    languageSelect.addEventListener('change', function() {
      const newLang = this.value;
      localStorage.setItem('language', newLang);
      
      // Update HTML direction for RTL support
      document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', newLang);
      
      // Apply translations
      applyTranslations();
      
      // Reinitialize chart with translated labels
      initAttendanceChart();
    });
    
    // Set initial direction
    const currentLang = getCurrentLanguage();
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
  }
}

// Apply translations to all elements
function applyTranslations() {
  // App name and description
  document.querySelector('.logo-text h3').textContent = getTranslation('appName');
  document.querySelector('.logo-text p').textContent = getTranslation('appDescription');
  
  // Navigation menu
  const navItems = document.querySelectorAll('.nav-menu li a');
  const navKeys = ['dashboard', 'employees', 'leave', 'member', 'timeTracking', 'recruitments', 'payroll', 'invoices', 'setting', 'company'];
  navItems.forEach((item, index) => {
    if (index < navKeys.length) {
      // Keep the icon and update only the text
      const icon = item.querySelector('i').outerHTML;
      item.innerHTML = icon + ' ' + getTranslation(`nav.${navKeys[index]}`);
    }
  });
  
  // Sidebar footer
  document.querySelector('.help-center').innerHTML = `<i class="fas fa-question-circle"></i> ${getTranslation('helpCenter')}`;
  document.querySelector('.settings').innerHTML = `<i class="fas fa-cog"></i> ${getTranslation('settings')}`;
  document.querySelector('.company-info').innerHTML = `<i class="fas fa-building"></i> ${getTranslation('companyName')}`;
  
  // Header
  updateGreeting(); // This will use the translated greeting
  document.querySelector('.search-bar input').placeholder = getTranslation('searching');
  document.querySelector('.try-ai').innerHTML = `<i class="fas fa-robot"></i> ${getTranslation('tryAI')}`;
  
  // Schedule section
  document.querySelector('.schedule-section .card-header h3').textContent = getTranslation('schedule.title');
  document.querySelector('.schedule-section .btn-primary').innerHTML = `<i class="fas fa-plus"></i> ${getTranslation('schedule.addSchedule')}`;
  
  // Weekdays
  const weekdays = document.querySelectorAll('.weekdays div');
  weekdays.forEach((day, index) => {
    day.textContent = getTranslation('schedule.weekdays')[index];
  });
  
  // Update month name in calendar
  const currentMonthText = document.querySelector('.month-nav h4').textContent;
  const monthIndex = new Date().getMonth();
  const year = new Date().getFullYear();
  document.querySelector('.month-nav h4').textContent = `${getTranslation('schedule.months')[monthIndex]} ${year}`;
  
  // Meeting filter options
  const meetingFilterOptions = document.querySelectorAll('.meeting-filter select option');
  const sortOptions = ['sortMostRecent', 'sortByDate', 'sortByPriority'];
  meetingFilterOptions.forEach((option, index) => {
    if (index < sortOptions.length) {
      option.textContent = getTranslation(`schedule.${sortOptions[index]}`);
    }
  });
  
  // Attendance section
  document.querySelector('.attendance-section .card-header h3').textContent = getTranslation('attendance.title');
  
  // Date filter options
  const dateFilterOptions = document.querySelectorAll('.date-filter select option');
  dateFilterOptions[0].textContent = getTranslation('attendance.dateRange');
  dateFilterOptions[1].textContent = getTranslation('attendance.dateRangeAlt');
  
  // Attendance legend
  const legendItems = document.querySelectorAll('.attendance-legend .legend-item');
  legendItems[0].innerHTML = `<span class="dot on-time"></span> ${getTranslation('attendance.onTime')}`;
  legendItems[1].innerHTML = `<span class="dot late"></span> ${getTranslation('attendance.late')}`;
  legendItems[2].innerHTML = `<span class="dot day-off"></span> ${getTranslation('attendance.dayOff')}`;
  
  // Employment status section
  document.querySelector('.employment-status-section .card-header h3').textContent = getTranslation('employment.title');
  
  // Status cards
  const statusCards = document.querySelectorAll('.status-card h4');
  const statusTypes = ['permanent', 'contract', 'probation'];
  statusCards.forEach((card, index) => {
    if (index < statusTypes.length) {
      card.textContent = getTranslation(`employment.${statusTypes[index]}`);
    }
  });
  
  // Stats section
  const statInfos = document.querySelectorAll('.stat-info p');
  const statTypes = ['totalEmployees', 'activeEmployees', 'resignEmployees'];
  statInfos.forEach((info, index) => {
    if (index < statTypes.length) {
      info.textContent = getTranslation(`stats.${statTypes[index]}`);
    }
  });
  
  // Employee section
  document.querySelector('.employee-section .card-header h3').textContent = getTranslation('employee.title');
  document.querySelector('.employee-section .search-bar input').placeholder = getTranslation('searching');
  document.querySelector('.employee-section .btn-outline').innerHTML = `<i class="fas fa-filter"></i> ${getTranslation('employee.filter')}`;
  
  // Table headers
  const tableHeaders = document.querySelectorAll('.employee-table thead th');
  const headerKeys = ['name', 'jobTitle', 'email', 'status'];
  tableHeaders.forEach((header, index) => {
    if (index < headerKeys.length) {
      header.textContent = getTranslation(`employee.tableHeaders.${headerKeys[index]}`);
    }
  });
  
  // Status badges
  const statusBadges = document.querySelectorAll('.status-badge');
  statusBadges.forEach(badge => {
    if (badge.classList.contains('onboarding')) {
      badge.textContent = getTranslation('employee.status.onboarding');
    } else if (badge.classList.contains('active')) {
      badge.textContent = getTranslation('employee.status.active');
    }
  });
}

// Initialize the attendance chart using Chart.js
function initAttendanceChart() {
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  
  // Chart data
  const months = getTranslation('attendance.months');
  const onTimeData = [85, 90, 75, 70, 85, 65, 60];
  const lateData = [10, 15, 20, 15, 10, 20, 15];
  const dayOffData = [5, 5, 10, 15, 5, 15, 25];
  
  // Create the chart
  const attendanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: getTranslation('attendance.onTime'),
          data: onTimeData,
          backgroundColor: '#4caf50',
          borderColor: '#4caf50',
          borderWidth: 1
        },
        {
          label: getTranslation('attendance.late'),
          data: lateData,
          backgroundColor: '#ff9800',
          borderColor: '#ff9800',
          borderWidth: 1
        },
        {
          label: getTranslation('attendance.dayOff'),
          data: dayOffData,
          backgroundColor: '#999',
          borderColor: '#999',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.raw + '%';
            }
          }
        }
      }
    }
  });
}

// Initialize theme switching functionality
function initThemeSwitch() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const themeIcons = document.querySelectorAll('.theme-icon');
  
  // Function to set theme with animation
  const setTheme = (isDark) => {
    // Add transition class for smooth animation
    document.body.classList.add('theme-transition');
    
    // Set the theme
    if (isDark) {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.checked = true;
    } else {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.checked = false;
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  };
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    // Use system preference as default if available
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setTheme(true);
    }
  }
  
  // Handle theme toggle
  themeToggle.addEventListener('change', () => {
    setTheme(themeToggle.checked);
  });
  
  // Make theme icons clickable too
  themeIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
      setTheme(index === 1); // index 1 is moon icon (dark mode)
    });
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === null) {
      // Only auto-switch if user hasn't manually set a preference
      setTheme(e.matches);
    }
  });
}

// Initialize event listeners for interactive elements
function initEventListeners() {
  // Calendar navigation
  const prevMonthBtn = document.querySelector('.prev-month');
  const nextMonthBtn = document.querySelector('.next-month');
  
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      // Navigate to previous month (would be implemented with a calendar library in a real app)
      console.log('Navigate to previous month');
    });
  }
  
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      // Navigate to next month (would be implemented with a calendar library in a real app)
      console.log('Navigate to next month');
    });
  }
  
  // Calendar day selection
  const days = document.querySelectorAll('.day');
  days.forEach(day => {
    day.addEventListener('click', function() {
      // Remove current-day class from all days
      days.forEach(d => d.classList.remove('current-day'));
      // Add current-day class to clicked day
      this.classList.add('current-day');
      
      // Update current date display (simplified version)
      const dayNum = this.textContent.trim();
      const monthName = document.querySelector('.month-nav h4').textContent.split(' ')[0];
      document.querySelector('.current-date h5').textContent = `Selected: ${monthName} ${dayNum}, 2023`;
    });
  });
  
  // Meeting filter
  const meetingFilter = document.querySelector('.meeting-filter select');
  if (meetingFilter) {
    meetingFilter.addEventListener('change', function() {
      console.log('Filter meetings by:', this.value);
      // Would implement actual filtering in a real app
    });
  }
  
  // Date range filter for attendance chart
  const dateFilter = document.querySelector('.date-filter select');
  if (dateFilter) {
    dateFilter.addEventListener('change', function() {
      console.log('Change date range to:', this.value);
      // Would update chart data based on selection in a real app
    });
  }
  
  // Employee search
  const employeeSearch = document.querySelector('.employee-actions .search-bar input');
  if (employeeSearch) {
    employeeSearch.addEventListener('input', function() {
      console.log('Search employees for:', this.value);
      // Would implement actual search in a real app
    });
  }
  
  // Add schedule button
  const addScheduleBtn = document.querySelector('.schedule-section .btn-primary');
  if (addScheduleBtn) {
    addScheduleBtn.addEventListener('click', function() {
      console.log('Add new schedule item');
      // Would open a modal or form in a real app
    });
  }
}

// Update greeting based on time of day
function updateGreeting() {
  const hour = new Date().getHours();
  const greetingEl = document.querySelector('.greeting h2');
  const userName = document.querySelector('.user-name').textContent;
  
  let greeting = getTranslation('greeting.morning');
  if (hour >= 12 && hour < 17) {
    greeting = getTranslation('greeting.afternoon');
  } else if (hour >= 17) {
    greeting = getTranslation('greeting.evening');
  }
  
  if (greetingEl) {
    greetingEl.innerHTML = `${greeting}, <span class="user-name">${userName}</span> <i class="fas fa-smile text-warning"></i>`;
  }
}

// Simulate data for a real application
function simulateRealTimeData() {
  // This function would be used in a real application to update data periodically
  // For example, updating employee counts, attendance stats, etc.
  
  // Example: Update employee stats with random changes
  setInterval(() => {
    const totalEmployees = document.querySelector('.stats-cards .stat-card:nth-child(1) .stat-info h3');
    const activeEmployees = document.querySelector('.stats-cards .stat-card:nth-child(2) .stat-info h3');
    
    if (totalEmployees && activeEmployees) {
      // Extract current numbers
      let total = parseInt(totalEmployees.textContent.split(' ')[0].replace(',', ''));
      let active = parseInt(activeEmployees.textContent.split(' ')[0].replace(',', ''));
      
      // Simulate small changes
      const totalChange = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const activeChange = Math.floor(Math.random() * 5) - 1; // -1 to +3
      
      total += totalChange;
      active += activeChange;
      
      // Update the display
      totalEmployees.innerHTML = `${total.toLocaleString()} <span class="change ${totalChange >= 0 ? 'positive' : 'negative'}">${totalChange >= 0 ? '+' : ''}${totalChange}</span>`;
      activeEmployees.innerHTML = `${active.toLocaleString()} <span class="change ${activeChange >= 0 ? 'positive' : 'negative'}">${activeChange >= 0 ? '+' : ''}${activeChange}</span>`;
    }
  }, 30000); // Update every 30 seconds
}

// In a real application, we might implement these additional features:
// 1. Calendar integration with a library like FullCalendar
// 2. Data fetching from an API
// 3. Real-time updates with WebSockets
// 4. User authentication and personalization
// 5. Form validation for adding new data
// 6. Notifications system
// 7. Mobile responsiveness enhancements