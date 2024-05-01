"use client"

interface Player {
    id: string;
    name: string;
    nationality: string;
    league: string;
    club: string;
    position: string;
    age: number;
    jersey: number;
}

import { useAuth } from "@clerk/nextjs";
import { getAllPlayers } from "../../../utils/supabaseRequests";
import { useEffect, useState } from "react";

export default async function PlayerSearch() {
    const { getToken } = useAuth();
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const loadTodos = async () => {
            const token = await getToken({ template: 'supabase' });
            const players = await getAllPlayers({token});
            setPlayers(players);
        };
        loadTodos();
    }, []);

    return (
      <div className='flex flex-col gap-4 w-full justify-center items-center py-10'>
        <h1 className='font-bold text-2xl'>Todos Page</h1>

        <table className='text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Nationality</th>
              <th scope="col" className="px-6 py-3">League</th>
              <th scope="col" className="px-6 py-3">Club</th>
              <th scope="col" className="px-6 py-3">Position</th>
              <th scope="col" className="px-6 py-3">Age</th>
              <th scope="col" className="px-6 py-3">Jersey</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={player.id}>
                <td className='px-6 py-4'>{player.id}</td>
                <td className='px-6 py-4'>{player.name}</td>
                <td className='px-6 py-4'>{player.nationality}</td>
                <td className='px-6 py-4'>{player.league}</td>
                <td className='px-6 py-4'>{player.club}</td>
                <td className='px-6 py-4'>{player.position}</td>
                <td className='px-6 py-4'>{player.age}</td>
                <td className='px-6 py-4'>{player.jersey}</td>
            </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    );
  }
  