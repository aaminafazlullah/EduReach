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
        setRecords(data || [])
      } catch {
        setRecords([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <Card
        title="Donation history"
        description="Track your contributions across schools and campaigns."
      >
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={[
              { key: 'date', header: 'Date' },
              { key: 'amount', header: 'Amount (₹)' },
              { key: 'type', header: 'Type' },
              { key: 'status', header: 'Status' },
            ]}
            data={records.map((r) => ({
              date: r.date ? new Date(r.date).toLocaleDateString() : '',
              amount: r.amount,
              type: r.type || 'Monetary',
              status: r.status || 'Completed',
            }))}
          />
        )}
      </Card>
    </DashboardLayout>
  )
}

