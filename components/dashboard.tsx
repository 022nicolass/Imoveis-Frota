"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PropertiesList } from "@/components/properties-list"
import { PropertyView } from "@/components/property-view"
import { LogOut, Moon, Sun } from "lucide-react"

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Imóveis Frota</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {selectedPropertyId ? (
          <PropertyView propertyId={selectedPropertyId} onBack={() => setSelectedPropertyId(null)} />
        ) : (
          <PropertiesList onSelectProperty={setSelectedPropertyId} />
        )}
      </main>
    </div>
  )
}
