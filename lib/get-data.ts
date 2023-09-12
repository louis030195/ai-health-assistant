import { Database } from "@/types_db";
import { createClient } from "@supabase/supabase-js";


export async function getHealthData(user: any, threeDaysAgoFromOneAm: string) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  const [activities, biometrics, body, foods, sleep, tags] = await Promise.all([
    supabase
      .from('activities')
      .select()
      .eq('user_id', user.id)
      .gte('start_time', threeDaysAgoFromOneAm),

    supabase
      .from('biometrics')
      .select()
      .eq('user_id', user.id)
      .gte('start_time', threeDaysAgoFromOneAm),

    supabase
      .from('body')
      .select()
      .eq('user_id', user.id)
      .gte('start_time', threeDaysAgoFromOneAm),

    supabase
      .from('foods')
      .select()
      .eq('user_id', user.id)
      .gte('start_time', threeDaysAgoFromOneAm),

    supabase
      .from('sleep')
      .select()
      .eq('user_id', user.id)
      .gte('start_time', threeDaysAgoFromOneAm),

    supabase
      .from('tags')
      .select('created_at, text')
      .eq('user_id', user.id)
      .gte('created_at', threeDaysAgoFromOneAm)
  ])


  return JSON.stringify({
    activities: activities.data,
    biometrics: biometrics.data,
    body: body.data,
    foods: foods.data,
    sleep: sleep.data,
    tags: tags.data,
  });

}

// getHealthData({
//   id: '20284713-5cd6-4199-8313-0d883f0711a1',
// }, '2023-09-09T01:00:00.000Z').then(console.log)