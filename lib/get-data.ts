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


  const activitiesData = activities.data?.map(activity => ({
    ...activity,
    start_time: activity.start_time ? convertToUserTimezone(new Date(activity.start_time), user.timezone) : null,
  }));

  const biometricsData = biometrics.data?.map(biometric => ({
    ...biometric,
    start_time: biometric.start_time ? convertToUserTimezone(new Date(biometric.start_time), user.timezone) : null,
  }));

  const bodyData = body.data?.map(body => ({
    ...body,
    start_time: body.start_time ? convertToUserTimezone(new Date(body.start_time), user.timezone) : null,
  }));

  const foodsData = foods.data?.map(food => ({
    ...food,
    start_time: food.start_time ? convertToUserTimezone(new Date(food.start_time), user.timezone) : null,
  }));

  const sleepData = sleep.data?.map(sleep => ({
    ...sleep,
    start_time: sleep.start_time ? convertToUserTimezone(new Date(sleep.start_time), user.timezone) : null,
  }));

  const tagsData = tags.data?.map(tag => ({
    ...tag,
    created_at: tag.created_at ? convertToUserTimezone(new Date(tag.created_at), user.timezone) : null,
  }));

  return JSON.stringify({
    activities: activitiesData,
    biometrics: biometricsData,
    body: bodyData,
    foods: foodsData,
    sleep: sleepData,
    tags: tagsData,
  });

}

function convertToUserTimezone(date: Date, userTimezone: string) {
  const userDate = new Date(date.toLocaleString('en-US', { timeZone: userTimezone }));
  const year = userDate.getFullYear();
  const month = (userDate.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed in JS
  const day = userDate.getDate().toString().padStart(2, '0');
  const hours = userDate.getHours().toString().padStart(2, '0');
  const minutes = userDate.getMinutes().toString().padStart(2, '0');
  const seconds = userDate.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}

