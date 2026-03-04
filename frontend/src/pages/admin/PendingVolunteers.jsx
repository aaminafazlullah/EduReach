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
      <Card
        title="Pending volunteers"
        description="Review new volunteer applications before approval."
      >
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'skills', header: 'Skills' },
              {
                key: 'actions',
                header: '',
                render: (row) => (
                  <Button
                    type="button"
                    className="px-3 py-1 text-xs"
                    disabled={updating}
                    onClick={() => approve(row.id)}
                  >
                    Approve
                  </Button>
                ),
              },
            ]}
            data={rows}
            emptyLabel="No volunteers pending approval."
          />
        )}
      </Card>
    </DashboardLayout>
  )
}

