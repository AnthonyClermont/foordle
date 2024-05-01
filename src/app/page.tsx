"use client"

import Image from 'next/image';
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { Player } from '../../utils/interface';
import { getCorrectPlayer, getSearchPlayers } from '../../utils/supabaseRequests';

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Home() {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [guessedPlayers, setGuessedPlayers] = useState<Player[]>([]);
  const [correctPlayer, setChosenPlayer] = useState<Player>({} as Player);
  let [guessCount, setGuessCount] = useState<number>(1);
  let [gameOver, setGameOver] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await getToken({ template: 'supabase' });
      setToken(newToken);
    };

    fetchToken();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchPlayer = async () => {
      try {
        const data = await getCorrectPlayer({token});
        setChosenPlayer(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      };
    };

    fetchPlayer();
  }, [token])

  useEffect(() => {
    if (!token) return;

    if (debouncedSearchTerm.length >= 3) {
      const fetchData = async () => {
        try {
          const data = await getSearchPlayers({ token, searchTerm: debouncedSearchTerm });
          setSearchResults(data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };

      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [token, debouncedSearchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOptionClicked = (player: Player) => {
    if(player.id == correctPlayer.id) {
      setGameOver(true);

    }

    setGuessedPlayers([player, ...guessedPlayers]);
    setGuessCount(guessCount += 1)
    setSearchTerm('');
  }

  return (
    <div className='flex pt-10 flex-col gap-4 w-full justify-center items-center'>
      <h1 className='font-bolder text-lg'>Begin by tpying a player&#39;s name into the search</h1>

      {gameOver &&
        <div className='py-6 px-10 rounded-lg my-8 bg-emerald-600'>
          <h1 className='text-2xl font-bold'>Well done! You got it right 🎉🎉</h1>
        </div>
      }

      <div className='relative w-full flex flex-col items-center justify-center mb-16'>
        <input
          autoFocus={true}
          disabled={guessCount >= 8 || gameOver}
          spellCheck="false"
          className='py-4 w-[90vw] md:w-2/3 text-xl pl-6 rounded-2xl text-zinc-800 bg-zinc-300'
          placeholder={`Guess ${guessCount} of 8`}
          value={searchTerm}
          onChange={handleInputChange}
        />

        {searchTerm !== '' && searchResults.length > 0 && (
          <div className="w-2/3 bg-zinc-300 border border-gray-800 text-zinc-800 rounded shadow-md absolute top-[3.25rem]">
            <ul>
              {searchResults.map(player => (
                <li
                  key={player.name}
                  className="cursor-pointer hover:bg-zinc-400 odd:bg-zinc-200 py-3 px-6 flex w-full flex-row gap-8 items-center"
                  onClick={() => handleOptionClicked(player)}
                >
                  <Image className='rounded-sm' src={`/flags/${player.flag}.png`} alt='nationality' width={30} height={30} />
                  <div className='font-bold'>{player.name}</div>
                  <div className='ml-auto rounded-full flex justify-center items-center bg-zinc-800 w-9 h-9 font-bold text-zinc-300'>{player.position}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {guessedPlayers.length == 0 && 
        <div className='flex flex-col text-left w-2/3 gap-6'>
          <h2 className='text-xl'><span className='text-emerald-400 font-bold'>Foordle</span> is a daily football quiz</h2>
          <ul className='list-disc'>
            <li>You have 8 chances to guess the football player from the Premier League</li>
            <li>After each guess, feedback will be revealed, showing how close your guess is to the mystery footballer in a number of categories.</li>
            <li>Example guess: Erling Haaland</li>

            <div className='flex gap-4 py-3'>
              <div className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-lg bg-emerald-500 text-emerald-50`}>
                <Image className='rounded-sm' src={`/flags/no.png`} alt='nationality' width={40} height={40} />
              </div>
              <div className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg bg-zinc-600`}>
                <Image className='rounded-sm' src={`/club/Manchester City.png`} alt='club' width={40} height={35} />
              </div>
              <div className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg bg-zinc-600`}>
                  <GoArrowUp />
                  23
                </div>
            </div>

            <p>Means that the mystery player is Norwegian, but does not play for Manchester City
               and they are over the age of 23.
            </p>
          </ul>
        </div>
      }
      
      {guessedPlayers.length > 0 && (
          <ul className='flex gap-4 flex-col w-2/3'>
            {guessedPlayers.map(player => (
              <li
                key={player.name}
                className="py-3 px-6 flex w-full rounded-lg flex-row gap-4 items-center bg-zinc-700"
              >
                <div className='font-bold text-lg pr-10'>{player.name}</div>
                
                <div 
                  className={`ml-auto rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg ${player.nationality == correctPlayer.nationality ? 'bg-emerald-500 text-emerald-50' : 'bg-zinc-800'}`}
                >
                  <Image className='rounded-sm' src={`/flags/${player.flag}.png`} alt='nationality' width={40} height={40} />
                </div>

                <div 
                  className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg ${player.league == correctPlayer.league ? 'bg-emerald-500 text-emerald-50' : 'bg-zinc-800'}`}
                >
                  <Image className='rounded-full p-1 bg-white' src={`/league/${player.league}.png`} alt='league' width={40} height={35} />
                </div>

                <div 
                  className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg ${player.club == correctPlayer.club ? 'bg-emerald-500 text-emerald-50' : 'bg-zinc-800'}`}
                >
                  <Image className='rounded-sm' src={`/club/${player.club}.png`} alt='club' width={40} height={35} />
                </div>

                <div 
                  className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg ${player.position == correctPlayer.position ? 'bg-emerald-500 text-emerald-50' : 'bg-zinc-800'}`}
                >
                  {player.position}
                </div>

                <div 
                  className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg ${player.age == correctPlayer.age ? 'bg-emerald-500 text-emerald-50' : 'bg-zinc-800'}`}
                >
                  {player.age > correctPlayer.age && <GoArrowDown />}
                  {player.age < correctPlayer.age && <GoArrowUp />}
                  {player.age}
                </div>

                <div 
                  className={`rounded-full flex justify-center items-center w-16 h-16 font-bold text-zinc-300 text-lg ${player.jersey == correctPlayer.jersey ? 'bg-emerald-500 text-emerald-50' : 'bg-zinc-800'}`}
                >
                  {player.jersey > correctPlayer.jersey && <GoArrowDown />}
                  {player.jersey < correctPlayer.jersey && <GoArrowUp />}
                  {player.jersey}
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
