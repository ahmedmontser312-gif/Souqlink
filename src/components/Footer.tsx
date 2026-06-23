import { Store } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <span className="font-semibold">SouqLink</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 SouqLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
