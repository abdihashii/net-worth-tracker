import { isMatch, Link, useMatches } from '@tanstack/react-router'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const Breadcrumbs = () => {
  const matches = useMatches()

  if (matches.some((match) => match.status === 'pending')) return null

  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, 'loaderData.crumb'),
  )

  if (matchesWithCrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matchesWithCrumbs.map((match, i) => {
          const isLast = i === matchesWithCrumbs.length - 1

          return (
            <>
              <BreadcrumbItem
                key={match.id}
                className={i === 0 ? 'hidden md:block' : undefined}
              >
                {isLast ? (
                  <BreadcrumbPage>{match.loaderData?.crumb}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link from={match.fullPath} to={match.fullPath}>
                      {match.loaderData?.crumb}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator
                  className={i === 0 ? 'hidden md:block' : undefined}
                />
              )}
            </>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
