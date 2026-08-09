'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CalendarDays, LayoutGrid } from 'lucide-react';
import { Header, PageContainer } from '@/components/layout/Header';
import { useStore } from '@/lib/store';
import { RendezVous, RendezVousStatus } from '@/lib/types';
import {
  JOURS_SEMAINE,
  HEURES_OUVERTURE,
  formatDateISO,
  parseDateISO,
  isSameDay,
  startOfWeek,
  getWeekDays,
  getMonthGrid,
  addWeeks,
  addMonths,
  formatMonthYear,
  formatFullDate,
} from '@/lib/calendar';

type ViewMode = 'semaine' | 'mois';

const DEMO_TODAY = new Date(2026, 7, 9); // 9 août 2026

function getStatusStyle(status: RendezVousStatus, selected: boolean) {
  if (selected) return 'bg-brand-white text-brand-black ring-2 ring-brand-white';
  switch (status) {
    case 'confirme':
      return 'bg-status-accepted/20 text-status-accepted border border-status-accepted/30 hover:bg-status-accepted/30';
    case 'en_attente':
      return 'bg-status-analysis/20 text-status-analysis border border-status-analysis/30 hover:bg-status-analysis/30';
    case 'annule':
      return 'bg-status-refused/20 text-status-refused border border-status-refused/30 line-through opacity-60';
  }
}

function getStatusLabel(status: RendezVousStatus) {
  switch (status) {
    case 'confirme': return 'Confirmé';
    case 'en_attente': return 'En attente';
    case 'annule': return 'Annulé';
  }
}

function RdvBlock({
  rdv,
  selected,
  onClick,
  compact = false,
}: {
  rdv: RendezVous;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-full text-left rounded-lg transition-all ${getStatusStyle(rdv.status, selected)} ${
        compact ? 'p-1.5 text-[10px]' : 'p-2 text-xs'
      }`}
    >
      <p className="font-semibold truncate">{rdv.heure} — {rdv.clientNom.split(' ')[0]}</p>
      {!compact && (
        <>
          <p className="truncate opacity-80">{rdv.vehicule}</p>
          <p className="truncate opacity-70">{rdv.service}</p>
        </>
      )}
      {compact && <p className="truncate opacity-70">{rdv.service}</p>}
    </button>
  );
}

function DetailPanel({ rdv, onClose }: { rdv: RendezVous; onClose: () => void }) {
  return (
    <div className="card sticky top-32 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{rdv.clientNom}</h3>
          <p className="text-brand-silver">{rdv.vehicule}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          rdv.status === 'confirme'
            ? 'bg-status-accepted/20 text-status-accepted'
            : rdv.status === 'en_attente'
            ? 'bg-status-analysis/20 text-status-analysis'
            : 'bg-status-refused/20 text-status-refused'
        }`}>
          {getStatusLabel(rdv.status)}
        </span>
      </div>

      <p className="text-lg font-medium mb-4">{rdv.service}</p>

      <div className="bg-brand-gray rounded-lg p-4 mb-6">
        <p className="text-brand-light text-sm">Date et heure</p>
        <p className="font-medium capitalize">{formatFullDate(parseDateISO(rdv.date))}</p>
        <p className="text-3xl font-bold mt-1">{rdv.heure}</p>
      </div>

      <div className="space-y-3">
        <button className="btn-success w-full">Confirmer</button>
        <button className="btn-secondary w-full">Reporter</button>
        <button className="btn-danger w-full">Annuler</button>
      </div>

      {rdv.clientId && (
        <Link
          href={`/clients/${rdv.clientId}`}
          className="block text-center text-sm text-brand-light hover:text-brand-white mt-4 transition-colors"
        >
          Voir le profil client →
        </Link>
      )}

      <button onClick={onClose} className="btn-ghost w-full mt-3 text-sm">
        Fermer
      </button>
    </div>
  );
}

export default function RendezVousPage() {
  const { state } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('semaine');
  const [currentDate, setCurrentDate] = useState(DEMO_TODAY);
  const [selectedRdvId, setSelectedRdvId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(DEMO_TODAY);

  const selectedRdv = state.rendezVous.find((r) => r.id === selectedRdvId);

  const rdvByDate = useMemo(() => {
    const map: Record<string, RendezVous[]> = {};
    state.rendezVous.forEach((rdv) => {
      if (!map[rdv.date]) map[rdv.date] = [];
      map[rdv.date].push(rdv);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.heure.localeCompare(b.heure))
    );
    return map;
  }, [state.rendezVous]);

  const weekStart = startOfWeek(currentDate);
  const weekDays = getWeekDays(weekStart);
  const monthGrid = getMonthGrid(currentDate.getFullYear(), currentDate.getMonth());

  const navigate = (direction: -1 | 1) => {
    if (viewMode === 'semaine') {
      setCurrentDate(addWeeks(currentDate, direction));
    } else {
      setCurrentDate(addMonths(currentDate, direction));
    }
  };

  const goToToday = () => {
    setCurrentDate(DEMO_TODAY);
    setSelectedDay(DEMO_TODAY);
  };

  const rdvForDay = (date: Date) => rdvByDate[formatDateISO(date)] || [];

  const weekRdvCount = weekDays.reduce((acc, d) => acc + rdvForDay(d).length, 0);
  const monthRdvCount = state.rendezVous.filter((r) => {
    const d = parseDateISO(r.date);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  }).length;

  return (
    <>
      <Header />
      <PageContainer title="Rendez-vous" subtitle="Calendrier complet de vos rendez-vous">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn-ghost p-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold min-w-[200px] text-center capitalize">
              {viewMode === 'semaine'
                ? `Semaine du ${weekDays[0].getDate()} ${formatMonthYear(weekDays[0]).split(' ')[0]}`
                : formatMonthYear(currentDate)}
            </h2>
            <button onClick={() => navigate(1)} className="btn-ghost p-2">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={goToToday} className="btn-secondary text-sm py-2 px-4 ml-2">
              Aujourd&apos;hui
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-light">
              {viewMode === 'semaine' ? `${weekRdvCount} RDV cette semaine` : `${monthRdvCount} RDV ce mois`}
            </span>
            <div className="flex bg-brand-gray rounded-lg p-1">
              <button
                onClick={() => setViewMode('semaine')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'semaine' ? 'bg-brand-white text-brand-black' : 'text-brand-light hover:text-brand-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Semaine
              </button>
              <button
                onClick={() => setViewMode('mois')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'mois' ? 'bg-brand-white text-brand-black' : 'text-brand-light hover:text-brand-white'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Mois
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-xs text-brand-light">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-status-accepted/40 border border-status-accepted/50" />
            Confirmé
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-status-analysis/40 border border-status-analysis/50" />
            En attente
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-status-refused/40 border border-status-refused/50" />
            Annulé
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-3">
            {viewMode === 'semaine' ? (
              /* ── Week view with time grid ── */
              <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Day headers */}
                    <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-brand-muted/50">
                      <div className="p-3" />
                      {weekDays.map((day) => {
                        const isToday = isSameDay(day, DEMO_TODAY);
                        const isSelected = selectedDay && isSameDay(day, selectedDay);
                        const count = rdvForDay(day).length;
                        return (
                          <button
                            key={formatDateISO(day)}
                            onClick={() => setSelectedDay(day)}
                            className={`p-3 text-center border-l border-brand-muted/30 transition-colors ${
                              isSelected ? 'bg-brand-muted/40' : 'hover:bg-brand-muted/20'
                            }`}
                          >
                            <p className={`text-xs uppercase tracking-wider ${
                              isToday ? 'text-status-new font-bold' : 'text-brand-light'
                            }`}>
                              {JOURS_SEMAINE[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                            </p>
                            <p className={`text-xl font-bold mt-1 ${
                              isToday ? 'text-status-new' : ''
                            }`}>
                              {day.getDate()}
                            </p>
                            {count > 0 && (
                              <p className="text-[10px] text-brand-light mt-1">{count} RDV</p>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time slots */}
                    {HEURES_OUVERTURE.map((heure) => (
                      <div
                        key={heure}
                        className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-brand-muted/20 min-h-[64px]"
                      >
                        <div className="p-2 text-xs text-brand-light text-right pr-3 pt-3">
                          {heure}
                        </div>
                        {weekDays.map((day) => {
                          const dayRdv = rdvForDay(day).filter((r) => r.heure === heure);
                          return (
                            <div
                              key={`${formatDateISO(day)}-${heure}`}
                              className="border-l border-brand-muted/20 p-1"
                            >
                              {dayRdv.map((rdv) => (
                                <RdvBlock
                                  key={rdv.id}
                                  rdv={rdv}
                                  selected={selectedRdvId === rdv.id}
                                  onClick={() => setSelectedRdvId(rdv.id)}
                                />
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Month view ── */
              <div className="card p-0 overflow-hidden">
                {/* Month day headers */}
                <div className="grid grid-cols-7 border-b border-brand-muted/50">
                  {JOURS_SEMAINE.map((jour) => (
                    <div key={jour} className="p-3 text-center text-xs font-semibold text-brand-light uppercase tracking-wider">
                      {jour}
                    </div>
                  ))}
                </div>

                {/* Month grid */}
                {monthGrid.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 border-b border-brand-muted/20 last:border-0">
                    {week.map((day, di) => {
                      if (!day) {
                        return <div key={`empty-${wi}-${di}`} className="min-h-[120px] bg-brand-black/30 border-r border-brand-muted/10 last:border-0" />;
                      }

                      const isToday = isSameDay(day, DEMO_TODAY);
                      const isSelected = selectedDay && isSameDay(day, selectedDay);
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const dayRdv = rdvForDay(day);

                      return (
                        <button
                          key={formatDateISO(day)}
                          onClick={() => {
                            setSelectedDay(day);
                            if (dayRdv.length === 1) setSelectedRdvId(dayRdv[0].id);
                          }}
                          className={`min-h-[120px] p-2 border-r border-brand-muted/10 last:border-0 text-left transition-colors ${
                            isSelected ? 'bg-brand-muted/30' : 'hover:bg-brand-muted/10'
                          } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                              isToday ? 'bg-status-new text-white' : ''
                            }`}>
                              {day.getDate()}
                            </span>
                            {dayRdv.length > 0 && (
                              <span className="text-[10px] text-brand-light">{dayRdv.length}</span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayRdv.slice(0, 3).map((rdv) => (
                              <RdvBlock
                                key={rdv.id}
                                rdv={rdv}
                                selected={selectedRdvId === rdv.id}
                                onClick={() => setSelectedRdvId(rdv.id)}
                                compact
                              />
                            ))}
                            {dayRdv.length > 3 && (
                              <p className="text-[10px] text-brand-light pl-1">
                                +{dayRdv.length - 3} autres
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Day summary below calendar on mobile / when day selected */}
            {selectedDay && (
              <div className="card mt-6 xl:hidden">
                <h3 className="font-semibold mb-4 capitalize">
                  {formatFullDate(selectedDay)}
                </h3>
                {rdvForDay(selectedDay).length === 0 ? (
                  <p className="text-brand-light text-sm">Aucun rendez-vous ce jour</p>
                ) : (
                  <div className="space-y-2">
                    {rdvForDay(selectedDay).map((rdv) => (
                      <RdvBlock
                        key={rdv.id}
                        rdv={rdv}
                        selected={selectedRdvId === rdv.id}
                        onClick={() => setSelectedRdvId(rdv.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side panel */}
          <div className="hidden xl:block">
            {selectedRdv ? (
              <DetailPanel rdv={selectedRdv} onClose={() => setSelectedRdvId(null)} />
            ) : selectedDay ? (
              <div className="card sticky top-32">
                <h3 className="font-semibold mb-4 capitalize">
                  {formatFullDate(selectedDay)}
                </h3>
                {rdvForDay(selectedDay).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-brand-light">Aucun rendez-vous</p>
                    <button className="btn-primary mt-4 text-sm w-full">
                      + Ajouter un RDV
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rdvForDay(selectedDay).map((rdv) => (
                      <RdvBlock
                        key={rdv.id}
                        rdv={rdv}
                        selected={selectedRdvId === rdv.id}
                        onClick={() => setSelectedRdvId(rdv.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12 text-brand-light sticky top-32">
                <CalendarDays className="w-10 h-10 mx-auto mb-4 opacity-40" />
                <p>Sélectionnez un jour ou un rendez-vous</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile detail overlay */}
        {selectedRdv && (
          <div className="xl:hidden fixed inset-0 z-50 bg-brand-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-md">
              <DetailPanel rdv={selectedRdv} onClose={() => setSelectedRdvId(null)} />
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
}
