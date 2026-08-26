import { memo } from 'react';

const ROT_META = {
  fresh: {
    label: 'Fresh',
    emoji: '🌿',
    className: 'rot-fresh',
    hint: 'Just picked',
  },
  aging: {
    label: 'Aging',
    emoji: '🍂',
    className: 'rot-aging',
    hint: 'Starting to fade',
  },
  rotten: {
    label: 'Rotten',
    emoji: '🪰',
    className: 'rot-rotten',
    hint: 'Strongly decaying',
  },
  stale: {
    label: 'Stale',
    emoji: '🦴',
    className: 'rot-stale',
    hint: 'Ready to delete',
  },
};

function normalizeRotState(rotState, stale) {
  if (stale) return 'stale';

  const raw = String(rotState || '').toLowerCase().trim();

  if (raw === 'new' || raw === 'fresh' || raw === 'alive') return 'fresh';
  if (raw === 'aging' || raw === 'fading' || raw === 'old') return 'aging';
  if (raw === 'rotten' || raw === 'rot' || raw === 'decayed') return 'rotten';
  if (raw === 'stale' || raw === 'dead' || raw === 'gone') return 'stale';

  return 'aging';
}

function normalizeFreshness(value) {
  if (value === undefined || value === null) return null;

  const num = Number(value);
  if (!Number.isFinite(num)) return null;

  const pct = num <= 1 ? num * 100 : num;
  return Math.max(0, Math.min(100, pct));
}

function RotBadge({
  rotState,
  freshness,
  freshnessScore,
  hourlyFreshness,
  hourlyDecay,
  decayRate,
  stale,
  compact = false,
  showHint = true,
  title,
}) {
  const state = normalizeRotState(rotState, stale);
  const meta = ROT_META[state] ?? ROT_META.aging;
  const pct = normalizeFreshness(freshness ?? freshnessScore ?? hourlyFreshness);

  const decay = Number(hourlyDecay ?? decayRate);
  const decayText = Number.isFinite(decay) && decay > 0 ? ` · -${decay}%/hr` : '';
  const label = `${meta.label}${pct !== null ? ` ${Math.round(pct)}% fresh` : ''}${decayText}`;
  const displayTitle = title || label;

  return (
    <span
      className={`rot-badge ${meta.className} ${compact ? 'rot-badge--compact' : ''}`}
      title={displayTitle}
      aria-label={displayTitle}
    >
      <span className="rot-badge__emoji" aria-hidden="true">
        {meta.emoji}
      </span>
      <span className="rot-badge__label">{meta.label}</span>

      {pct !== null && (
        <span className="rot-badge__meter" aria-hidden="true">
          <span className="rot-badge__fill" style={{ width: `${pct}%` }} />
        </span>
      )}

      {!compact && pct !== null && (
        <span className="rot-badge__percent">{Math.round(pct)}%</span>
      )}

      {!compact && showHint && <span className="rot-badge__hint">{meta.hint}</span>}
    </span>
  );
}

export default memo(RotBadge);