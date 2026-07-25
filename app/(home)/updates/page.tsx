import { readFile } from 'fs/promises'
import path from 'path'
import UpdatesView from '@/components/updates/UpdatesView'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import { parseYAML, type Update } from '@/lib/updates'

async function loadUpdates(): Promise<Update[]> {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'updates', 'updates.yaml')
    const text = await readFile(filePath, 'utf-8')
    return parseYAML(text).sort(
      (a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime()
    )
  } catch {
    return []
  }
}

export default async function UpdatesPage() {
  const updates = await loadUpdates()
  return (
    <>
      <Navbar />
      <UpdatesView updates={updates} />
      <Footer />
    </>
  )
}
