import {forwardRef, InputHTMLAttributes} from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
    label?: string
}
const Input = forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => <input
        {...props}
        ref={ref}
        className={`w-72 border-2 p-1 rounded overflow-ellipsis ${props.disabled ? 'bg-gray-100' : 'bg-white'} ${props.error ? 'border-red-300' : 'border-gray-300'} ${props.className}`}
    />
)

const Label = forwardRef<HTMLInputElement, InputProps>(
    (props) => <label htmlFor={props.id}
                 className={"text-gray-500 font-bold block"}>{props.label}</label>
)

const Error = forwardRef<HTMLElement, InputProps>(
    ({error}) => <p className={"text-red-500 font-medium italic"}>{error}</p>
)

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
    ({ error, label, ...props }, ref) => (
        <div>
            {label && <Label {...props} label={label} />}
            <Input ref={ref} {...props}/>
            {error && <Error error={error} />}
        </div>
    )
);