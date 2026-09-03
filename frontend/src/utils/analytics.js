// Unique Anonymous Visitor ID & Client Device Detection

export const getOrCreateVisitorId = () => {
  if (typeof window === 'undefined') return 'server_guest';
  try {
    let visitorId = localStorage.getItem('l2b_visitor_id');
    if (!visitorId || visitorId.length < 8) {
      const randomPart = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
      visitorId = `v_${Date.now().toString(36)}_${randomPart}`;
      localStorage.setItem('l2b_visitor_id', visitorId);
    }
    return visitorId;
  } catch (e) {
    return `v_${Math.random().toString(36).substring(2, 10)}`;
  }
};

export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return { device: 'desktop', browser: 'Unknown', os: 'Unknown' };
  }

  const ua = navigator.userAgent || '';
  
  // 1. Device Type
  let device = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    device = 'mobile';
  }

  // 2. Browser Detection
  let browser = 'Browser';
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Opera/') || ua.includes('OPR/')) browser = 'Opera';

  // 3. Operating System Detection
  let os = 'OS';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { device, browser, os };
};
