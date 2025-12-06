import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

interface WiFiPost {
  id: number
  date: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>
  }
}

const FEED_URL =
  import.meta.env.VITE_NEWS_FEED_URL ||
  'https://viceinvestigacion.unf.edu.pe/wp-json/wp/v2/posts?per_page=5&_embed'

export function NewsFeed() {
  const { data, isLoading, isError } = useQuery<WiFiPost[]>({
    queryKey: ['wp-news'],
    queryFn: async () => {
      const response = await fetch(FEED_URL)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className='flex h-full flex-col gap-4 p-6'>
        <Skeleton className='h-8 w-1/2' />
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex gap-4'>
              <Skeleton className='h-24 w-24 rounded-lg' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-3 w-1/4' />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='flex h-full items-center justify-center p-6 text-center text-muted-foreground'>
        <p>No se pudieron cargar las noticias recientes.</p>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col bg-sidebar p-6 text-sidebar-foreground'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold tracking-tight'>
          Noticias y Eventos
        </h2>
        <p className='text-sm text-muted-foreground'>
          Mantente informado con las últimas actualizaciones.
        </p>
      </div>

      <ScrollArea className='flex-1 pr-4'>
        <div className='space-y-4'>
          {data.map((post) => {
            const imageUrl =
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url

            return (
              <a
                key={post.id}
                href={post.link}
                target='_blank'
                rel='noopener noreferrer'
                className='block'
              >
                <Card className='group overflow-hidden border-sidebar-border bg-sidebar-accent/50 transition-all hover:bg-sidebar-accent hover:shadow-md'>
                  <div className='flex flex-col sm:flex-row'>
                    {imageUrl && (
                      <div className='relative h-48 w-full sm:h-auto sm:w-32 shrink-0 overflow-hidden'>
                        <img
                          src={imageUrl}
                          alt={post.title.rendered}
                          className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                          loading='lazy'
                        />
                      </div>
                    )}
                    <div className='flex flex-1 flex-col p-4'>
                      <h3
                        className='mb-2 line-clamp-2 text-base font-semibold leading-tight group-hover:text-primary transition-colors'
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                      <div
                        className='line-clamp-2 text-sm text-muted-foreground'
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt.rendered,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </a>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
