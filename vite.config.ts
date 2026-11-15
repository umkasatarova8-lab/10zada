import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0]
const isUserOrOrgPage = repository && owner && repository.toLowerCase() === `${owner}.github.io`.toLowerCase()
const base = process.env.GITHUB_ACTIONS ? (isUserOrOrgPage ? '/' : `/${repository ?? 'group-chat'}/`) : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
