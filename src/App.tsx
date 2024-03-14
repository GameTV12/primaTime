import {FormInput} from "./components/FormInput.tsx"
import { zodResolver } from "@hookform/resolvers/zod"
import {ComboBox} from "./components/ComboBox.tsx"
import { z } from "zod"
import {Controller, SubmitHandler, useForm} from "react-hook-form"
import {FormButton} from "./components/FormButton.tsx";

function App() {
    const schema = z.object({
        firstName: z.string().min(2, 'Alespon 2 symboly').max(80, "Příliš velké jméno"),
        university: z.string(),
    })

    type FormFields = z.infer<typeof schema>

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting},
        control,
        setValue
    } = useForm<FormFields>({
        defaultValues: {
            firstName: '',
            university: ''
        },
        resolver: zodResolver(schema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (data.university == '') {
            data.university = 'nevyplněno'
        }
        console.log(data)
        reset()
    }

    return (<div className={"container flex flex-col items-center"}>
        <div className={"p-2.5"}>
            <h1 className={"text-center text-xl mb-3"}>Formulář</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={"flex flex-col w-72 [&>*]:mb-3"}>
                    <FormInput
                        {...register("firstName")}
                        name={"firstName"}
                        type={"text"}
                        maxLength={80}
                        minLength={2}
                        required
                        id={"firstName"}
                        label={"Vaše křestní jméno"}
                        placeholder={"Napište křestní jméno"}
                        error={errors["firstName"] ? errors["firstName"].message : ''}
                        disabled={false}
                    />
                    <Controller control={control} render={({ field }) => (
                        <ComboBox {...field} setValue={setValue} {...register("university")} name={"university"} id={"university"} />
                    )} name={"university"} />
                    <FormButton disabled={isSubmitting} />
                </div>
            </form>

        </div>
        <div className={"p-2.5"}>
            <FormInput
                name={"testInput"}
                type={"text"}
                id={"testInput"}
                label={"Test #1"}
                placeholder={"Test pro error"}
                error={'Example of error'}
                disabled={false}
            />
            <FormInput
                name={"testInput2"}
                type={"text"}
                id={"testInput2"}
                label={"Test #2"}
                placeholder={"Test pro disabled"}
                disabled={true}
            />
        </div>
    </div>

    )
}

export default App
