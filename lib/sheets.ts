export type TimelineRow = {
  fecha: string;
  titulo: string;
  estado: 'done' | 'active' | 'pending';
  nota: string;
};

export type EventRow = {
  timestamp: string;
  event_name: string;
  stage_label: string;
  deal_id: string;
  emq: string;
  result: string;
};

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue; }
      if (char === ',' && !inQuotes) { vals.push(current.trim()); current = ''; continue; }
      current += char;
    }
    vals.push(current.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    return obj;
  });
}

export async function fetchTimeline(sheetBase: string, gid: string): Promise<TimelineRow[]> {
  const url = `${sheetBase}?gid=${gid}&single=true&output=csv&t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();
  return parseCSV(text) as unknown as TimelineRow[];
}

export async function fetchEvents(sheetBase: string, gid: string): Promise<EventRow[]> {
  const url = `${sheetBase}?gid=${gid}&single=true&output=csv&t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();
  return parseCSV(text) as unknown as EventRow[];
}