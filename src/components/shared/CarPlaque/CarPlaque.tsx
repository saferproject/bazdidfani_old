import { useEffect } from "react"
import { useForm } from "react-hook-form"

export default function CarPlaque(props: {
    first_number?: number,
    third_chractor?: string,
    second_number?: number,
    fourth_number?: number,
    small?: boolean,
    disabled?: boolean,
}) {
    const {
        register,
        watch,
        reset,
        setFocus
    } = useForm()

    useEffect(() => {
        reset({
            "first_number[0]": props.first_number?.toString()[0],
            "first_number[1]": props.first_number?.toString()[1],
            "third_chractor": props.third_chractor,
            "second_number[0]": props.second_number?.toString()[0],
            "second_number[1]": props.second_number?.toString()[1],
            "second_number[2]": props.second_number?.toString()[2],
            "fourth_number[0]": props.fourth_number?.toString()[0],
            "fourth_number[1]": props.fourth_number?.toString()[1],
        })
    }, [])

    useEffect(() => {
        if (watch("first_number[0]") === "") {
            setFocus("first_number[0]")
        } else if (watch("first_number[1]") === "") {
            setFocus("first_number[1]")
        } else if (watch("third_chractor") === "") {
            setFocus("third_chractor")
        } else if (watch("second_number[0]") === "") {
            setFocus("second_number[0]")
        } else if (watch("second_number[1]") === "") {
            setFocus("second_number[1]")
        } else if (watch("second_number[2]") === "") {
            setFocus("second_number[2]")
        } else if (watch("fourth_number[0]") === "") {
            setFocus("fourth_number[0]")
        } else if (watch("fourth_number[1]") === "") {
            setFocus("fourth_number[1]")
        }
    }, [watch()])

    return (
        <div className="col-span-2 flex items-center justify-center" >
            <div className={`bg-[#fdcb18] border overflow-hidden border-black col-span-2 flex items-center justify-between flex-row-reverse rounded-[8px] h-[6.8vh] min-h-full w-full min-w-full text-[3vw] lg:text-[1.3vw] ${props.small ? "lg:text-[0.7vw]!" : ""}`}>
                <div className="bg-[#00349a] rounded-l-[8px] w-[1.3vw] h-full"></div>
                <div className="w-full flex items-center justify-center">
                    <div className="flex items-center justify-center flex-row-reverse max-w-fit">
                        <div className={`flex flex-row-reverse space-x-[1.5vw] xl:space-x-3 mx-1 xl:mx-2 items-center justify-between ${props.small ? "xl:space-x-[0.2vw]" : ""}`}>
                            <p>
                                <input disabled={props.disabled} type="text" autoFocus className={`outline-hidden ${watch("first_number[0]") ? "" : "border-b border-black"} bg-[#fdcb18] w-[0.8vw] text-lg h-5`} maxLength={1} {...register("first_number[0]")} />
                            </p>
                            <p>
                                <input disabled={props.disabled} type="text" className={`outline-hidden ${watch("first_number[1]") ? "" : "border-b border-black"} bg-[#fdcb18] w-[0.8vw] text-lg h-5`} maxLength={1} {...register("first_number[1]")} />
                            </p>
                            <p className="font-bold">
                                <input disabled={props.disabled} type="text" className={`outline-hidden ${watch("third_chractor") ? "" : "border-b border-black"} bg-[#fdcb18] w-[1.5vw] text-lg font-bold h-7`} maxLength={3} {...register("third_chractor")} />
                            </p>
                            <p>
                                <input disabled={props.disabled} type="text" className={`outline-hidden ${watch('second_number[0]') ? "" : "border-b border-black"} bg-[#fdcb18] w-[0.8vw] text-lg h-5`} maxLength={1} {...register("second_number[0]")} />
                            </p>
                            <p>
                                <input disabled={props.disabled} type="text" className={`outline-hidden ${watch("second_number[1]") ? "" : "border-b border-black"} bg-[#fdcb18] w-[0.8vw] text-lg h-5`} maxLength={1} {...register("second_number[1]")} />

                            </p>
                            <p>
                                <input disabled={props.disabled} type="text" className={`outline-hidden ${watch("second_number[2]") ? "" : "border-b border-black"} bg-[#fdcb18] w-[0.8vw] text-lg h-5`} maxLength={1} {...register("second_number[2]")} />
                            </p>
                        </div>
                        <div className="flex flex-row-reverse  space-x-3 mx-2 items-center justify-between">
                            <p className="text-[2vw]">
                                |
                            </p>
                            <div className="flex flex-col items-center justify-around">
                                <p className="absolute mt-1 font-semibold mb-[5vh] text-[1.5vw] lg:text-[0.7vw]">
                                    ایران
                                </p>
                                <div className={`flex items-center justify-between gap-x-1 xl:gap-x-3 ${props.small ? "xl:gap-x-[0.2vw]" : ""}`}>
                                    <p>
                                        <input disabled={props.disabled} type="text" className={`outline-hidden ${watch("fourth_number[1]") ? "" : "border-b border-black"} bg-[#fdcb18] w-[0.8vw] text-lg h-5`} maxLength={1} {...register("fourth_number[1]")} />
                                    </p>
                                    <p>
                                        <input disabled={props.disabled} type="text" className={`outline-hidden ${watch("fourth_number[0]") ? "" : "border-b border-black"} bg-[#fdcb18] w-[0.8vw] text-lg h-5`} maxLength={1} {...register("fourth_number[0]")} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}