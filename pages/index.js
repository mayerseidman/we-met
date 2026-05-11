// ══════════════════════════════════════════════════════════════
// pages/index.js
// ══════════════════════════════════════════════════════════════
// Public marketing page at `/`.
// _app.js handles routing: users with a profile go to /meets,
// users with a session (but no profile) go to /profile.
// Anonymous visitors fall through and see this marketing page.
// ══════════════════════════════════════════════════════════════

import Header from '../components/Header';
import MarketingLanding from '../components/MarketingLanding';

export default function HomePage() {
    return (
        <>
            <Header />
            <MarketingLanding />
        </>
    );
}
