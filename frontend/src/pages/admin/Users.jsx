import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Table from '../../components/Table.jsx'
import Loader from '../../components/Loader.jsx'
import { adminService } from '../../services/adminService.js'

export default function Users() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminService.users()
        setRows(data || [])
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            All Users
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Overview of all users in the EduReach platform
          </p>
        </div>

        <Card>
          {loading ? (
            <Loader />
          ) : (
            <Table
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
                { key: 'role', header: 'Role' },
              ]}
              data={rows}
              emptyLabel="No users found"
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
