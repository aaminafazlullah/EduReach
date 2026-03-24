import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import Button from '../../components/Button.jsx'
import Input from '../../components/Input.jsx'
import { volunteerService } from '../../services/volunteerService.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Flexible']
const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
  'Any',
]

export default function VolunteerProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  
  const [searchParams, setSearchParams] = useSearchParams()
  const isEditing = searchParams.get('mode') === 'edit'

  // Form details
  const [name, setName] = useState('')
  const [email, setEmail] = useState('') 
  const [phone, setPhone] = useState('')
  const [expertise, setExpertise] = useState('')
  const [skills, setSkills] = useState('')
  
  // Array of availability objects
  const [availability, setAvailability] = useState([])

  const loadProfile = async () => {
    try {
      const { data } = await volunteerService.getProfile()
      const p = data?.data
      setProfile(p || null)
      if (p) {
        setName(p.user_id?.name || '')
        setEmail(p.user_id?.email || '')
        setPhone(p.user_id?.phone || '')
        setExpertise(p.expertise?.join(', ') || '')
        setSkills(p.skills?.join(', ') || '')
        setAvailability(p.availability?.length ? p.availability : [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleAddAvailability = () => {
    setAvailability([...availability, { day: 'Flexible', timeSlot: 'Any' }])
  }

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability]
    updated[index][field] = value
    setAvailability(updated)
  }

  const handleRemoveAvailability = (index) => {
    setAvailability(availability.filter((_, i) => i !== index))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setStatusMessage('')
    try {
      const parsedExpertise = expertise.split(',').map(s => s.trim()).filter(Boolean)
      const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean)
      
      await volunteerService.updateProfile({ 
        name, 
        phone,
        expertise: parsedExpertise, 
        skills: parsedSkills, 
        availability 
      })
      setStatusMessage('Profile details updated successfully!')
      setSearchParams({ mode: 'view' })
      loadProfile()
    } catch (err) {
      setStatusMessage('Failed to update profile.')
    } finally {
      setUpdating(false)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadId = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a file to upload first.')
      return
    }

    setUpdating(true)
    setStatusMessage('')
    try {
      const formData = new FormData()
      formData.append('idProof', selectedFile)

      await volunteerService.uploadIdProof(formData)
      setStatusMessage('ID Proof uploaded and pending verification!')
      setSelectedFile(null)
      loadProfile()
    } catch (err) {
      setStatusMessage(err.response?.data?.message || 'Failed to upload ID.')
    } finally {
      setUpdating(false)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  const getStatusBadge = (isVerified) => {
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        isVerified
          ? 'bg-green-light text-green'
          : 'bg-accent-light text-accent'
      }`}>
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current"></span>
        {isVerified ? 'Verified' : 'Pending'}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink mb-2">
              {isEditing ? 'Edit Profile' : 'My Profile'}
            </h1>
            <p className="font-sans text-sm text-ink-2">
              Manage your volunteer information and availability
            </p>
          </div>
          <Button
            onClick={() => setSearchParams({ mode: isEditing ? 'view' : 'edit' })}
            variant={isEditing ? 'outline' : 'primary'}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`rounded-md p-4 ${
            statusMessage.includes('successfully') 
              ? 'bg-green-light text-green' 
              : 'bg-red-light text-red'
          }`}>
            <p className="font-sans text-sm">{statusMessage}</p>
          </div>
        )}
        
        {loading ? (
          <Card>
            <Loader />
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Details Card */}
              <Card>
                <div className="mb-6">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Personal & Volunteer Details
                  </h2>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Input
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-surface-2"
                      />
                    </div>

                    <Input
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="numeric"
                      required
                    />
                    
                    <div className="border-t border-border pt-6">
                      <Input
                        label="Expertise"
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value)}
                        placeholder="Science, Mentoring, Event Organization"
                      />
                      <p className="font-sans mt-1 text-xs text-ink-2">
                        Comma separated subjects or domains
                      </p>
                    </div>

                    <Input
                      label="Skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Math, English, Art, Leadership"
                    />
                    <p className="font-sans mt-1 text-xs text-ink-2">
                      Comma separated skills
                    </p>

                    <div className="flex justify-end pt-6">
                      <Button
                        type="submit"
                        loading={updating}
                        disabled={updating}
                      >
                        {updating ? 'Saving...' : 'Save Profile Details'}
                      </Button>
                    </div>
                    </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-wide text-ink-2">Full Name</p>
                        <p className="font-sans mt-1 text-sm text-ink">{name || '-'}</p>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-wide text-ink-2">Email</p>
                        <p className="font-sans mt-1 text-sm text-ink">{email || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-sans text-xs font-medium uppercase tracking-wide text-ink-2">Phone Number</p>
                      <p className="font-sans mt-1 text-sm text-ink">{phone || '-'}</p>
                    </div>
                    
                    <div className="border-t border-border pt-6">
                      <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-wide text-ink-2">Expertise</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {expertise ? (
                            expertise.split(',').map((item, idx) => (
                              <span key={idx} className="rounded-lg bg-accent-light px-3 py-1 text-xs font-medium text-accent">
                                {item.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="font-sans text-sm text-ink-2 italic">No expertise listed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="font-sans text-xs font-medium uppercase tracking-wide text-ink-2">Skills</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills ? (
                          skills.split(',').map((item, idx) => (
                            <span key={idx} className="rounded-lg bg-accent-light px-3 py-1 text-xs font-medium text-accent">
                              {item.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="font-sans text-sm text-ink-2 italic">No skills listed</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Right Sidebar */}
              <div className="space-y-8">
              {/* Availability Card */}
              <Card>
                <div className="mb-6">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Availability Schedule
                  </h2>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <p className="font-sans text-sm font-medium text-ink mb-3">
                      Your preferred time slots
                    </p>
                    
                    {availability.length > 0 ? (
                      availability.map((slot, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <select
                            value={slot.day}
                            onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                            className="rounded-md bg-surface border border-border px-3 py-2 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20"
                          >
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <select
                            value={slot.timeSlot}
                            onChange={(e) => handleAvailabilityChange(index, 'timeSlot', e.target.value)}
                            className="flex-1 rounded-md bg-surface border border-border px-3 py-2 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20"
                          >
                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveAvailability(index)}
                            className="text-xs"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="font-sans text-sm text-ink-2 italic">No availability slots added yet.</p>
                    )}
                    
                    <Button
                      onClick={handleAddAvailability}
                      className="w-full mt-3"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Time Slot
                    </Button>
                  </div>
                ) : (
                  <div>
                    {availability.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {availability.map((slot, idx) => (
                          <div key={idx} className="rounded-lg bg-accent-light px-3 py-2 text-sm font-medium text-accent">
                            <span className="font-semibold">{slot.day}</span>
                            <span className="mx-1">|</span>
                            <span>{slot.timeSlot}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-sans text-sm text-ink-2 italic">No availability specified.</p>
                    )}
                  </div>
                )}
              </Card>

              {/* Verification Status Card */}
              <Card>
                <div className="mb-6">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Verification Status
                  </h2>
                </div>

                <div className="text-center">
                  <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                    profile?.isVerified ? 'bg-green-light text-green' : 'bg-accent-light text-accent'
                  }`}>
                    {profile?.isVerified ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.464 0-1.797-1.667-3.464 0L3.34 16c-.77 1.333-2.694 1.333-3.464 0L3.34 16c-.77 1.333.192 3.464 0L13.732 4c.77 1.333 2.694 1.333 3.464 0" />
                      </svg>
                    )}
                  </div>
                  
                  {getStatusBadge(profile?.isVerified)}
                  
                  <div className="mt-4">
                    <p className="font-sans text-sm font-medium text-ink">
                      {profile?.isVerified ? 'Verified Account' : 'Action Required'}
                    </p>
                    <p className="font-sans mt-1 text-xs text-ink-2">
                      {profile?.isVerified ? 'You have full access to all features.' : 'Your identity is pending verification.'}
                    </p>
                  </div>
                </div>

                {/* ID Upload Section */}
                {!profile?.isVerified && profile?.idProofStatus !== 'pending' && profile?.idProofStatus !== 'approved' && (
                  <div className="border-t border-border pt-6">
                    <p className="font-sans text-sm text-ink-2 mb-4">
                      Upload a valid government-issued ID proof to complete verification
                    </p>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, application/pdf"
                        className="text-sm"
                      />
                      <Button
                        onClick={handleUploadId}
                        loading={updating}
                        disabled={updating || !selectedFile}
                        className="w-full"
                      >
                        {updating ? 'Uploading...' : 'Upload ID Document'}
                      </Button>
                    </div>
                  </div>
                )}

                {profile?.idProofStatus === 'pending' && !profile?.isVerified && (
                  <div className="border-t border-border pt-6">
                    <div className="rounded-md bg-blue-light p-4">
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 001-1V9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h3 className="font-sans text-sm font-medium text-blue">Verification Pending</h3>
                          <p className="font-sans mt-1 text-xs text-blue">
                            Your ID proof is under review. Please check back later.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {profile?.idProofStatus === 'rejected' && !profile?.isVerified && (
                  <div className="border-t border-border pt-6">
                    <div className="rounded-md bg-red-light p-4">
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.464 0-1.797-1.667-3.464 0L3.34 16c-.77 1.333-2.694 1.333-3.464 0L3.34 16c-.77 1.333.192 3.464 0L13.732 4c.77 1.333 2.694 1.333 3.464 0" />
                        </svg>
                        <div>
                          <h3 className="font-sans text-sm font-medium text-red">Verification Rejected</h3>
                          <p className="font-sans mt-1 text-xs text-red">
                            Please upload a clear and valid document.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
