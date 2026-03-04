import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-8 lg:px-8 lg:py-12">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
              ER
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
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
              <Button className="h-9 px-4 text-xs">Get started</Button>
            </Link>
          </div>
        </header>

        <main className="grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-center">
          <section>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Empowering Education
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Empowering education through community support.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-600">
              EduReach connects donors, volunteers, and schools to unlock access
              to quality learning resources — from books and supplies to time
              and mentorship.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/donor">
                <Button>Donate now</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Become a volunteer</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Register your school</Button>
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <Card
              title="How it works"
              description="Three simple steps to create impact."
            >
              <ol className="mt-2 space-y-2 text-xs text-slate-700">
                <li>1. Schools share their needs and create events.</li>
                <li>2. Donors fund campaigns and donate books.</li>
                <li>3. Volunteers support schools through events.</li>
              </ol>
            </Card>
            <Card title="Impact snapshot">
              <dl className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <dt className="text-muted">Schools</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    24
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Books donated</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    3.2k
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Volunteer hours</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    1.8k
                  </dd>
                </div>
              </dl>
            </Card>
          </section>
        </main>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <Card title="For donors">
            <p className="text-xs text-slate-700">
              Support schools transparently with tracked monetary donations and
              book drives.
            </p>
          </Card>
          <Card title="For schools">
            <p className="text-xs text-slate-700">
              Publish requirements, manage donations, and organize volunteer
              events in one place.
            </p>
          </Card>
          <Card title="For volunteers">
            <p className="text-xs text-slate-700">
              Discover opportunities to mentor, teach, and support local
              schools.
            </p>
          </Card>
        </section>

        <footer className="mt-10 border-t pt-4 text-xs text-muted">
          © {new Date().getFullYear()} EduReach. Built for equitable access to
          education.
        </footer>
      </div>
    </div>
  )
}

