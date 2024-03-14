import React, {forwardRef, InputHTMLAttributes, useEffect, useRef, useState} from 'react';
import {IUniversity} from '../assets/mockJSON.ts'
import { IoMdCloseCircle } from "react-icons/io"
import { useDebounce } from "@uidotdev/usehooks"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {FormInput} from "./FormInput.tsx"

interface ComboBoxProps extends InputHTMLAttributes<HTMLInputElement> {
    setValue: (name: "firstName" | "university", value: any) => void;
    name: "firstName" | "university";
}

export const UNIVERSITIES_QUERY_KEY = 'universities'

const fetchUniversities = async (searchTerm: string): Promise<IUniversity[]> => {
    const response = await axios.get<IUniversity[]>(`http://universities.hipolabs.com/search?country=Czech+Republic&name=${searchTerm}`)
    return response.data;
};

export const useUniversitiesQuery = (searchTerm: string) => {
    const queryFn = () => fetchUniversities(searchTerm);

    return useQuery({ queryKey: [UNIVERSITIES_QUERY_KEY, searchTerm], queryFn })
}

export const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(
    ({name, setValue, ...props}, ref) => {
        const [searchTerm, setSearchTerm] = useState('')
        const debouncedSearchTerm = useDebounce(searchTerm, 300)
        const {data: universities, error} = useUniversitiesQuery(debouncedSearchTerm)
        const [selectedUniversity, setSelectedUniversity] = useState('')
        const [menuVisible, setMenuVisible] = useState(false)
        const comboBoxRef = useRef<HTMLDivElement>(null)

        const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value)
        };

        const handleUniversitySelect = (universityName: string) => {
            setSelectedUniversity(universityName)
            setSearchTerm(universityName)
            setMenuVisible(false)
            setValue(name, universityName)
        }

        const clearSelectedUniversity = () => {
            setSelectedUniversity('')
            setSearchTerm('')
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (comboBoxRef.current && !comboBoxRef.current.contains(event.target as Node)) {
                setMenuVisible(false)
            }
        }

        useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }, [])

        if (error) {
            return <div>Došlo k chýbě</div>
        }

        return (
            <div className={"flex flex-col w-72"} ref={comboBoxRef}>
                <label htmlFor={props.id}
                       className={"text-gray-500 font-bold"}>Univerzita na kterou chodíte</label>
                <div className={"relative flex items-center"}>
                    <FormInput
                        {...props}
                        ref={ref}
                        type="text"
                        placeholder="Napište univerzitu"
                        value={selectedUniversity ? selectedUniversity : searchTerm}
                        onChange={handleSearchChange}
                        className={`border-2 p-1 rounded w-72 border-gray-300 bg-white pr-4`}
                        onClick={() => setMenuVisible(true)}
                    />
                    {selectedUniversity && searchTerm.length>0 && <span
                        onClick={clearSelectedUniversity}
                        className={"absolute right-2 cursor-pointer"}
                    >
                        <IoMdCloseCircle/>
                    </span>}
                </div>
                <ul className={`max-h-52 overflow-auto w-72 my-2 rounded border-gray-300 ${!menuVisible && 'hidden'} border-b-2`}>
                    {universities?.map((university: IUniversity) => (
                        <li onClick={() => handleUniversitySelect(university.name)} className={"cursor-pointer overflow-hidden whitespace-nowrap overflow-ellipsis p-1.5 border-gray-300 border-2 border-b-0"} key={university.name} value={university.name}>
                            {university.name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
)