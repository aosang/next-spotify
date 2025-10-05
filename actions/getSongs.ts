import { Song } from "@/types"
import { createSupabaseServerClient } from "@/lib/supabaseServer"

const getSongs = async(): Promise<Song[]> => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error.message)
    return []
  }

  return (data as any) || []
}

export default getSongs