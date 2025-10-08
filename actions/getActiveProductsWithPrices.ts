import { ProductWithPrice } from "@/types"
import { createSupabaseServerClient } from "@/lib/supabaseServer"

const getActiveProductsWithPrices = async(): Promise<ProductWithPrice[]> => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index', { ascending: true })
    .order('unit_amount', { foreignTable: 'prices' })

  if (error) {
    console.log(error.message)
    return []
  }

  return (data as any) || []
}

export default getActiveProductsWithPrices