# Nastavení API pro reálná data filmů

## 🎬 The Movie Database (TMDB) API

Pro zobrazení reálných dat o filmech používáme TMDB API, které je zdarma pro nekomerční použití.

### 1. Získání API klíče

1. **Registrace na TMDB:**
   - Jděte na [https://www.themoviedb.org/](https://www.themoviedb.org/)
   - Vytvořte si účet (zdarma)

2. **Požádání o API klíč:**
   - Po přihlášení jděte do Settings → API
   - Nebo přímo na: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Klikněte na "Create" nebo "Request an API Key"
   - Vyberte "Developer" (pro osobní/nekomerční projekty)
   - Vyplňte formulář s informacemi o vašem projektu

3. **Získání klíče:**
   - Po schválení (obvykle během několika minut) získáte API klíč
   - Klíč vypadá nějak takto: `1234567890abcdef1234567890abcdef`

### 2. Nastavení API klíče v projektu

Otevřete soubor `src/services/movieApi.ts` a nahraďte:

```typescript
const API_KEY = 'YOUR_API_KEY_HERE';
```

Vašim skutečným API klíčem:

```typescript
const API_KEY = 'váš_skutečný_api_klíč_zde';
```

### 3. Možnosti API

Aplikace nyní načítá:

- **Trending filmy** - pro hero banner
- **Populární filmy** - nejsledovanější filmy
- **Top rated filmy** - nejlépe hodnocené filmy
- **Detaily filmů** - včetně trailerů z YouTube

### 4. Funkce

- ✅ **Reálné postery** filmů ve vysokém rozlišení
- ✅ **Backdrop obrázky** pro hero banner
- ✅ **YouTube trailery** (pokud jsou dostupné)
- ✅ **Hodnocení** z TMDB databáze
- ✅ **Žánry** a metadata filmů
- ✅ **Vícejazyčná podpora** (čeština jako primární)

### 5. Bez API klíče

Pokud nechcete používat API, aplikace zobrazí chybovou zprávu a můžete se vrátit k ukázkovým datům.

### 6. Rate Limits

TMDB API má limity:
- **40 požadavků za 10 sekund**
- **1000 požadavků za den** pro zdarma účty

Pro větší projekty můžete upgradovat na placenou verzi.

## 🚀 Po nastavení API klíče

Restartujte aplikaci:
```bash
npm run dev
```

A uvidíte reálná data z TMDB! 🎉
