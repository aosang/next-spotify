import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}


const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  disabled,
  ...props
}, ref) => {
  if (type === 'file') {
    return (
      <div className="relative">
        <input
          type={type}
          className={twMerge('absolute inset-0 w-full h-full opacity-0 cursor-pointer', className)}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div className="w-full flex rounded-md bg-neutral-700 border border-transparent px-3 py-3 text-sm text-neutral-400">
          <span className="text-white">Choose File</span>
        </div>
      </div>
    )
  }

  return (
    <input
      type={type}
      className={twMerge('w-full flex rounded-md bg-neutral-700 border border-transparent px-3 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none', className)}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
})


Input.displayName = 'Input'

export default Input