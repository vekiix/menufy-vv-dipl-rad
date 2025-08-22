// components/ui/multi-select.tsx
import * as React from "react"
import * as Popover from "@radix-ui/react-popover"
import * as Checkbox from "@radix-ui/react-checkbox"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils/utils"

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  id?: string
  placeholder?: string
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  placeholder = "Select...",
  options,
  selected,
  onChange,
  className,
}) => {
  const toggleValue = (value: string) => {
    console.log(selected)
    console.log(value)
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
    console.log(selected)

  }

  const displayValue =
    selected.length === 0
      ? placeholder
      : options
          .filter((opt) => selected.includes(opt.value))
          .map((opt) => opt.label)
          .join(", ")

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            className
          )}
        >
          <span className="truncate text-left">{displayValue}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-2 shadow-md z-50"
        align="start"
        sideOffset={4}
      >
        <div className="flex flex-col space-y-1 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded-md cursor-pointer text-sm"
            >
              <Checkbox.Root
                checked={selected.includes(option.value)}
                onCheckedChange={() => toggleValue(option.value)}
                className="h-4 w-4 rounded border border-muted-foreground flex items-center justify-center data-[state=checked]:bg-primary"
              >
                <Checkbox.Indicator>
                  <Check className="h-3 w-3 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              {option.label}
              <p className="text-xs">({option.value})</p>
            </label>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
