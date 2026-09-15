'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SiteContent } from '@/lib/site-content';

type Props = {
  initialContent: SiteContent;
  userName: string;
  signOutPath: string;
};

const cloneContent = (content: SiteContent): SiteContent =>
  JSON.parse(JSON.stringify(content)) as SiteContent;

export default function AdminEditor({ initialContent, userName, signOutPath }: Props) {
  const [content, setContent] = useState(() => cloneContent(initialContent));
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const updateDestination = (
    index: number,
    field: keyof SiteContent['destinations'][number],
    value: string,
  ) => {
    setContent((current) => {
      const next = cloneContent(current);
      next.destinations[index][field] = value;
      return next;
    });
    setStatus('idle');
  };

  const updateLocalLink = (
    index: number,
    field: keyof SiteContent['localLinks'][number],
    value: string,
  ) => {
    setContent((current) => {
      const next = cloneContent(current);
      next.localLinks[index][field] = value;
      return next;
    });
    setStatus('idle');
  };

  const updateSeason = (
    index: number,
    field: 'season' | 'tone',
    value: string,
  ) => {
    setContent((current) => {
      const next = cloneContent(current);
      next.seasons[index][field] = value;
      return next;
    });
    setStatus('idle');
  };

  const updateEvent = (
    seasonIndex: number,
    eventIndex: number,
    field: 'label' | 'href',
    value: string,
  ) => {
    setContent((current) => {
      const next = cloneContent(current);
      next.seasons[seasonIndex].events[eventIndex][field] = value;
      return next;
    });
    setStatus('idle');
  };

  const addEvent = (seasonIndex: number) => {
    setContent((current) => {
      const next = cloneContent(current);
      if (next.seasons[seasonIndex].events.length < 12) {
        next.seasons[seasonIndex].events.push({ label: 'New event', href: 'https://' });
      }
      return next;
    });
    setStatus('idle');
  };

  const removeEvent = (seasonIndex: number, eventIndex: number) => {
    setContent((current) => {
      const next = cloneContent(current);
      if (next.seasons[seasonIndex].events.length > 1) {
        next.seasons[seasonIndex].events.splice(eventIndex, 1);
      }
      return next;
    });
    setStatus('idle');
  };

  const save = async () => {
    setStatus('saving');
    setMessage('');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'The changes could not be saved.');
      setStatus('saved');
      setMessage('Changes saved. The public site will refresh within about a minute.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'The changes could not be saved.');
    }
  };

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <Link className="admin-wordmark" href="/">Palmhouse · Indian Wells</Link>
          <span>Sitekeeper</span>
        </div>
        <nav aria-label="Sitekeeper navigation">
          <a href="/" target="_blank">View website ↗</a>
          <a href={signOutPath}>Sign out</a>
        </nav>
      </header>

      <div className="admin-layout">
        <aside>
          <p className="admin-kicker">Private editor</p>
          <h1>Keep the desert guide current.</h1>
          <p>Signed in as {userName}. Edit the cards and links below, then save once when everything looks right.</p>
          <div className="admin-status" data-state={status} aria-live="polite">
            {status === 'saving' ? 'Saving…' : message || 'No unsaved changes.'}
          </div>
          <button type="button" onClick={save} disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving changes…' : 'Save all changes'}
          </button>
        </aside>

        <div className="admin-sections">
          <section className="admin-section">
            <div className="admin-section-heading">
              <p>01</p>
              <div><h2>Close to everything</h2><span>Feature cards</span></div>
            </div>
            <div className="admin-card-grid">
              {content.destinations.map((item, index) => (
                <fieldset className="admin-card" key={`destination-${index}`}>
                  <legend>Card {index + 1}</legend>
                  <div className="admin-field-row">
                    <label>Number<input value={item.number} onChange={(event) => updateDestination(index, 'number', event.target.value)} /></label>
                    <label>Eyebrow<input value={item.label} onChange={(event) => updateDestination(index, 'label', event.target.value)} /></label>
                  </div>
                  <label>Title<input value={item.title} onChange={(event) => updateDestination(index, 'title', event.target.value)} /></label>
                  <label>Description<textarea rows={4} value={item.copy} onChange={(event) => updateDestination(index, 'copy', event.target.value)} /></label>
                  <label>Distance / note<input value={item.meta} onChange={(event) => updateDestination(index, 'meta', event.target.value)} /></label>
                  <label>Link<input type="url" value={item.href} onChange={(event) => updateDestination(index, 'href', event.target.value)} /></label>
                </fieldset>
              ))}
            </div>
          </section>

          <section className="admin-section">
            <div className="admin-section-heading">
              <p>02</p>
              <div><h2>Nearby favorites</h2><span>Five small location links</span></div>
            </div>
            <div className="admin-card-grid admin-card-grid-compact">
              {content.localLinks.map((item, index) => (
                <fieldset className="admin-card" key={`local-${index}`}>
                  <legend>Link {index + 1}</legend>
                  <label>Name<input value={item.name} onChange={(event) => updateLocalLink(index, 'name', event.target.value)} /></label>
                  <label>Distance<input value={item.distance} onChange={(event) => updateLocalLink(index, 'distance', event.target.value)} /></label>
                  <label>Description<input value={item.copy} onChange={(event) => updateLocalLink(index, 'copy', event.target.value)} /></label>
                  <label>Link<input type="url" value={item.href} onChange={(event) => updateLocalLink(index, 'href', event.target.value)} /></label>
                </fieldset>
              ))}
            </div>
          </section>

          <section className="admin-section">
            <div className="admin-section-heading">
              <p>03</p>
              <div><h2>There’s always a reason to return</h2><span>Seasonal event links</span></div>
            </div>
            <div className="admin-season-list">
              {content.seasons.map((season, seasonIndex) => (
                <fieldset className="admin-card admin-season" key={`season-${seasonIndex}`}>
                  <legend>Season {seasonIndex + 1}</legend>
                  <div className="admin-field-row">
                    <label>Months<input value={season.season} onChange={(event) => updateSeason(seasonIndex, 'season', event.target.value)} /></label>
                    <label>Heading<input value={season.tone} onChange={(event) => updateSeason(seasonIndex, 'tone', event.target.value)} /></label>
                  </div>
                  <div className="admin-events">
                    {season.events.map((eventItem, eventIndex) => (
                      <div className="admin-event" key={`event-${seasonIndex}-${eventIndex}`}>
                        <label>Event<input value={eventItem.label} onChange={(event) => updateEvent(seasonIndex, eventIndex, 'label', event.target.value)} /></label>
                        <label>Link<input type="url" value={eventItem.href} onChange={(event) => updateEvent(seasonIndex, eventIndex, 'href', event.target.value)} /></label>
                        <button type="button" aria-label={`Remove ${eventItem.label}`} onClick={() => removeEvent(seasonIndex, eventIndex)} disabled={season.events.length === 1}>×</button>
                      </div>
                    ))}
                  </div>
                  <button className="admin-add" type="button" onClick={() => addEvent(seasonIndex)} disabled={season.events.length >= 12}>+ Add event</button>
                </fieldset>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="admin-mobile-save">
        <span aria-live="polite">{status === 'saving' ? 'Saving…' : message}</span>
        <button type="button" onClick={save} disabled={status === 'saving'}>Save changes</button>
      </div>
    </main>
  );
}
