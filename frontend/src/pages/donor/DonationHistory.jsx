import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Table from '../../components/Table.jsx'
import Loader from '../../components/Loader.jsx'
import { donorService } from '../../services/donorService.js'

export default function DonationHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await donorService.history()
        setRecords(data?.data?.donations || [])
      } catch {
        setRecords([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        className: 'bg-green-light text-green',
        label: 'Completed'
      },
      pending: {
        className: 'bg-accent-light text-accent',
        label: 'Pending'
      },
      failed: {
        className: 'bg-red-light text-red',
        label: 'Failed'
      }
    }
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.completed
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current"></span>
        {config.label}
      </span>
    )
  }

  const getTypeIcon = (type) => {
    if (type?.toLowerCase() === 'book') {
      return (
        <svg className="h-4 w-4 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
    
    return (
      <svg className="h-4 w-4 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Donation History
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Track your contributions and see the impact you're making
          </p>
        </div>

        {/* Stats Summary */}
        {!loading && records.length > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-accent">
                  {records.length}
                </div>
                <div className="font-sans text-xs text-ink-2">Total Donations</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-green">
                  {records.filter(r => r.status?.toLowerCase() === 'completed').length}
                </div>
                <div className="font-sans text-xs text-ink-2">Completed</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-accent">
                  {records.filter(r => r.type?.toLowerCase() === 'book').length}
                </div>
                <div className="font-sans text-xs text-ink-2">Book Donations</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-accent">
                  ₹{records.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}
                </div>
                <div className="font-sans text-xs text-ink-2">Total Amount</div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Card>
          {loading ? (
            <Loader />
          ) : records.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="mx-auto mb-4 h-16 w-16 text-ink-2/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="font-display text-lg font-semibold text-ink mb-2">
                No donations yet
              </h3>
              <p className="font-sans text-sm text-ink-2 mb-6">
                Start making a difference by donating books or money to support education
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="/donor/donate-money"
                  className="inline-flex items-center rounded-md bg-accent px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Donate Money
                </a>
                <a
                  href="/donor/donate-books"
                  className="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 font-sans text-sm font-medium text-ink transition-colors hover:bg-surface-2"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Donate Books
                </a>
              </div>
            </div>
          ) : (
            <Table
              columns={[
                { 
                  key: 'createdAt', 
                  header: 'Date',
                  render: (row) => {
                    if (!row.createdAt) return <div className="font-sans text-sm text-ink">-</div>;
                    const date = new Date(row.createdAt);
                    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                    return (
                      <div className="font-sans text-sm text-ink">
                        {formattedDate}
                      </div>
                    );
                  }
                },
                { 
                  key: 'type', 
                  header: 'Type',
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      {getTypeIcon(row.type)}
                      <span className="font-sans text-sm text-ink capitalize">
                        {row.type || 'Monetary'}
                      </span>
                    </div>
                  )
                },
                { 
                  key: 'amount', 
                  header: 'Amount',
                  render: (row) => (
                    <div className="font-sans text-sm font-medium text-ink">
                      {row.amount ? `₹${row.amount.toLocaleString()}` : '-'}
                    </div>
                  )
                },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (row) => getStatusBadge(row.status)
                },
              ]}
              data={records}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}

