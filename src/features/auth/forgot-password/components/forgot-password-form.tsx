import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { sleep, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    toast.promise(sleep(2000), {
      loading: 'Sending email...',
      success: () => {
        setIsLoading(false)
        setIsSubmitted(true)
        return `Email sent to ${data.email}`
      },
      error: 'Error',
    })
  }

  if (isSubmitted) {
    return (
      <div className='flex flex-col items-center justify-center space-y-4 py-4 text-center'>
        <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
          <ArrowRight className='h-6 w-6' />
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-medium'>Check your email</h3>
          <p className='text-muted-foreground text-sm'>
            We have sent a password reset link to <br />
            <span className='text-foreground font-medium'>
              {form.getValues('email')}
            </span>
          </p>
        </div>
        <Button
          className='w-full'
          variant='outline'
          onClick={() => setIsSubmitted(false)}
        >
          Try another email
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Continue
          {isLoading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
        </Button>
      </form>
    </Form>
  )
}
