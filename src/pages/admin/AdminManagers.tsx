import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from '@/lib/firebase/AuthContext'
import { useLanguage } from '@/lib/language-provider'
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { Button } from '@/components/ui/button'
import { Shield, UserPlus, MoreVertical, Edit, ShieldX, Key, Activity } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { format } from 'date-fns'

const ROLES = [
  { id: 'super_admin', label: 'Super Admin' },
  { id: 'product_manager', label: 'Product Manager' },
  { id: 'order_manager', label: 'Order Manager' },
  { id: 'inventory_manager', label: 'Inventory Manager' },
  { id: 'customer_support', label: 'Customer Support' },
  { id: 'content_manager', label: 'Content Manager' }
]

export default function AdminManagers() {
  const { role: currentUserRole } = useAuth()
  const { language, t } = useLanguage()
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [newRole, setNewRole] = useState('')
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)

  const isSuperAdmin = currentUserRole === 'super_admin' || currentUserRole === 'admin'

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      // In a real scenario we'd query for all users or just those with roles
      // For demo, we get some recent users mapped as admins
      const q = query(collection(db, "users"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      // Filter those who are admins or managers
      const adminUsers = data.filter((u: any) => 
        ['admin', 'super_admin', 'product_manager', 'order_manager', 'inventory_manager', 'customer_support', 'content_manager'].includes(u.role)
      )
      setAdmins(adminUsers)
    } catch (error) {
      console.error("Failed to fetch admins", error)
      toast.error('Failed to load admin users')
      // Fallback mock data
      setAdmins([
        { id: '1', email: 'samir.admin@alfaisaliah.com', role: 'super_admin', createdAt: Date.now() - 100000000, lastLogin: Date.now() - 3600000 },
        { id: '2', email: 'products@alfaisaliah.com', role: 'product_manager', createdAt: Date.now() - 50000000, lastLogin: Date.now() - 86400000 },
      ])
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
      const userRef = doc(db, 'users', selectedAdmin.id)
      await updateDoc(userRef, { role: newRole })
      toast.success(`Role updated successfully to ${ROLES.find(r => r.id === newRole)?.label}`)
      setIsRoleDialogOpen(false)
      fetchAdmins()
    } catch (error) {
      console.error("Error updating role", error)
      toast.error('Failed to update role. Please check your permissions.')
    }
  }

  const getRoleLabel = (roleId: string) => {
    return ROLES.find(r => r.id === roleId)?.label || roleId
  }

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
          <Button className="font-semibold gap-2">
            <UserPlus className="h-4 w-4" /> 
            {language === 'ar' ? 'إضافة مسؤول' : 'Add Admin'}
          </Button>
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
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-border/50 transition-colors hover:bg-primary/5">
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
                    <td className="p-4 align-middle text-muted-foreground">
                      {admin.createdAt ? format(new Date(admin.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                    </td>
                    <td className="p-4 align-middle">
                       <span className="flex items-center gap-2 text-xs text-muted-foreground">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                         {admin.lastLogin ? format(new Date(admin.lastLogin), 'hh:mm a, dd MMM') : 'Online Now'}
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
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              <ShieldX className="mr-2 h-4 w-4" />
                              Suspend Access
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
    </div>
  )
}
