import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowUpRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'

interface WpPost {
  id: number
  date: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text?: string
    }>
  }
}

const FEED_URL =
  'https://viceinvestigacion.unf.edu.pe/wp-json/wp/v2/posts?per_page=5&_embed'

export function NewsFeed() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const { data, isLoading, isError } = useQuery<WpPost[]>({
    queryKey: ['wp-news'],
    queryFn: async () => {
      const response = await fetch(FEED_URL)
      if (!response.ok) throw new Error('Failed to fetch news')
      return response.json()
    },
    staleTime: 1000, // 1 Segundo
  })

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center p-8'>
        <div className='flex w-full max-w-sm flex-col gap-4'>
          <Skeleton className='aspect-square w-full rounded-xl bg-zinc-800' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-3/4 bg-zinc-800' />
            <Skeleton className='h-4 w-1/2 bg-zinc-800' />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className='flex h-full flex-col items-center justify-center text-center text-white/60'>
        <p className='text-lg font-medium'>No hay noticias disponibles</p>
        <p className='text-sm'>Intenta nuevamente más tarde</p>
      </div>
    )
  }

  return (
    <div className='flex w-full max-w-sm flex-col justify-center'>
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className='w-full'
      >
        <CarouselContent>
          {data.map((post) => {
            const imageUrl =
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url
            const date = new Date(post.date).toLocaleDateString('es-PE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            return (
              <CarouselItem key={post.id} className='basis-[92%] pl-4'>
                <div className='p-1'>
                  <a
                    href={post.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group block'
                  >
                    <Card className='relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-none shadow-2xl'>
                      {/* Floating Badge */}
                      <div className='absolute top-3 left-3 z-10'>
                        <Badge
                          variant='secondary'
                          className='border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm'
                        >
                          Noticia
                        </Badge>
                      </div>

                      {/* Background Image */}
                      {imageUrl ? (
                        <div className='absolute inset-0'>
                          <img
                            src={imageUrl}
                            alt={
                              post._embedded?.['wp:featuredmedia']?.[0]
                                ?.alt_text || 'Imagen'
                            }
                            className='h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105'
                            loading='lazy'
                          />
                          <div className='absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300' />
                        </div>
                      ) : (
                        <div className='absolute inset-0 bg-zinc-900' />
                      )}

                      {/* Content Overlay */}
                      <div className='absolute right-0 bottom-0 left-0 p-4'>
                        <div className='flex flex-col items-start gap-2'>
                          <h3
                            className='line-clamp-2 text-base leading-tight font-bold tracking-tight text-white shadow-black drop-shadow-sm md:text-lg'
                            dangerouslySetInnerHTML={{
                              __html: post.title.rendered,
                            }}
                          />

                          <div
                            className='line-clamp-2 text-[10px] text-zinc-200/90 sm:text-xs'
                            dangerouslySetInnerHTML={{
                              __html: post.excerpt.rendered,
                            }}
                          />

                          <div className='mt-1 flex w-full items-center justify-between'>
                            <div className='flex items-center gap-2 text-[10px] font-medium text-zinc-300 uppercase'>
                              <Calendar className='h-3 w-3' />
                              <time dateTime={post.date}>{date}</time>
                            </div>

                            <Button
                              size='icon'
                              className='h-7 w-7 rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black'
                            >
                              <ArrowUpRight className='h-3.5 w-3.5' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </a>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        {/* Indicators */}
        <div className='mt-4 flex justify-center gap-2'>
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                current === index + 1 ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
              )}
            />
          ))}
        </div>
      </Carousel>

      <div className='mt-8 text-center text-xs text-white/30'>
        <p>Copyright © {new Date().getFullYear()} VPIN-UNF</p>
      </div>
    </div>
  )
}
