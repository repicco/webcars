import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps{
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({type, placeholder, name, register, rules, error}: InputProps){
    return (
        <div>
            <input
                className='w-full h-11 rounded-md border-2 px-2'
                type={type} 
                placeholder={placeholder}
                {...register(name, rules)}
                id={name}
                />
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    )
}