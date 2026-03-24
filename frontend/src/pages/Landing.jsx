import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-transparent px-4 py-4 transition-all duration-300 lg:px-8" id="landing-navbar">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-white">
              ER
            </div>
            <span className="font-display text-base font-semibold text-ink">
              EduReach
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="h-9 px-4 text-xs">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="h-9 px-4 text-xs">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bg to-accent-light px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr,1fr] lg:items-center">
            <div className="space-y-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ink-2">
                Empowering Education
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
                <span className="text-accent">Empowering</span> education through community support.
              </h1>
              <p className="font-sans max-w-lg text-base text-ink-2">
                EduReach connects donors, volunteers, and schools to unlock access
                to quality learning resources — from books and supplies to time
                and mentorship.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/donor">
                  <Button>Donate Now</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Become a Volunteer</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Register School</Button>
                </Link>
              </div>
            </div>

            {/* Stats Cards Cluster */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 rotate-3">
                <Card className="bg-surface shadow-card p-4">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-accent">24</div>
                    <div className="font-sans text-xs text-ink-2">Schools</div>
                  </div>
                </Card>
              </div>
              <div className="absolute top-8 right-2 -rotate-2">
                <Card className="bg-surface shadow-card p-4">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-accent">3.2k</div>
                    <div className="font-sans text-xs text-ink-2">Books Donated</div>
                  </div>
                </Card>
              </div>
              <div className="relative top-20 left-8 rotate-1">
                <Card className="bg-surface shadow-card p-4">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-accent">1.8k</div>
                    <div className="font-sans text-xs text-ink-2">Volunteer Hours</div>
                  </div>
                </Card>
              </div>
              <div className="h-32"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display mb-12 text-center text-3xl font-semibold text-ink">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-2xl font-bold text-accent">
                1
              </div>
              <Card className="text-left">
                <h3 className="font-display mb-2 text-base font-semibold text-ink">Schools Share Needs</h3>
                <p className="font-sans text-sm text-ink-2">
                  Schools create profiles and share their specific requirements and events.
                </p>
              </Card>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-2xl font-bold text-accent">
                2
              </div>
              <Card className="text-left">
                <h3 className="font-display mb-2 text-base font-semibold text-ink">Donors Contribute</h3>
                <p className="font-sans text-sm text-ink-2">
                  Donors fund campaigns and donate books to support educational needs.
                </p>
              </Card>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-2xl font-bold text-accent">
                3
              </div>
              <Card className="text-left">
                <h3 className="font-display mb-2 text-base font-semibold text-ink">Volunteers Engage</h3>
                <p className="font-sans text-sm text-ink-2">
                  Volunteers support schools through events and mentorship opportunities.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Snapshot */}
      <section className="bg-surface-2 px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display mb-12 text-center text-3xl font-semibold text-ink">Impact Snapshot</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-accent">24</div>
              <div className="font-sans mt-2 text-sm text-ink-2">Partner Schools</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-accent">3.2k</div>
              <div className="font-sans mt-2 text-sm text-ink-2">Books Donated</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-accent">1.8k</div>
              <div className="font-sans mt-2 text-sm text-ink-2">Volunteer Hours</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-accent">850+</div>
              <div className="font-sans mt-2 text-sm text-ink-2">Students Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-sans text-xs text-ink-2">
            © {new Date().getFullYear()} EduReach. Built for equitable access to education.
          </p>
        </div>
      </footer>
    </div>
  )
}

