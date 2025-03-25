import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

import { Label } from "@/src/components/label"
import { cn } from "@/src/util/cn"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { tv } from "tailwind-variants"

type FieldMessageIntent = "error" | "success" | "warning"

interface FieldContextType {
  id: {
    root: string
    control: string
    description: string
    message: string
  }
  hasDescription?: boolean
  messages?: {
    id: string
    content?: React.ReactNode
    intent: FieldMessageIntent
  }[]
}

const FieldContext = createContext<FieldContextType | null>(null)

export const useFieldControl = ({
  props = {},
}: {
  element: "button" | "input" | "meter" | "output" | "progress" | "select" | "textarea"
  props?: { id?: string }
}) => {
  const context = useContext(FieldContext)
  const messageIntent = context?.messages?.[0]?.intent

  const ariaDescribedBy = [
    context?.hasDescription && context.id.description,
    messageIntent && context?.id.message,
  ].filter(Boolean)

  return context
    ? {
        props: {
          ...props,
          id: context.id.control,
          ...(ariaDescribedBy.length > 0 && {
            "aria-describedby": ariaDescribedBy.join(" "),
          }),
          ...(messageIntent === "error" ? { "aria-invalid": true } : {}),
        },
        messageIntent,
      }
    : { props }
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const message = tv({
  base: "[&>svg]:mt-xs flex gap-1 text-sm font-medium",
  variants: {
    intent: {
      error: "text-red-600",
      warning: "text-orange-800",
      success: "text-green-400",
    },
  },
})

type FieldRef = HTMLDivElement

export const Field = forwardRef(function FieldComponent(
  {
    id: customId,
    optional = false,
    disabled = false,
    intent: messageIntentProp = "error",
    omitLabel,
    label,
    children,
    description,
    ...props
  }: Pick<React.HTMLAttributes<FieldRef>, "id" | "className"> & {
    children: React.ReactNode
    label: React.ReactNode
    disabled?: boolean
    optional?: boolean
    omitLabel?: boolean
    description?: React.ReactNode
    message?: React.ReactNode
    intent?: FieldMessageIntent
  },
  ref: React.ForwardedRef<FieldRef>
) {
  const prefersReducedMotion = useReducedMotion()

  const [messages, setMessages] = useState<FieldContextType["messages"]>([])
  const previousMessages = usePrevious(messages)
  const [nextMessages, setNextMessages] = useState<FieldContextType["messages"]>([])

  const [animatePresenceMode, setAnimatePresenceMode] = useState<"popLayout" | "wait">(
    "wait"
  )

  const autoId = useId()
  const fieldId = customId || `field-${autoId}`

  const id = {
    root: fieldId,
    control: `${fieldId}-control`,
    description: `${fieldId}-description`,
    message: `${fieldId}-message`,
  }

  const hasMessage = typeof messages !== "undefined" && messages.length !== 0

  useEffect(() => {
    if (!props?.message) {
      setAnimatePresenceMode("wait")
      setNextMessages([])
      return
    }

    setAnimatePresenceMode(
      previousMessages && previousMessages?.length > 0 ? "popLayout" : "wait"
    )

    setNextMessages([
      {
        id: crypto.randomUUID(),
        content: props.message,
        intent: messageIntentProp,
      },
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.message, messageIntentProp])

  useEffect(() => {
    setMessages(nextMessages)
  }, [nextMessages])

  return (
    <FieldContext.Provider value={{ id, messages }}>
      <div
        data-field=""
        ref={ref}
        id={id.root}
        className="flex flex-col [--field-gap:theme(space.2)]"
      >
        <Label
          data-field-label=""
          htmlFor={id.control}
          id={id.description}
          omitLabel={omitLabel}
          disabled={disabled}
          optional={optional}
          className={cn(
            omitLabel && [
              "[&+[data-field-control]]:[--field-gap:0]",
              "[&+[data-field-description]]:[--field-gap:0]",
            ]
          )}
        >
          {label}
        </Label>

        <div
          id={id.description}
          data-field-description=""
          className={cn("text-text-secondary text-sm", !description && "hidden")}
        >
          {description}
        </div>

        <div data-field-control="" className="mt-[--field-gap]">
          {children}
        </div>

        <div
          data-field-message=""
          {...(hasMessage
            ? {
                "aria-live": "polite",
                className: cn(
                  "[&>svg]:will-change-[filter]",
                  {
                    popLayout: "mt-[--field-gap]",
                    wait: null,
                  }[animatePresenceMode]
                ),
              }
            : {})}
        >
          <AnimatePresence
            initial={previousMessages?.length === 0 ? false : undefined}
            mode={animatePresenceMode}
          >
            {messages?.map(
              (m) =>
                m?.content && (
                  <motion.div
                    ref={ref}
                    key={m.id}
                    id={id.message}
                    // Note: `will-change` is necessary to avoid SVGs "shaking" in Safari
                    initial={{
                      filter: "blur(4px)",
                      opacity: 0,
                      height: 0,
                      ...{
                        popLayout: {},
                        wait: { marginTop: 0, y: "var(--field-gap)" },
                      }[animatePresenceMode],
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      height: "auto",
                      ...{
                        popLayout: {},
                        wait: { marginTop: "var(--field-gap)", y: 0 },
                      }[animatePresenceMode],
                    }}
                    exit={{
                      filter: "blur(4px)",
                      opacity: 0,
                      height: 0,
                      ...{
                        popLayout: {},
                        wait: { marginTop: 0, y: "var(--field-gap)" },
                      }[animatePresenceMode],
                    }}
                    transition={
                      prefersReducedMotion ? { type: false } : { duration: 0.2 }
                    }
                  >
                    <div className={message({ intent: m.intent })}>
                      <span>{m.content}</span>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </FieldContext.Provider>
  )
})

Field.displayName = "Field"
