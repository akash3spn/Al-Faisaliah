import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from '@/lib/firebase/AuthContext'
import { useLanguage } from '@/lib/language-provider'
import { collection, query, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { Button } from '@/components/ui/button'
import { Shield, UserPlus, MoreVertical, Edit, ShieldX, Key, Activity, Search, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { format } from 'date-fns'

const ROLES = [
  { id: 'super_admin', label: 'Super Admin' },
  { id: 'admin', label: 'Admin' }
]

export default function AdminManagers() {
  const { role: currentUserRole } = useAuth()
  const { language, t } = useLanguage()
  const [admins, setAdmins] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [newRole, setNewRole] = useState('')
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState('')

  const isSuperAdmin = currentUserRole === 'super_admin' || currentUserRole === 'admin'

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "admins"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAdmins(data)
    } catch (error) {
      console.error("Failed to fetch admins", error)
      toast.error('Failed to load admin users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleUpdateRole = async () => {
    if (!selectedAdmin || !newRole) return
    if (!isSuperAdmin) {
      toast.error('Unauthorized. Only Super Admin can change roles.')
      return
    }

    try {
      const authRef = doc(db, 'admins', selectedAdmin.email)
      await updateDoc(authRef, { role: newRole })
      toast.success(`Role updated successfully to ${ROLES.find(r => r.id === newRole)?.label}`)
      setIsRoleDialogOpen(false)
      fetchAdmins()
    } catch (error) {
      console.error("Error updating role", error)
      toast.error('Failed to update role. Please check your permissions.')
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminRole) return
    if (!isSuperAdmin) {
      toast.error('Unauthorized')
      return
    }

    try {
      const authAdminRef = doc(db, 'admins', newAdminEmail.toLowerCase())
      await setDoc(authAdminRef, { 
        email: newAdminEmail.toLowerCase(), 
        fullName: newAdminEmail.toLowerCase().split('@')[0],
        role: newAdminRole,
        status: 'active',
        createdAt: Date.now(),
        addedBy: currentUserRole,
        lastLogin: null,
        uid: null
      })
      toast.success('Admin authorized successfully')
      setIsAddAdminDialogOpen(false)
      setNewAdminEmail('')
      setNewAdminRole('')
      fetchAdmins()
    } catch (error) {
      console.error("Error adding admin", error)
      toast.error('Failed to add admin')
    }
  }

  const handleSuspendAdmin = async (admin: any) => {
    if (!isSuperAdmin) return;
    if (admin.email === 'kalaazim@gmail.com') {
      toast.error('Cannot suspend the permanent Super Admin.');
      return;
    }
    
    try {
      const authRef = doc(db, 'admins', admin.email)
      const newStatus = admin.status === 'suspended' ? 'active' : 'suspended';
      await updateDoc(authRef, { status: newStatus })
      toast.success(`Admin ${newStatus} successfully`)
      fetchAdmins()
    } catch (error) {
      console.error("Error updating status", error)
      toast.error('Failed to update status')
    }
  }

  const handleRemoveAdmin = async (admin: any) => {
    if (!isSuperAdmin) return;
    if (admin.email === 'kalaazim@gmail.com') {
      toast.error('Cannot remove the permanent Super Admin.');
      return;
    }
    
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المسؤول؟' : 'Are you sure you want to remove this admin?')) {
      try {
        const authRef = doc(db, 'admins', admin.email)
        await deleteDoc(authRef)
        toast.success(language === 'ar' ? 'تم حذف المسؤول بنجاح' : 'Admin removed successfully')
        fetchAdmins()
      } catch (error) {
        console.error("Error removing admin", error)
        toast.error('Failed to remove admin')
      }
    }
  }

  const getRoleLabel = (roleId: string) => {
    return ROLES.find(r => r.id === roleId)?.label || roleId
  }

  const filteredAdmins = admins.filter(a => a.email?.toLowerCase().includes(searchQuery.toLowerCase()) || a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {language === 'ar' ? 'إدارة المسؤولين' : 'Admin Management'}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">
            {language === 'ar' ? 'التحكم في وصول النظام وإدارة الحسابات.' : 'Control system access and manage administrator accounts.'}
          </p>
        </div>
        
        {isSuperAdmin && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={language === 'ar' ? 'البحث عن مسؤول...' : "Search admins..."} 
                className="pl-9 w-[200px] lg:w-[250px] bg-card text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="font-semibold gap-2" onClick={() => setIsAddAdminDialogOpen(true)}>
              <UserPlus className="h-4 w-4" /> 
              {language === 'ar' ? 'إضافة مسؤول' : 'Add Admin'}
            </Button>
          </div>
        )}
      </div>

      <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'المسؤولون النشطون' : 'Active Administrators'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' ? 'الأعضاء الذين لديهم حق الوصول إلى لوحة القيادة هذه.' : 'Members with access to this dashboard.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto text-sm">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b border-border/50 bg-muted/20">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-right ltr:text-left">
                    {language === 'ar' ? 'المستخدم' : 'User'}
                  </th>
                  <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-right ltr:text-left">
                    {language === 'ar' ? 'الدور' : 'Role'}
                  </th>
                  <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-right ltr:text-left">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-right ltr:text-left">
                    {language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}
                  </th>
                  <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-right ltr:text-left">
                    {language === 'ar' ? 'آخر نشاط' : 'Last Activity'}
                  </th>
                  <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-left ltr:text-right">
                    {language === 'ar' ? 'إجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id || admin.email} className="border-b border-border/50 transition-colors hover:bg-primary/5">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <span className="text-primary font-bold text-xs uppercase">{admin.email?.[0] || 'U'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{admin.email}</span>
                          <span className="text-xs text-muted-foreground">ID: {admin.uid || admin.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-wider ${admin.role === 'super_admin' ? 'border-primary text-primary' : 'border-border/50'}`}>
                        {getRoleLabel(admin.role)}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-wider ${admin.status === 'suspended' ? 'border-red-500 text-red-500' : 'border-primary text-primary'}`}>
                        {admin.status === 'suspended' ? 'Suspended' : 'Active'}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {admin.createdAt ? format(new Date(admin.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                    </td>
                    <td className="p-4 align-middle">
                       <span className="flex items-center gap-2 text-xs text-muted-foreground">
                         <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)] ${admin.status === 'suspended' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                         {admin.lastLogin ? format(new Date(admin.lastLogin), 'hh:mm a, dd MMM') : 'Never Logged In'}
                       </span>
                    </td>
                    <td className="p-4 align-middle rtl:text-left ltr:text-right">
                      {isSuperAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className={language === 'ar' ? 'font-arabic' : 'font-sans'}>
                            <DropdownMenuLabel>Manage Admin</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedAdmin(admin); setIsRoleDialogOpen(true); }}>
                              <Key className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="mr-2 h-4 w-4" />
                              View Activity Log
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-amber-500 focus:text-amber-500" onClick={() => handleSuspendAdmin(admin)}>
                              <ShieldX className="mr-2 h-4 w-4" />
                              {admin.status === 'suspended' ? 'Reactivate Access' : 'Suspend Access'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleRemoveAdmin(admin)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              {language === 'ar' ? 'حذف المسؤول' : 'Remove Admin'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className={language === 'ar' ? 'font-arabic' : 'font-sans'}>
          <DialogHeader>
            <DialogTitle>Change Admin Role</DialogTitle>
            <DialogDescription>
              Assigning a new role will immediately update the user's permissions across the system.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected User</label>
              <div className="p-3 bg-muted/50 rounded-md border border-border/50 text-sm">
                {selectedAdmin?.email}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select onValueChange={setNewRole} defaultValue={selectedAdmin?.role}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
             <Button onClick={handleUpdateRole} className="bg-primary text-black hover:bg-primary/90">Update Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
        <DialogContent className={language === 'ar' ? 'font-arabic' : 'font-sans'}>
          <DialogHeader>
            <DialogTitle>Authorize New Admin</DialogTitle>
            <DialogDescription>
              Enter the user's email address and select their role. Once authorized, they can log in at the admin portal.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input 
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 border rounded-md bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select onValueChange={setNewAdminRole} value={newAdminRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsAddAdminDialogOpen(false)}>Cancel</Button>
             <Button onClick={handleAddAdmin} className="bg-primary text-black hover:bg-primary/90">Authorize Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
