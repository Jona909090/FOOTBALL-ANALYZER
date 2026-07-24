# FOOTBALL ANALYZER

Profesionalna, responzivna Next.js aplikacija za statističku analizu fudbalskih utakmica, procenu tržišne vrednosti, izradu tiketa i transparentno praćenje učinka modela. Ceo korisnički interfejs je na srpskom jeziku.

> Analize predstavljaju statističke procene i ne garantuju dobitak. Kladite se odgovorno i samo sa novcem koji možete izgubiti.

## Šta je implementirano

- responzivni sportski dashboard sa tamnom bočnom navigacijom;
- 50 jasno označenih demo utakmica iz 10 liga i 30 timova;
- stranice/pogledi za utakmice, detaljnu analizu, predloge dana, tiket i rezultate modela;
- verovatnoća, poštena kvota, očekivana vrednost, rizik i pouzdanost;
- lokalno čuvanje demo tiketa (isti UI se vezuje za Supabase tabelu `tickets`);
- grafikoni učinka i promene kvota;
- Supabase prijava, registracija i zaboravljena lozinka, uz demo fallback;
- server rute za sportski API, sinhronizaciju i OpenAI objašnjenja;
- potpuna SQL šema sa vezama, RLS pravilima, audit/sync tabelama i nepromenljivim snapshotom analize;
- odgovorno klađenje: limit, upozorenje, pauza i skrivanje visokog rizika.

## Lokalno pokretanje

Potrebni su Node.js 20+ i npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Otvorite `http://localhost:3000`. Bez ključeva aplikacija automatski radi u demo režimu.

Provere:

```bash
npm run typecheck
npm run build
```

## Supabase

1. Kreirajte novi projekat na Supabase-u.
2. U SQL Editoru izvršite migracije redom:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_seed_markets.sql`
3. U Authentication → URL Configuration dodajte lokalni i produkcioni URL.
4. Kopirajte URL, anon ključ i service-role ključ u `.env.local`.

Browser koristi samo anon ključ. `SUPABASE_SERVICE_ROLE_KEY` se koristi isključivo na serveru. RLS dozvoljava korisniku da vidi i menja samo svoj profil, omiljene stavke, tikete i stavke tiketa. Administratorske operacije moraju proveriti `profiles.role = 'admin'` na serveru.

## Promenljive okruženja

Sve podržane promenljive se nalaze u `.env.example`. Nikada ne postavljajte tajne ključeve u promenljive sa prefiksom `NEXT_PUBLIC_`. Za demo režim koristite `DEMO_MODE=true`.

Podržane integracije:

- sportski podaci: API-Football kompatibilan endpoint (`SPORTS_API_*`);
- kvote: The Odds API kompatibilan endpoint (`ODDS_API_*`);
- AI obrazloženje: OpenAI Responses API (`OPENAI_API_KEY`, `OPENAI_MODEL`);
- baza i autentikacija: Supabase.

## Automatsko preuzimanje

Ruta `POST /api/sync` predstavlja server-side ulaz za cron. Kada je podešen `CRON_SECRET`, poziv mora sadržati `Authorization: Bearer <CRON_SECRET>`. Preporučeni intervali:

- raspored i povrede: svakih 6 sati;
- kvote za utakmice u naredna 24 sata: svakih 15–30 minuta;
- uživo rezultati: svakog minuta, samo za aktivne lige;
- obračun predloga: neposredno po završetku utakmice.

Svaki provider se implementira u `services/`. Adapter treba da vrati interne tipove umesto sirovog provider payload-a. Tako se novi API dodaje bez menjanja UI-a i sistema analize.

## Sistem analize

`services/analysis-engine.ts` sadrži determinističke proračune. Poštena kvota je `1 / verovatnoća`; očekivana vrednost je `(verovatnoća × kvota - 1) × 100`. Težine faktora i pragovi rizika čuvaju se u `analysis_settings`, kako bi admin mogao da ih menja bez objave novog koda.

Svaka analiza čuva:

- verziju modela;
- kompletan `data_snapshot`;
- `factor_scores`;
- kvalitet podataka;
- procene verovatnoće, poštene i ponuđene kvote;
- vreme nastanka i kasniji ishod.

Stare procene se ne ažuriraju; samo se njihov rezultat obračunava nakon završetka meča.

OpenAI dobija samo strukturisane činjenice iz baze. Sistem prompt zabranjuje izmišljanje podataka i garancije. Bez OpenAI ključa vraća se determinističko demo objašnjenje.

## Vercel postavljanje

1. Povežite Git repozitorijum sa Vercel-om.
2. Dodajte promenljive iz `.env.example` u Project Settings → Environment Variables.
3. Build command je `npm run build`; framework je Next.js.
4. Dodajte Cron Job koji poziva `/api/sync` sa tajnim Authorization zaglavljem.
5. U Supabase Authentication dodajte Vercel domen u dozvoljene redirect URL-ove.

## Organizacija

- `app/` — stranice i server API rute;
- `components/` — korisnički interfejs;
- `database/migrations/` — SQL šema, RLS i početna tržišta;
- `lib/` — demo podaci i Supabase klijenti;
- `services/` — sportski API i sistem analize;
- `types/` — TypeScript domen;
- `utils/` — čiste formule i pomoćne funkcije.

Za produkciju sledeći korak je implementacija provider adaptera i periodičnih Edge/Cron poslova koji upisuju normalizovane podatke u postojeću šemu.
