"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Menu, User, LogOut, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
  { name: "All", href: "/products" },
  { name: "Clothes", href: "/products?category=Clothes" },
  { name: "Electronics", href: "/products?category=Electronics" },
  { name: "Accessories", href: "/products?category=Accessories" },
  { name: "Home", href: "/products?category=Home" },
  { name: "Beauty", href: "/products?category=Beauty" },
  { name: "Sports", href: "/products?category=Sports" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const isLoggedIn = false

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SouqLink</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/merchant">My Store</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden border-t bg-background overflow-hidden transition-all duration-200",
          mobileMenuOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="container mx-auto px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          {!isLoggedIn && (
            <div className="flex flex-col gap-2 sm:hidden pt-2 border-t">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
