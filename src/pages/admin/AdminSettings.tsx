import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Settings</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">Configure your store preferences and system parameters.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your main store information</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Store Name</label>
                  <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value="Al-Faisaliah Store" readOnly />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Support Email</label>
                  <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value="admin@alfaisaliah.com" readOnly />
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Advanced tools and database management</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border/50 bg-muted/20">
               <span className="text-muted-foreground flex items-center gap-2">
                 <Settings className="h-5 w-5" /> Maintenance Mode active
               </span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
