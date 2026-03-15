import { FloatingNavButton } from '@/src/components/ui/FloatingNavButton'
import { CategoryManager } from '@/src/features/categories/components/CategoryManager'

export default function RecordPage() {
  return (
    <main className="min-h-screen bg-white">
      <CategoryManager />
      <FloatingNavButton />
    </main>
  )
}
