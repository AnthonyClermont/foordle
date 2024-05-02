import Link from "next/link";

import { DiReact } from "react-icons/di";
import { SiTypescript, SiSupabase, SiClerk } from "react-icons/si";

const iconSize = 30;
const icons = [
    { icon: <SiSupabase size={22} />, key: 'supabase' },
    { icon: <SiClerk size={25} />, key: 'clerk' },
    { icon: <SiTypescript size={23} />, key: 'typescript' },
    { icon: <DiReact size={iconSize} />, key: 'react' },
  ];

export default function Footer() {
    return (
        <footer className='absolute bottom-0 w-full hidden sm:flex bg-stone-800 p-4 justify-center items-center border-stone-700 border-t-[1px]'>
            <div className='w-1/2 flex flex-col justify-evenly items-center'>
                <div>
                    <h1 className="text-sm font-bolder text-emerald-500">Designed and Devloped by Anthony Clermont © 2024</h1>
                </div>

                <div className='pt-2 flex flex-col items-center justify-center gap-2'>
                    <small>made with</small>
                    <div className='flex w-fit items-center justify-evenly gap-2'>
                        {icons.map(({ icon, key }) => (
                            <div key={key}>{icon}</div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}