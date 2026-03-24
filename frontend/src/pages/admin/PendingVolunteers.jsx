import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Table from '../../components/Table.jsx'
import Button from '../../components/Button.jsx'
import Loader from '../../components/Loader.jsx'
import { adminService } from '../../services/adminService.js'

export default function PendingVolunteers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await adminService.pending()
      setRows(data?.volunteers || [])
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (volunteerId) => {
    setUpdating(true)
    try {
      await adminService.approveVolunteer({ volunteerId })
      await load()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Pending Volunteers
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Review new volunteer applications before approval
          </p>
        </div>

        <Card>
          {loading ? (
            <Loader />
          ) : (
            <Table
              columns={[
                { key: 'name', header: 'Volunteer Name' },
                { key: 'email', header: 'Email' },
                { key: 'skills', header: 'Skills' },
                {
                  key: 'actions',
                  header: 'Actions',
                  render: (row) => (
                    <Button
                      onClick={() => approve(row.id)}
                      loading={updating}
                      disabled={updating}
                      className="text-xs"
                    >
                      {updating ? 'Approving...' : 'Approve'}
                    </Button>
                  ),
                },
              ]}
              data={rows}
              emptyLabel="No volunteers pending approval"
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}

