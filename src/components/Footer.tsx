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
        <footer className='absolute bottom-0 w-full bg-stone-800 p-4 flex justify-center items-center border-stone-700 border-t-[1px]'>
            <div className='xl:w-1/2 w-full flex flex-col justify-center text-center gap-y-2'>
                <h1 className="text-sm font-bolder text-emerald-500">Designed and Devloped by Anthony Clermont © 2024</h1>
                <Link href={'https://playfootball.games/who-are-ya'} target="_blank" className="text-xs text-zinc-300">Thankyou playfootball.games for this game concept</Link>

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