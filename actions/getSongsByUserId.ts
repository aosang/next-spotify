import { Song } from "@/types"
import { createSupabaseServerClient } from "@/lib/supabaseServer"

const getSongsByUserId = async(): Promise<Song[]> => {
  const supabase = await createSupabaseServerClient()

  const {data: userData, error: userError} = await supabase.auth.getUser()

  if (userError || !userData.user) {
    console.log(userError?.message || 'No user found')
    return []
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error.message)
    return []
  }

  return (data as any) || []
}

export default getSongsByUserId