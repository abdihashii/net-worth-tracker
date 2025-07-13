/**
 * React Query Error Boundary
 *
 * Provides consistent error handling for React Query errors across the application.
 * Uses TanStack Router's built-in error handling capabilities.
 */

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import React from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * Custom error component that works with TanStack Router
 */
export function QueryErrorFallback({ error, reset }: ErrorComponentProps) {
  const isNetworkError =
    error.message.toLowerCase().includes('network') ||
    error.message.toLowerCase().includes('fetch')

  const isServerError =
    error.message.includes('500') ||
    error.message.includes('Internal Server Error')

  const isNotFoundError =
    error.message.includes('404') || error.message.includes('Not Found')

  let title = 'Something went wrong'
  let description = 'An unexpected error occurred. Please try again.'
  let suggestion = 'Try refreshing the page or check your internet connection.'

  if (isNetworkError) {
    title = 'Connection Error'
    description = 'Unable to connect to our servers.'
    suggestion = 'Please check your internet connection and try again.'
  } else if (isServerError) {
    title = 'Server Error'
    description = 'Our servers are experiencing issues.'
    suggestion = 'Please try again in a few minutes.'
  } else if (isNotFoundError) {
    title = 'Data Not Found'
    description = 'The requested data could not be found.'
    suggestion = 'The data may have been moved or deleted.'
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>{suggestion}</AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset} className="flex-1" variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-32">
                {error.message}\n{error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Query Error Reset Boundary for resetting queries on error
 * Use this component to wrap parts of your app that use React Query
 */
export function QueryErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => <div>{children}</div>}
    </QueryErrorResetBoundary>
  )
}
