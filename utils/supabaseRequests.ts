import { Player } from "./interface";
import { supabaseClient } from "./supabaseClient";
import seedrandom from 'seedrandom';

let cachedPlayer: Player | null = null;

export const getTodos = async({userId, token}: {userId: any, token: any}) => {
    console.log(userId, token)
    const supabase = await supabaseClient(token);
    const {data: todos} = await supabase
        .from("todos")
        .select('id, created_at')
        .eq("user_id", userId);

    return todos == null ? [] : todos
}

export const getAllPlayers = async({token}: {token: any}) => {
    const supabase = await supabaseClient(token);
    const {data: players} = await supabase
        .from("players")
        .select('*')
        .limit(50)
        .order('id', { ascending: true })

    return players == null ? [] : players
}

export const getSearchPlayers = async({token, searchTerm}: {token: any, searchTerm: string}): Promise<Player[]> => {
    const supabase = await supabaseClient(token);

    const {data: players} = await supabase
        .from("players")
        .select('*')
        .limit(5)
        .ilike('name', `%${searchTerm}%`);

    return players == null ? [] : players
}

export const getCorrectPlayer = async({token}: {token: any}): Promise<Player> => {
    if (cachedPlayer) {
        return cachedPlayer;
    }

    const supabase = await supabaseClient(token);
    
    const {data: players} = await supabase
        .from("players")
        .select('*')

        const today = new Date();    
        const timestamp = today.toISOString().slice(0, 10).replace(/-/g, "");
    
        const rng = seedrandom(timestamp);

        const weights = players!.map(player => Math.min(1 / player.id, 0.25));
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        const normalizedWeights = weights.map(weight => weight / totalWeight);
    
        let selectedIndex = 0;
        let cumulativeWeight = 0;
        const randomValue = rng();
        for (let i = 0; i < normalizedWeights.length; i++) {
            cumulativeWeight += normalizedWeights[i];
            if (randomValue < cumulativeWeight) {
                selectedIndex = i;
                break;
            }
        }
    
        cachedPlayer = players![selectedIndex];
    
        return cachedPlayer!;
}