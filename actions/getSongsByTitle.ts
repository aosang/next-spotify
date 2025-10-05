import { Song } from "@/types"
import { createSupabaseServerClient } from "@/lib/supabaseServer"
import getSongs from "./getSongs"

const getSongsByTitle = async(title: string): Promise<Song[]> => {
  const supabase = await createSupabaseServerClient()

  if(!title) {
    const allSongs = await getSongs()
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error.message)
    return []
  }

  return (data as any) || []
}

export default getSongsByTitle