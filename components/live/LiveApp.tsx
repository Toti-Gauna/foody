'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeftRight, ChefHat, Crown, HandPlatter, Radio, Store, Utensils } from 'lucide-react';
import { API_URL, BASE_PATH } from '@/lib/env';
import { isSeason, seasonForDate, type Season } from '@/lib/seasons';
import { isRoomCode, newRoomCode, pickTransport } from '@/games/mesa/transport';
import { LuceroProvider, type Lang, type LiveRole } from '@/components/lucero/store';
import { SeasonProvider } from '@/components/lucero/season';
import { LoadingScreen } from '@/components/lucero/LoadingScreen';
import { CartaApp } from '@/components/lucero/carta/CartaApp';
import { GamesLayer } from '@/components/lucero/games/GamesLayer';
import { Badge, Button, Dot, Kicker } from '@/components/kit/atoms';
import { RoleCard, Stepper } from '@/components/kit/molecules';
import { useLiveLink } from './useLiveLink';
import { Kitchen } from './roles/Kitchen';
import { Waiter, TABLES } from './roles/Waiter';
import { Owner } from './roles/Owner';
import { InstallButton } from './Pwa';
import '@/components/lucero/lucero.css';
import '@/components/lucero/seasons.css';
import '@/components/lucero/crm/crm.css';
import '@/components/kit/kit.css';
import './live.css';

const ROLES: LiveRole[] = ['mesa', 'mesero', 'cocina', 'dueno'];
const ROLE_ICON = { mesa: Utensils, mesero: HandPlatter, cocina: ChefHat, dueno: Crown } as const;
const isRole = (s: string | null): s is LiveRole => !!s && (ROLES as string[]).includes(s);
const hostKey = (code: string) => `lucero-host-${code}`;

const noop = () => () => {};
const useSearch = () => useSyncExternalStore(noop, () => window.location.search, () => '');
const todaySeason = () => seasonForDate(new Date());
const isHostOf = (code: string) => {
  try {
    return window.sessionStorage.getItem(hostKey(code)) === '1';
  } catch {
    return false;
  }
};

/**
 * «Local en vivo» (Ignacio, 08/11/2026): the demo as a real venue on several phones. Someone opens the venue (their
 * phone becomes its hub, as the owner), passes links, and each person comes in as a table, a waiter, the kitchen or
 * another owner. Lucero is still a fictional venue: orders are tests and nothing is charged.
 *
 * URL: `?s=CODE` (the venue) `&rol=mesa|mesero|cocina|dueno` `&mesa=N`. Which phone is the hub is kept in that tab
 * (sessionStorage), never in the link, so forwarding the owner's link never makes a second hub.
 */
export function LiveApp({ lang }: { lang: Lang }) {
  const q = new URLSearchParams(useSearch());
  const code = q.get('s');
  const rol = q.get('rol');
  const today = useSyncExternalStore(noop, todaySeason, () => 'clasica' as Season);
  const temporada = q.get('temporada');
  const season: Season = isSeason(temporada) ? temporada : today;
  const transport = pickTransport(q.toString(), API_URL);
  const table = Math.min(TABLES, Math.max(1, Number(q.get('mesa')) || 1));

  // The games read their colours from <html> (as in the demo).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.season = season;
    void import('@/games/core/engine/palette').then((m) => m.clearPaletteCache());
    return () => {
      delete root.dataset.season;
    };
  }, [season]);

  const href = (params: Record<string, string | number | null>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== null && v !== '') p.set(k, String(v));
    for (const keep of ['red', 'temporada']) if (q.get(keep)) p.set(keep, q.get(keep)!);
    return `${BASE_PATH}/${lang}/local/?${p.toString()}`;
  };

  let body;
  if (!code || !isRoomCode(code)) body = <Landing onOpen={() => {
    const c = newRoomCode();
    try {
      window.sessionStorage.setItem(hostKey(c), '1');
    } catch {
      /* then this tab is a guest: tell them below */
    }
    window.location.assign(href({ s: c, rol: 'dueno' }));
  }} />;
  else if (!isRole(rol)) body = <Picker code={code} href={href} />;
  else
    body = (
      <Session
        lang={lang}
        code={code}
        role={rol}
        table={rol === 'mesa' ? table : null}
        isHost={rol === 'dueno' && isHostOf(code)}
        transport={transport}
        season={season}
        change={href({ s: code })}
        invite={(r, n) => `${window.location.origin}${href({ s: code, rol: r, mesa: r === 'mesa' ? (n ?? 1) : null })}`}
      />
    );

  return (
    <SeasonProvider value={season}>
      <div className="ld lv" data-season={season} data-role={isRole(rol) ? rol : 'entrada'}>
        {body}
      </div>
    </SeasonProvider>
  );
}

function Landing({ onOpen }: { onOpen: () => void }) {
  const t = useTranslations('lucero.live.landing');
  const tr = useTranslations('lucero.live.roles');
  return (
    <main className="lv-entry">
      <p className="lv-brand">
        Lucero <span className="ld-demo">{t('demo')}</span>
      </p>
      <Kicker>{t('kicker')}</Kicker>
      <h1 className="lv-title">{t('title')}</h1>
      <p className="lv-muted">{t('text')}</p>
      <Button variant="main" size="lg" block onClick={onOpen} icon={<Store aria-hidden className="size-5" />}>
        {t('open')}
      </Button>
      <ol className="lv-how">
        {(['mesa', 'mesero', 'cocina', 'dueno'] as const).map((r) => {
          const Icon = ROLE_ICON[r];
          return (
            <li key={r}>
              <span className="lv-how-icon" aria-hidden>
                <Icon className="size-5" />
              </span>
              <span>
                <b>{tr(`${r}.name`)}</b>
                <small>{tr(`${r}.text`)}</small>
              </span>
            </li>
          );
        })}
      </ol>
      <InstallButton />
      <p className="lv-note">{t('note')}</p>
    </main>
  );
}

function Picker({ code, href }: { code: string; href: (p: Record<string, string | number | null>) => string }) {
  const t = useTranslations('lucero.live.picker');
  const tr = useTranslations('lucero.live.roles');
  const [table, setTable] = useState(1);
  const [asTable, setAsTable] = useState(false);
  return (
    <main className="lv-entry">
      <p className="lv-brand">
        Lucero <span className="ld-demo">{t('demo')}</span>
      </p>
      <Kicker>{t('kicker', { code })}</Kicker>
      <h1 className="lv-title">{t('title')}</h1>
      <div className="lv-roles">
        <RoleCard icon={<Utensils className="size-6" />} title={tr('mesa.name')} text={tr('mesa.text')} onClick={() => setAsTable(true)} />
        {asTable ? (
          <div className="lv-table-pick lv-table-pick--card">
            <span>{t('table')}</span>
            <Stepper value={table} onChange={setTable} min={1} max={TABLES} label={t('table')} decLabel={t('tableDec')} incLabel={t('tableInc')} />
            <a className="k-btn k-btn--main k-btn--md" href={href({ s: code, rol: 'mesa', mesa: table })}>
              <span>{t('sit', { n: table })}</span>
            </a>
          </div>
        ) : null}
        <RoleCard icon={<HandPlatter className="size-6" />} title={tr('mesero.name')} text={tr('mesero.text')} href={href({ s: code, rol: 'mesero' })} />
        <RoleCard icon={<ChefHat className="size-6" />} title={tr('cocina.name')} text={tr('cocina.text')} href={href({ s: code, rol: 'cocina' })} />
        <RoleCard icon={<Crown className="size-6" />} title={tr('dueno.name')} text={tr('dueno.text')} href={href({ s: code, rol: 'dueno' })} />
      </div>
      <p className="lv-note">{t('note')}</p>
    </main>
  );
}

function Session({
  lang,
  code,
  role,
  table,
  isHost,
  transport,
  season,
  change,
  invite,
}: {
  lang: Lang;
  code: string;
  role: LiveRole;
  table: number | null;
  isHost: boolean;
  transport: ReturnType<typeof pickTransport>;
  season: Season;
  change: string;
  invite: (role: LiveRole | null, table?: number) => string;
}) {
  const t = useTranslations('lucero.live');
  const { link, status, roster } = useLiveLink({ code, isHost, role, table, name: '', transport, apiUrl: API_URL });
  const hubHere = roster.some((p) => p.host);
  const tone = status === 'online' ? (isHost || hubHere ? 'ready' : 'new') : status === 'failed' ? 'alert' : 'new';
  const statusText = status === 'online' && !isHost && !hubHere ? t('status.waitingHost') : t(`status.${status}`);
  const Icon = ROLE_ICON[role];

  return (
    <LuceroProvider plan={null} lang={lang} live={link}>
      <LoadingScreen />
      <header className="lv-bar" data-season={season}>
        <span className="lv-bar-role">
          <Icon aria-hidden className="size-4" />
          {role === 'mesa' ? t('roles.mesaN', { n: table ?? 1 }) : t(`roles.${role}.name`)}
        </span>
        <span className="lv-bar-status" role="status">
          <Dot tone={tone} pulse={tone !== 'ready'} />
          <span>{statusText}</span>
        </span>
        <Badge>{t('shell.code', { code })}</Badge>
        <InstallButton compact />
        <a className="k-icon lv-bar-change" href={change} aria-label={t('shell.change')} title={t('shell.change')}>
          <ArrowLeftRight aria-hidden className="size-4" />
        </a>
      </header>
      {role === 'dueno' && !isHost ? (
        <p className="lv-banner">
          <Radio aria-hidden className="size-4" /> {t('shell.viewer')}
        </p>
      ) : null}
      <main className="lv-main" data-role={role}>
        {role === 'mesa' ? (
          <div className="lv-carta">
            <CartaApp canPlay renderGames={({ stage, onStage, orderId }) => <GamesLayer stage={stage} onStage={onStage} orderId={orderId} />} />
          </div>
        ) : role === 'cocina' ? (
          <Kitchen />
        ) : role === 'mesero' ? (
          <Waiter />
        ) : (
          <Owner code={code} invite={invite} roster={roster} isHost={isHost} />
        )}
      </main>
    </LuceroProvider>
  );
}
