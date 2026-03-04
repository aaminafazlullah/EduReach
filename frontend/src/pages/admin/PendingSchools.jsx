import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Table from '../../components/Table.jsx'
import Button from '../../components/Button.jsx'
import Loader from '../../components/Loader.jsx'
import { adminService } from '../../services/adminService.js'

export default function PendingSchools() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await adminService.pending()
      setRows(data?.schools || [])
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (schoolId) => {
    setUpdating(true)
    try {
      await adminService.approveSchool({ schoolId })
      await load()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <DashboardLayout>
      <Card
        title="Pending schools"
        description="Review and approve school applications."
      >
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={[
              { key: 'name', header: 'School' },
              { key: 'district', header: 'District' },
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
            emptyLabel="No schools pending approval."
          />
        )}
      </Card>
    </DashboardLayout>
  )
}

