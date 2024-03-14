import {ButtonHTMLAttributes, forwardRef} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const FormButton = forwardRef<HTMLButtonElement, ButtonProps>(
    (props) => <button className={"bg-blue-500 text-white px-3 py-2 rounded-md font-medium"} disabled={props.disabled} type={"submit"}>
        {props.disabled ? "Loading..." : "Odeslat"}
    </button>
)