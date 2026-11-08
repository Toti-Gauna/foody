'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChefHat, Crown, HandPlatter, LayoutDashboard, Radio, Users, Utensils } from 'lucide-react';
import { formatArs, orderTotal, useLucero, type LiveRole } from '@/components/lucero/store';
import { Badge, Dot, Kicker, Stat } from '@/components/kit/atoms';
import { QrLink, Stepper, Tabs } from '@/components/kit/molecules';
import { Crm, type CrmSection } from '@/components/lucero/crm/Crm';
import { JuegosAdmin } from '@/components/lucero/crm/JuegosAdmin';
import { Academy } from '@/components/lucero/crm/Academy';
import type { Peer } from '../useLiveLink';
import { TABLES } from './Waiter';

const ROLE_ICON: Record<LiveRole, typeof Crown> = { dueno: Crown, mesero: HandPlatter, cocina: ChefHat, mesa: Utensils };

/**
 * Dueño: who is in the venue right now and the links (and QRs) to bring the team in, the night's numbers, and the whole
 * CRM. On the host phone this screen is the venue's hub: it has to stay open.
 */
export function Owner({ code, invite, roster, isHost }: { code: string; invite: (role: LiveRole | null, table?: number) => string; roster: Peer[]; isHost: boolean }) {
  const t = useTranslations('lucero.live.dueno');
  const tr = useTranslations('lucero.live.roles');
  const { state, lang } = useLucero();
  const [tab, setTab] = useState<'equipo' | 'crm'>('equipo');
  const [table, setTable] = useState(1);
  const [section, setSection] = useState<CrmSection>('servicio');
  const sales = state.orders.reduce((s, o) => s + orderTotal(o), 0);
  const kpis = [
    { label: t('kpi.orders'), value: state.orders.length },
    { label: t('kpi.kitchen'), value: state.orders.filter((o) => o.status === 'sent' || o.status === 'kitchen').length },
    { label: t('kpi.ready'), value: state.orders.filter((o) => o.status === 'ready').length },
    { label: t('kpi.sales'), value: formatArs(sales, lang) },
  ];
  const qr = (role: LiveRole | null, title: string, caption?: string, n?: number) => (
    <QrLink url={invite(role, n)} title={title} caption={caption} copyLabel={t('copy')} copiedLabel={t('copied')} qrAlt={t('qrAlt', { role: title })} />
  );

  return (
    <div className="lv-role">
      <Tabs
        label={t('tabsLabel')}
        value={tab}
        onChange={setTab}
        items={[
          { id: 'equipo', label: t('tabs.equipo'), count: Math.max(0, roster.length - 1), icon: <Users aria-hidden className="size-4" /> },
          { id: 'crm', label: t('tabs.crm'), icon: <LayoutDashboard aria-hidden className="size-4" /> },
        ]}
      />

      {tab === 'equipo' ? (
        <div className="lv-owner">
          <header className="lv-owner-head">
            <Kicker>{t('code', { code })}</Kicker>
            <h2 className="lv-h">{t('title')}</h2>
            <p className="lv-muted">{t('text')}</p>
            {isHost ? (
              <p className="lv-host-note">
                <Radio aria-hidden className="size-4" /> {t('hostNote')}
              </p>
            ) : null}
          </header>

          <dl className="lv-kpis">
            {kpis.map((k) => (
              <Stat key={k.label} label={k.label} value={k.value} />
            ))}
          </dl>

          <section className="lv-links" aria-labelledby="lv-links-h">
            <h3 id="lv-links-h" className="lv-h3">
              {t('linksTitle')}
            </h3>
            <div className="lv-table-pick">
              <span>{t('tableLink')}</span>
              <Stepper value={table} onChange={setTable} min={1} max={TABLES} label={t('tableLink')} decLabel={t('tableDec')} incLabel={t('tableInc')} />
            </div>
            {qr('mesa', t('tableTitle', { n: table }), t('tableCaption'), table)}
            {qr('mesero', tr('mesero.name'), tr('mesero.text'))}
            {qr('cocina', tr('cocina.name'), tr('cocina.text'))}
            {qr(null, t('anyLink'), t('anyCaption'))}
          </section>

          <section aria-labelledby="lv-people-h">
            <h3 id="lv-people-h" className="lv-h3">
              {t('connected')} <Badge tone="ready">{roster.length}</Badge>
            </h3>
            {roster.length > 1 ? null : <p className="lv-muted">{t('connectedEmpty')}</p>}
            <ul className="lv-people">
              {roster.map((p) => {
                const Icon = ROLE_ICON[p.role] ?? Utensils;
                return (
                  <li key={p.id}>
                    <Dot tone="ready" pulse />
                    <Icon aria-hidden className="size-4" />
                    <span>
                      {tr(`${p.role}.name`)}
                      {p.role === 'mesa' && p.table ? ` ${p.table}` : ''}
                      {p.name ? ` · ${p.name}` : ''}
                    </span>
                    {p.host ? <Badge tone="gold">{t('hub')}</Badge> : null}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      ) : (
        <div className="lv-crm">
          <Crm section={section} onSection={setSection} slots={{ juegos: <JuegosAdmin />, academy: <Academy /> }} />
        </div>
      )}
    </div>
  );
}
