'use strict';

// Admin sahifasi server orqali ham, Live Server/file orqali ham ishlashi uchun API manzili.
const ADMIN_API_BASE = (() => {
  const isFile = window.location.protocol === 'file:';
  const isLocalAltPort = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    && window.location.port
    && window.location.port !== '3000';
  return isFile || isLocalAltPort ? 'http://127.0.0.1:3000' : '';
})();

function apiUrl(path) {
  return `${ADMIN_API_BASE}${path}`;
}

function friendlyNetworkError(error) {
  if (error?.name === 'AbortError') {
    return new Error('Server javob bermadi. STOP.bat ni, keyin START.bat ni bosing.');
  }
  if (error instanceof TypeError || /fetch|network|failed/i.test(String(error?.message || ''))) {
    return new Error('Backend serverga ulanib bo‘lmadi. Saytni START.bat orqali ishga tushiring.');
  }
  return error instanceof Error ? error : new Error('Noma’lum xatolik yuz berdi.');
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const loginPanel = document.getElementById('loginPanel');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('loginForm');
  const adminUsernameInput = document.getElementById('adminUsername');
  const adminPasswordInput = document.getElementById('adminPassword');
  const loginMessage = document.getElementById('loginMessage');

  const passwordInput = document.getElementById('adminPassword');
  const passwordToggle = document.getElementById('passwordToggle');

  if (passwordInput && passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const shouldShow = passwordInput.type === 'password';
      passwordInput.type = shouldShow ? 'text' : 'password';
      passwordToggle.textContent = shouldShow ? 'Yashirish' : 'Ko‘rish';
      passwordToggle.setAttribute('aria-pressed', String(shouldShow));
      passwordToggle.setAttribute('aria-label', shouldShow ? 'Parolni yashirish' : 'Parolni ko‘rish');
      passwordInput.focus({ preventScroll: true });
    });
  }
  const dashboardMessage = document.getElementById('dashboardMessage');
  const ordersList = document.getElementById('ordersList');
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const notificationBtn = document.getElementById('notificationBtn');
  const summary = document.getElementById('summary');
  const toastStack = document.getElementById('toastStack');
  const liveStatus = document.getElementById('liveStatus');
  const adminSessionActions = document.getElementById('adminSessionActions');

  let adminToken = sessionStorage.getItem('tanirovkaAdminToken') || '';
  let orders = [];
  let knownCodes = new Set();
  let pollingTimer = null;
  let firstLoadDone = false;
  let audioContext = null;

  const serviceNames = {
    tint: 'Tanirovka', sun: 'Llumar AIR 80', lam: 'Salon laminatsiyasi',
    ppf: 'Bron plyonka', clean: 'Kimyoviy tozalash'
  };

  async function request(url, options = {}) {
    try {
      const response = await fetchWithTimeout(apiUrl(url), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
          ...(options.headers || {})
        }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Server xatoligi.');
      return data;
    } catch (error) {
      throw friendlyNetworkError(error);
    }
  }

  function setMessage(element, text, type = '') {
    element.textContent = text;
    element.className = `admin-message${type ? ` is-${type}` : ''}`;
  }

  function formatDate(value) {
    if (!value) return '—';
    try { return new Intl.DateTimeFormat('uz-UZ', { dateStyle:'medium', timeStyle:'short' }).format(new Date(value)); }
    catch (error) { return value; }
  }

  function renderSummary() {
    summary.innerHTML = '';
    const badge = document.createElement('span');
    badge.textContent = `Jami buyurtmalar: ${orders.length}`;
    summary.appendChild(badge);
  }

  function createText(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text || '—';
    return element;
  }

  function renderOrders() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = orders.filter((order) => {
      const searchable = `${order.code} ${order.name} ${order.phoneDisplay || order.phone} ${order.brand} ${order.model} ${order.comment || ''}`.toLowerCase();
      return !query || searchable.includes(query);
    });

    ordersList.innerHTML = '';
    if (!filtered.length) {
      ordersList.appendChild(createText('div', 'empty-state', 'Mos buyurtma yoki xabar topilmadi.'));
      return;
    }

    filtered.forEach((order) => {
      const card = document.createElement('article');
      card.className = 'order-card';

      const codeBox = document.createElement('div');
      codeBox.appendChild(createText('div', 'order-card__code', order.code));
      codeBox.appendChild(createText('span', 'order-card__date', formatDate(order.createdAt)));

      const customer = document.createElement('div');
      customer.appendChild(createText('h3', '', order.name));
      customer.appendChild(createText('p', '', order.phoneDisplay || order.phone));
      customer.appendChild(createText('p', '', `${order.brand || ''} ${order.model || ''}`.trim()));

      const details = document.createElement('div');
      details.className = 'order-card__details';
      details.appendChild(createText('span', '', serviceNames[order.service] || order.service));
      if (order.tintType) details.appendChild(createText('span', '', `Turi: ${order.tintType}`));
      if (order.serviceOption) details.appendChild(createText('span', '', `Variant: ${order.serviceOption}`));
      if (order.ppfParts?.length) details.appendChild(createText('span', '', `Qismlar: ${order.ppfParts.join(', ')}`));
      if (order.comment) details.appendChild(createText('span', '', `Xabar: ${order.comment}`));
      card.append(codeBox, customer, details);
      ordersList.appendChild(card);
    });
  }

  const alertAudio = new Audio('/assets/sounds/pro-sms-chime-v5.wav?v=5');
  alertAudio.preload = 'auto';
  alertAudio.volume = 1.0;

  async function playBeep() {
    // Vibration works on supported Android browsers.
    if ('vibrate' in navigator) {
      navigator.vibrate([220, 80, 220]);
    }
    try {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      alertAudio.volume = 1.0;
      await alertAudio.play();
    } catch (error) {
      // Fallback when the browser blocks media before a user click.
      try {
        audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') await audioContext.resume();
        const master = audioContext.createGain();
        master.gain.value = 0.88;
        master.connect(audioContext.destination);
        const now = audioContext.currentTime;
        [987.77, 1318.51].forEach((frequency, index) => {
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          const begin = now + index * 0.145;
          const finish = begin + 0.38;
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.0001, begin);
          gain.gain.exponentialRampToValueAtTime(0.28, begin + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, finish);
          oscillator.connect(gain);
          gain.connect(master);
          oscillator.start(begin);
          oscillator.stop(finish + 0.02);
        });
      } catch (fallbackError) {
        console.warn('Ovoz chiqarilmadi:', fallbackError);
      }
    }
  }

  function removeToast(toast) {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 260);
  }

  function showToast(order) {
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    const top = document.createElement('div');
    top.className = 'admin-toast__top';
    const title = document.createElement('strong');
    title.textContent = 'Yangi buyurtma';
    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', 'Yopish');
    close.textContent = '×';
    close.addEventListener('click', () => removeToast(toast));
    top.append(title, close);
    const customer = document.createElement('p');
    customer.textContent = `${order.name} · ${order.phoneDisplay || order.phone}`;
    const service = document.createElement('p');
    service.textContent = serviceNames[order.service] || order.service || 'Yangi murojaat';
    const message = document.createElement('small');
    message.textContent = order.comment ? `Xabar: ${order.comment}` : `${order.brand || ''} ${order.model || ''}`.trim();
    toast.append(top, customer, service, message);
    toastStack.prepend(toast);
    setTimeout(() => { if (toast.isConnected) removeToast(toast); }, 12000);
  }

  function showSystemNotification(order) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const notification = new Notification('Yangi buyurtma', {
      body: `${order.name} · ${serviceNames[order.service] || order.service}${order.comment ? `\n${order.comment}` : ''}`,
      icon: '/assets/images/notification-car.png',
      badge: '/assets/images/notification-car.png',
      silent: true,
      tag: order.code
    });
    notification.onclick = () => { window.focus(); notification.close(); };
  }

  function notifyNewOrders(newOrders) {
    if (!newOrders.length) return;
    playBeep();
    newOrders.slice().reverse().forEach((order) => {
      showToast(order);
      showSystemNotification(order);
    });
    document.title = `(${newOrders.length}) Yangi xabar — TANIROVKA Admin`;
    setTimeout(() => { document.title = 'TANIROVKA — Admin'; }, 8000);
  }

  async function enableNotifications() {
    if (!('Notification' in window)) {
      notificationBtn.textContent = 'Brauzer qo‘llamaydi';
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      const enabled = permission === 'granted';
      notificationBtn.classList.toggle('is-on', enabled);
      notificationBtn.textContent = enabled ? 'Bildirishnoma yoqilgan' : 'Bildirishnomani yoqish';
      if (enabled) playBeep();
    } catch (error) {
      console.warn(error);
    }
  }

  function syncNotificationButton() {
    if (!('Notification' in window)) return;
    const enabled = Notification.permission === 'granted';
    notificationBtn.classList.toggle('is-on', enabled);
    notificationBtn.textContent = enabled ? 'Bildirishnoma yoqilgan' : 'Bildirishnomani yoqish';
  }

  async function loadOrders({ silent = false, notify = false } = {}) {
    if (!silent) setMessage(dashboardMessage, 'Buyurtmalar yuklanmoqda...');
    try {
      const result = await request('/api/admin/orders');
      const nextOrders = result.orders || [];
      const newOrders = firstLoadDone && notify
        ? nextOrders.filter((order) => !knownCodes.has(order.code))
        : [];
      orders = nextOrders;
      knownCodes = new Set(nextOrders.map((order) => order.code));
      firstLoadDone = true;
      loginPanel.hidden = true;
      dashboard.hidden = false;
      adminSessionActions.hidden = false;
      liveStatus.textContent = `Jonli kuzatuv ishlayapti · har 3 soniyada tekshiriladi · ${new Date().toLocaleTimeString('uz-UZ', {hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
      if (!silent) setMessage(dashboardMessage, '');
      renderSummary();
      renderOrders();
      notifyNewOrders(newOrders);
    } catch (error) {
      if (!silent || /login|parol|ruxsat|token/i.test(error.message)) {
        stopPolling();
        sessionStorage.removeItem('tanirovkaAdminToken');
        adminToken = '';
        loginPanel.hidden = false;
        dashboard.hidden = true;
        adminSessionActions.hidden = true;
        setMessage(loginMessage, error.message, 'error');
      } else {
        liveStatus.textContent = `Server bilan aloqa uzildi. Qayta ulanmoqda…`;
      }
    }
  }

  function startPolling() {
    stopPolling();
    pollingTimer = setInterval(() => {
      if (adminToken && !document.hidden) loadOrders({ silent: true, notify: true });
    }, 3000);
  }

  function stopPolling() {
    if (pollingTimer) clearInterval(pollingTimer);
    pollingTimer = null;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = adminUsernameInput.value.trim();
    const password = adminPasswordInput.value;
    const submitButton = loginForm.querySelector('button[type="submit"]');
    if (!username || !password) {
      setMessage(loginMessage, 'Login va parolni kiriting.', 'error');
      return;
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Tekshirilmoqda...';
    }
    setMessage(loginMessage, 'Tekshirilmoqda...');
    try {
      const response = await fetchWithTimeout(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }, 10000);
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.token) throw new Error(result.message || 'Login yoki parol noto‘g‘ri.');
      adminToken = result.token;
      sessionStorage.setItem('tanirovkaAdminToken', adminToken);
      adminPasswordInput.value = '';
      knownCodes = new Set();
      firstLoadDone = false;
      await loadOrders();
      if (adminToken) { startPolling(); syncNotificationButton(); }
      setMessage(loginMessage, '');
    } catch (error) {
      adminToken = '';
      sessionStorage.removeItem('tanirovkaAdminToken');
      const friendly = friendlyNetworkError(error);
      setMessage(loginMessage, friendly.message, 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Kirish';
      }
    }
  });

  notificationBtn.addEventListener('click', enableNotifications);
  refreshBtn.addEventListener('click', () => { if (adminToken) loadOrders({ notify: true }); });
  logoutBtn.addEventListener('click', () => {
    stopPolling();
    adminToken = '';
    orders = [];
    knownCodes = new Set();
    firstLoadDone = false;
    sessionStorage.removeItem('tanirovkaAdminToken');
    dashboard.hidden = true;
    adminSessionActions.hidden = true;
    loginPanel.hidden = false;
    adminUsernameInput.value = '';
    adminPasswordInput.value = '';
    setMessage(loginMessage, '');
  });
  searchInput.addEventListener('input', renderOrders);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && adminToken) loadOrders({ silent: true, notify: true });
  });

  syncNotificationButton();
  if (adminToken) loadOrders().then(() => { if (adminToken) startPolling(); });
});
