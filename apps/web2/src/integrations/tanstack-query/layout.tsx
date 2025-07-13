import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function LayoutAddition() {
  return (
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
  )
}
