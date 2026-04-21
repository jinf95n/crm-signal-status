export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}hs`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days} días`;
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase() + ' · ' + d.toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit'
  });
}

export function isThisMonth(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function getLast14Days(): Date[] {
  const days: Date[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}