import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminCustomers() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Customers</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">View and manage your customer accounts.</p>
        </div>
      </div>

      <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="relative w-full sm:w-72">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input 
                 type="search" 
                 placeholder="Search customers..." 
                 className="pl-8 bg-background/50 border-border/50 focus-visible:ring-primary"
               />
             </div>
             <Button variant="outline" className="w-full sm:w-auto border-border/50 hover:bg-primary/10 hover:text-primary">
                <Filter className="mr-2 h-4 w-4" /> Filter
             </Button>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
             <Users className="h-12 w-12 text-primary/30 mb-4" />
             <p className="text-lg font-medium text-foreground">No customers found</p>
             <p className="max-w-md mt-2 text-sm">Customer data will populate here when users create accounts on the site.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
