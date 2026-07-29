import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')

  if (error) {
    console.error("Error fetching orders:", error)
    return
  }

  const matchedOrders = data.filter(order => 
    JSON.stringify(order).includes('6B362A3E') || 
    JSON.stringify(order).toLowerCase().includes('6b362a3e')
  )
  
  if (matchedOrders.length > 0) {
    console.log("Matched Order(s):", JSON.stringify(matchedOrders, null, 2))
  } else {
    console.log("No orders matched '6B362A3E'. Total orders checked:", data.length)
  }
}

fetchOrders()
