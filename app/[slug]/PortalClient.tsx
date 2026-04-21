'use client';

import { ClientConfig } from '@/lib/clients';
import { TimelineRow, EventRow } from '@/lib/sheets';
import { timeAgo, formatDateTime, isThisMonth, isToday, getLast14Days } from '@/lib/utils';

type Props = {
  client: ClientConfig;
  timeline: TimelineRow[];
  events: EventRow[];
};

export default function PortalClient({ client, timeline, events }: Props) {
  const thisMonth = events.filter(e => isThisMonth(e.timestamp));
  const today = events.filter(e => isToday(e.timestamp));
  const lastEvent = events[events.length - 1];
  const hasActive = timeline.some(r => r.estado === 'active');

  // Conteo por tipo
  const counts: Record<string, number> = {};
  thisMonth.forEach(e => { counts[e.event_name] = (counts[e.event_name] || 0) + 1; });
  const maxCount = Math.max(...Object.values(counts), 1);
  const types = Object.keys(counts).length;

  // Gráfico 14 días
  const days = getLast14Days();
  const dayCounts = days.map(d => events.filter(e => new Date(e.timestamp).toDateString() === d.toDateString()).length);
  const maxDay = Math.max(...dayCounts, 1);

  // EMQ hint
  const emqHint = client.emq < 5
    ? 'Se puede mejorar agregando ciudad y país en los perfiles de HubSpot.'
    : client.emq < 7
    ? 'Buen puntaje. Se puede mejorar con más datos de ubicación en HubSpot.'
    : 'Excelente puntaje de coincidencia.';

  return (
    <div className="min-h-screen bg-[#080e14] text-[#e8f0f8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,180,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between py-7 mb-10 border-b border-[rgba(0,210,180,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #00d4b4 0%, #00a8e8 100%)' }}>V</div>
            <div>
              <div className="text-[15px] font-medium">Valy Agency · CRM Signal</div>
              <div className="text-xs text-[#6b8099]">Portal de seguimiento — {client.name}</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium ${
            hasActive
              ? 'bg-[rgba(34,211,122,0.1)] border-[rgba(34,211,122,0.25)] text-[#22d37a]'
              : 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.25)] text-red-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${hasActive ? 'bg-[#22d37a]' : 'bg-red-400'}`} />
            {hasActive ? 'Sistema activo' : 'En implementación'}
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            {
              icon: <path d="M2 12l4-4 3 3 5-6" stroke="#00d4b4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
              iconBg: 'rgba(0,212,180,0.1)',
              label: 'Eventos enviados',
              value: thisMonth.length.toString(),
              sub: 'este mes',
            },
            {
              icon: <><circle cx="8" cy="8" r="5" stroke="#a855f7" strokeWidth="1.5"/><path d="M8 5v3l2 2" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/></>,
              iconBg: 'rgba(168,85,247,0.1)',
              label: 'Último evento',
              value: lastEvent ? timeAgo(lastEvent.timestamp) : '—',
              sub: lastEvent?.event_name || '—',
              small: true,
            },
            {
              icon: <path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5l3.5-.5L8 2z" stroke="#f59e0b" strokeWidth="1.3" strokeLinejoin="round"/>,
              iconBg: 'rgba(245,158,11,0.1)',
              label: 'Match quality (EMQ)',
              value: `${client.emq}/10`,
              sub: 'calidad de matching',
              amber: true,
            },
          ].map((m, i) => (
            <div key={i} className="relative bg-[#0d1620] border border-[rgba(0,210,180,0.12)] rounded-2xl p-5 overflow-hidden hover:border-[rgba(0,210,180,0.28)] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,180,0.3), transparent)' }} />
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3.5" style={{ background: m.iconBg }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{m.icon}</svg>
              </div>
              <div className="text-[11px] text-[#6b8099] uppercase tracking-wider mb-1.5">{m.label}</div>
              <div className={`font-medium leading-none mb-1 ${m.small ? 'text-base mt-1' : 'text-3xl'} ${m.amber ? 'text-[#f59e0b]' : ''}`}
                style={{ fontFamily: "'DM Mono', monospace" }}>{m.value}</div>
              <div className="text-xs text-[#3a5068]">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* TIMELINE */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-[#00d4b4] mb-2">
            <div className="w-4 h-px bg-[#00d4b4]" />
            Proceso de implementación
          </div>
          <h2 className="text-lg font-medium mb-1">Estado de tu proyecto</h2>
          <p className="text-sm text-[#6b8099] mb-5 max-w-lg leading-relaxed">
            Cada etapa representa un hito del proceso de integración de tu CRM con Meta Ads. Una vez en producción, el sistema opera de forma completamente automática.
          </p>

          <div>
            {timeline.map((row, i) => {
              const isLast = i === timeline.length - 1;
              const estado = row.estado || 'pending';
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center w-8 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border ${
                      estado === 'done' ? 'bg-[rgba(0,212,180,0.15)] border-[rgba(0,212,180,0.3)]' :
                      estado === 'active' ? 'bg-[rgba(0,168,232,0.15)] border-[rgba(0,168,232,0.4)]' :
                      'bg-[#111d2a] border-[rgba(0,210,180,0.12)]'
                    }`}>
                      {estado === 'done' && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="#00d4b4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      {estado === 'active' && <div className="w-3 h-3 rounded-full bg-[#00a8e8]" />}
                      {estado === 'pending' && <div className="w-2.5 h-2.5 rounded-full border border-[#3a5068]" />}
                    </div>
                    {!isLast && (
                      <div className={`w-px flex-1 my-1.5 ${estado === 'done' ? 'bg-[rgba(0,212,180,0.3)]' : 'bg-[rgba(0,210,180,0.12)]'}`} />
                    )}
                  </div>
                  <div className="pb-7 flex-1 pt-1.5">
                    <div className={`text-sm font-medium mb-0.5 ${
                      estado === 'done' ? 'text-[#e8f0f8]' :
                      estado === 'active' ? 'text-[#00a8e8]' :
                      'text-[#3a5068]'
                    }`}>{row.titulo}</div>
                    <div className="text-[11px] text-[#3a5068] mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>{row.fecha}</div>
                    {row.nota && (
                      <div className={`text-xs text-[#6b8099] leading-relaxed bg-[#111d2a] rounded-lg px-3 py-2.5 border-l-2 ${
                        estado === 'active' ? 'border-[#00a8e8]' : 'border-[#00d4b4]'
                      }`}>{row.nota}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EVENTS */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-[#00d4b4] mb-2">
            <div className="w-4 h-px bg-[#00d4b4]" />
            Actividad del sistema
          </div>
          <h2 className="text-lg font-medium mb-1">Señales enviadas a Meta este mes</h2>
          <p className="text-sm text-[#6b8099] mb-5 max-w-lg leading-relaxed">
            Cada señal representa un momento clave en el recorrido de uno de tus leads. Meta usa estos datos para optimizar a quiénes les muestra tus anuncios, priorizando perfiles similares a los que realmente convierten.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              { label: 'Total de señales', value: thisMonth.length, color: '#00d4b4' },
              { label: 'Tipos de evento', value: types, color: '#a855f7' },
              { label: 'Hoy', value: today.length, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="bg-[#0d1620] border border-[rgba(0,210,180,0.12)] rounded-xl p-4">
                <div className="text-[11px] text-[#6b8099] mb-1">{s.label}</div>
                <div className="text-xl font-medium" style={{ fontFamily: "'DM Mono', monospace", color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* EMQ */}
          <div className="bg-[#0d1620] border border-[rgba(0,210,180,0.12)] rounded-xl p-4 mb-4">
            <div className="flex justify-between items-start mb-2.5">
              <div>
                <div className="text-sm font-medium mb-0.5">Calidad de coincidencia (Event Match Quality)</div>
                <div className="text-xs text-[#6b8099]">Qué tan bien Meta puede identificar a tus leads para optimizar los anuncios</div>
              </div>
              <div className="text-xl font-medium text-[#f59e0b] ml-4 flex-shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{client.emq} / 10</div>
            </div>
            <div className="h-1.5 bg-[#111d2a] rounded-full overflow-hidden mb-1.5">
              <div className="h-full rounded-full" style={{ width: `${(client.emq / 10) * 100}%`, background: 'linear-gradient(90deg, #00d4b4, #00a8e8)' }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#3a5068] mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
              {['0','2','4','6','8','10'].map(n => <span key={n}>{n}</span>)}
            </div>
            <div className="text-[11px] text-[#3a5068]">{emqHint}</div>
          </div>

          {/* Last event */}
          {lastEvent && (
            <div className="bg-[#0d1620] border border-[rgba(0,210,180,0.12)] rounded-xl p-4 flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[rgba(0,212,180,0.15)] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3v6l4 2" stroke="#00d4b4" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="9" cy="9" r="7" stroke="#00d4b4" strokeWidth="1.3"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium mb-0.5">Último evento: {lastEvent.event_name}</div>
                  <div className="text-xs text-[#6b8099]">{lastEvent.stage_label} · deal {lastEvent.deal_id?.split('_')[1]}</div>
                </div>
              </div>
              <div className="text-[11px] text-[#3a5068] text-right flex-shrink-0 ml-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                {timeAgo(lastEvent.timestamp)}<br />{formatDateTime(lastEvent.timestamp)}
              </div>
            </div>
          )}

          {/* Events table */}
          <div className="bg-[#0d1620] border border-[rgba(0,210,180,0.12)] rounded-xl overflow-hidden mb-4">
            <div className="grid gap-0 text-[10px] uppercase tracking-widest text-[#3a5068] px-4 py-2.5 bg-[#111d2a] border-b border-[rgba(0,210,180,0.12)]"
              style={{ gridTemplateColumns: '1fr 70px 100px 90px' }}>
              <div>Etapa → Evento Meta</div>
              <div className="text-right">Señales</div>
              <div>Volumen</div>
              <div>Estado</div>
            </div>
            {Object.keys(counts).length === 0 ? (
              <div className="px-4 py-4 text-sm text-[#3a5068]">Sin eventos este mes aún.</div>
            ) : (
              Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => {
                  const pct = Math.round((count / maxCount) * 100);
                  const isLow = count < 3;
                  return (
                    <div key={name} className="grid px-4 py-3 border-b border-[rgba(0,210,180,0.08)] last:border-0 hover:bg-[rgba(0,212,180,0.04)] transition-colors items-center"
                      style={{ gridTemplateColumns: '1fr 70px 100px 90px' }}>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLow ? 'bg-[#3a5068]' : 'bg-[#00d4b4]'}`} />
                        {name}
                      </div>
                      <div className="text-sm font-medium text-right" style={{ fontFamily: "'DM Mono', monospace" }}>{count}</div>
                      <div className="pr-3">
                        <div className="h-1 bg-[#111d2a] rounded-full">
                          <div className={`h-full rounded-full ${isLow ? 'bg-[#3a5068]' : 'bg-[#00d4b4]'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className={`text-[11px] ${isLow ? 'text-[#3a5068]' : 'text-[#22d37a]'}`}>
                        {isLow ? '○ Bajo volumen' : '● Activo'}
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Chart */}
          <div className="bg-[#0d1620] border border-[rgba(0,210,180,0.12)] rounded-xl p-4">
            <div className="text-xs text-[#6b8099] mb-4">
              Evolución diaria — últimos 14 días (total: {events.length} eventos)
            </div>
            <div className="flex items-end gap-1 h-20">
              {days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end flex-1">
                    <div className="w-full rounded-sm" style={{
                      height: `${Math.max((dayCounts[i] / maxDay) * 100, 3)}%`,
                      background: 'linear-gradient(to top, rgba(0,212,180,0.6), rgba(0,168,232,0.4))',
                      minHeight: '3px',
                    }} />
                  </div>
                  <div className="text-[9px] text-[#3a5068]" style={{ fontFamily: "'DM Mono', monospace" }}>{d.getDate()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between py-6 border-t border-[rgba(0,210,180,0.12)] mb-10">
          <div className="text-[11px] text-[#3a5068]">Valy Agency · CRM Signal · status.valy.agency</div>
          <div className="text-[11px] text-[#3a5068]" style={{ fontFamily: "'DM Mono', monospace" }}>
            Actualizado: {new Date().toLocaleString('es-AR')}
          </div>
        </div>

      </div>
    </div>
  );
}