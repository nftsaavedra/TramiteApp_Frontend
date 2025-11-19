import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DateRangeFilterProps {
  date?: DateRange
  onDateChange: (range: DateRange | undefined) => void
  type: 'documento' | 'registro'
  onTypeChange: (type: 'documento' | 'registro') => void
}

export function DateRangeFilter({
  date,
  onDateChange,
  type,
  onTypeChange,
}: DateRangeFilterProps) {
  return (
    <div className='flex items-center gap-2'>
      {/* Selector de Contexto (Negocio vs Auditoría) */}
      <Select
        value={type}
        onValueChange={(val) => onTypeChange(val as 'documento' | 'registro')}
      >
        <SelectTrigger className='h-8 w-[150px] text-xs'>
          <SelectValue placeholder='Tipo de fecha' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='documento'>📅 Fecha Documento</SelectItem>
          <SelectItem value='registro'>💻 Fecha Registro</SelectItem>
        </SelectContent>
      </Select>

      {/* Picker de Calendario */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            size='sm'
            className={cn(
              'h-8 w-[230px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/y', { locale: es })} -{' '}
                  {format(date.to, 'dd/MM/y', { locale: es })}
                </>
              ) : (
                format(date.from, 'dd/MM/y', { locale: es })
              )
            ) : (
              <span>Seleccionar fechas...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            autoFocus // CORREGIDO: 'initialFocus' está deprecado
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>

      {/* Botón X para limpiar solo fechas si hay selección */}
      {date && (
        <Button
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0'
          onClick={() => onDateChange(undefined)}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Limpiar fechas</span>
        </Button>
      )}
    </div>
  )
}
