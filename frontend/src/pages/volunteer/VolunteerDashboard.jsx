import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import Modal from '../../components/Modal.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { volunteerService } from '../../services/volunteerService.js'

export default function VolunteerDashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('Good morning')
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false)

  const loadProfile = async () => {
    try {
      const { data } = await volunteerService.getProfile()
      setProfile(data?.data || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()

    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    )
  }

  const hours = profile?.hoursContributed || 0
  const userName = profile?.user_id?.name || profile?.firstName || 'Volunteer'

  const getBadgeInfo = (h) => {
    if (h >= 50) return { name: 'Super Volunteer', color: 'text-purple', icon: '🏆' }
    if (h >= 30) return { name: 'Community Hero', color: 'text-blue', icon: '🌟' }
    if (h >= 10) return { name: 'Rising Star', color: 'text-accent', icon: '⭐' }
    return { name: 'Beginner', color: 'text-ink-2', icon: '🌱' }
  }

  const badgeInfo = getBadgeInfo(hours)

  const profileStatusText = profile?.isVerified 
    ? 'Verified' 
    : profile?.idProofStatus === 'pending' 
      ? 'Pending' 
      : 'Incomplete'
      
  const profileStatusColor = profile?.isVerified 
    ? 'text-green' 
    : profile?.idProofStatus === 'pending' 
      ? 'text-accent' 
      : 'text-red'

  const actionCards = [
    { 
      label: "Find Events", 
      path: "/volunteer/events", 
      description: "Discover volunteer opportunities",
      icon: "🔍",
      color: "bg-accent"
    },
    { 
      label: "My Profile", 
      path: "/volunteer/profile", 
      description: "Manage your volunteer profile",
      icon: "👤",
      color: "bg-green"
    },
    { 
      label: "My Events", 
      path: "/volunteer/my-events", 
      description: "View your registered events",
      icon: "📅",
      color: "bg-blue"
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            {greeting}, {userName}!
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Here's your impact overview today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card accent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sans text-sm font-medium text-ink-2">Hours Contributed</h3>
                <p className="font-display mt-2 text-3xl font-bold text-accent">
                  {hours} hrs
                </p>
              </div>
              <div className="rounded-lg bg-accent-light p-2">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card accent className="p-6 cursor-pointer hover:shadow-elevated transition-shadow duration-200" onClick={() => setIsBadgeModalOpen(true)}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sans text-sm font-medium text-ink-2">Current Badge</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-2xl">{badgeInfo.icon}</span>
                  <p className={`font-display text-xl font-bold ${badgeInfo.color}`}>
                    {badgeInfo.name}
                  </p>
                </div>
                <p className="font-sans mt-1 text-xs text-ink-2">
                  Click for details
                </p>
              </div>
              <div className="rounded-lg bg-accent-light p-2">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card accent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sans text-sm font-medium text-ink-2">Profile Status</h3>
                <p className={`font-display mt-2 text-xl font-bold ${profileStatusColor}`}>
                  {profileStatusText}
                </p>
                {!profile?.isVerified && (
                  <Link to="/volunteer/profile">
                    <Button variant="outline" className="mt-2 text-xs">
                      Complete Profile
                    </Button>
                  </Link>
                )}
              </div>
              <div className="rounded-lg bg-accent-light p-2">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          {actionCards.map((item) => (
            <Link to={item.path} key={item.label}>
              <Card className="border-0 bg-surface-2 hover:shadow-elevated transition-shadow duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg ${item.color} p-3`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {item.label}
                    </h3>
                    <p className="font-sans mt-1 text-sm text-ink-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Activity Card */}
        <Card className="bg-surface-2 border-0">
          <div className="text-center py-8">
            <svg className="mx-auto mb-4 h-16 w-16 text-ink-2/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-display text-lg font-semibold text-ink mb-2">
              Ready to make an impact?
            </h3>
            <p className="font-sans text-sm text-ink-2 mb-6">
              Explore volunteer opportunities and start contributing to education
            </p>
            <Link to="/volunteer/events">
              <Button>
                Explore Events
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Badge Details Modal */}
      <Modal open={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} title="Badge Criteria">
        <div className="space-y-4">
          <p className="font-sans text-sm text-ink">
            Earn badges by volunteering and recording your hours! Here's the breakdown:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌱</span>
                <span className="font-sans font-medium text-ink">Beginner</span>
              </div>
              <span className="font-sans text-sm text-ink-2">0 - 9 hours</span>
            </div>
            
            <div className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <span className="font-sans font-medium text-accent">Rising Star</span>
              </div>
              <span className="font-sans text-sm text-ink-2">10 - 29 hours</span>
            </div>
            
            <div className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌟</span>
                <span className="font-sans font-medium text-blue">Community Hero</span>
              </div>
              <span className="font-sans text-sm text-ink-2">30 - 49 hours</span>
            </div>
            
            <div className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <span className="font-sans font-medium text-purple">Super Volunteer</span>
              </div>
              <span className="font-sans text-sm text-ink-2">50+ hours</span>
            </div>
          </div>
          
          <div className="rounded-md bg-accent-light p-4 text-center">
            <p className="font-sans text-sm text-accent">
              You currently have <span className="font-bold">{hours} hrs</span> and hold the 
              <strong> {badgeInfo.name}</strong> badge!
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
