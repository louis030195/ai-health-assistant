import { Database } from "@/types_db";
import { createClient } from "@supabase/supabase-js";

export async function generateDataStringsAndFetchData(user: any, threeDaysAgoFromOneAm: string) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const [neurosData, ourasData, appleHealthsData, tagsData] = await Promise.all([
    supabase
      .from('states')
      .select('probability, created_at')
      .eq('metadata->>label', 'focus')
      .eq('user_id', user.id)
      .gte('created_at', threeDaysAgoFromOneAm)
      .order('created_at', { ascending: false })
      .limit(10000),
    supabase
      .from('states')
      .select('oura, created_at')
      .eq('user_id', user.id)
      .gte('oura->>day', new Date(threeDaysAgoFromOneAm).toISOString().split('T')[0]),
    // .limit(100),
    supabase
      .from('states')
      .select("created_at, apple_health_data")
      .not('apple_health_data', 'is', null)
      .gte('created_at', threeDaysAgoFromOneAm)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    // .limit(100),
    supabase
      .from('tags')
      .select('text, created_at')
      .eq('user_id', user.id)
      .gt('created_at', threeDaysAgoFromOneAm)
  ]);

  const { data: neuros } = neurosData;
  const { data: ouras } = ourasData;
  let { data: appleHealths } = appleHealthsData;
  const { data: tags } = tagsData;


  console.log("Retrieved Neurosity data:", neuros?.length);

  // Group by 300 samples and average the probability
  const groupedNeuros = neuros
    // filter out < 0.3 probability
    ?.filter((item) => item.probability && item.probability! > 0.3)
    ?.reduce((acc: any, curr, index, array) => {
      if (index % 300 === 0) {
        const slice = array.slice(index, index + 300);
        const avgProbability = slice.reduce((sum, item) => sum + (item.probability || 0), 0) / slice.length;
        acc.push({ created_at: curr.created_at, probability: avgProbability });
      }
      return acc;
    }, []);

  console.log(new Date(threeDaysAgoFromOneAm).toISOString().split('T')[0])

  console.log("Retrieved Oura data:", ouras?.length);



  console.log("Retrieved Apple Health data:", appleHealths?.length);

  // group apple health data by date
  const appleHealthActivities = appleHealths?.reduce((acc: any, curr: any) => {
    if (curr.apple_health_data.activitiesData) {
      curr.apple_health_data.activitiesData.forEach((activity: any) => {
        const dayOfTheWalking = new Date(activity.activityTime).toLocaleString('en-US', { timeZone: user.timezone }).split(' ')[0];
        if (!acc[dayOfTheWalking]) acc[dayOfTheWalking] = { activityCalories: 0, activityDuration: 0 };
        acc[dayOfTheWalking].activityCalories += activity.activityCalories;
        // }
      });
    }
    return acc;
  }, {});

  console.log("appleHealthActivities", appleHealthActivities);

  // remove activites
  // @ts-ignore
  appleHealths?.forEach((appleHealth: any) => {
    if (appleHealth.apple_health_data.activitiesData) {
      delete appleHealth.apple_health_data.activitiesData;
    }
  });
  console.log("Filtered Apple Health data:", appleHealths);

  // if the user has nor tags, neuros, ouras, skip to next user

  if (!tags && (!neuros || neuros.length === 0) && (!ouras || ouras.length === 0) && (!appleHealths || appleHealths.length === 0)) {
    console.log("No tags, neuros, or ouras for user:", user);
    return ''
  }
  console.log("User has neuros of length:", neuros?.length, "and ouras of length:", ouras?.length, "and appleHealths of length:", appleHealths?.length);
  console.log("User has tags of length:", tags?.length);

  console.log("Generating insights for user:", user);

  let tagsString = '';
  tags?.forEach((tag) => {
    tag.created_at = new Date(tag.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    tagsString += JSON.stringify(tag);
  });

  let neurosString = '';
  groupedNeuros?.forEach((neuro: any) => {
    neuro.created_at = new Date(neuro.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    neurosString += JSON.stringify(neuro);
  });

  let ourasString = '';
  ouras?.forEach((oura) => {
    oura.created_at = new Date(oura.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    ourasString += JSON.stringify(oura);
  });

  let appleHealthString = '';
  appleHealths?.forEach((appleHealth) => {
    appleHealth.created_at = new Date(appleHealth.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    appleHealthString += JSON.stringify(appleHealth);
  });
  Object.keys(appleHealthActivities).forEach((key) => {
    appleHealthString += JSON.stringify(appleHealthActivities[key]);
  });

  return JSON.stringify({
    tagsString,
    neurosString,
    ourasString,
    appleHealthString
  });
}


export async function generateMoreDataStrings(user: any, threeDaysAgoFromOneAm: string) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  const [activities, biometrics, body, foods, sleep] = await Promise.all([
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
      .gte('start_time', threeDaysAgoFromOneAm)
  ])

  let activitiesString = ''
  activities.data?.forEach(activity => {
    activity.start_time = new Date(activity.start_time).toLocaleString('en-US', { timeZone: user.timezone })
    activitiesString += JSON.stringify(activity)
  })

  let biometricsString = ''
  biometrics.data?.forEach(biometric => {
    biometric.start_time = new Date(biometric.start_time).toLocaleString('en-US', { timeZone: user.timezone })
    biometricsString += JSON.stringify(biometric)
  })

  let bodyString = ''
  body.data?.forEach(bodyData => {
    bodyData.start_time = new Date(bodyData.start_time).toLocaleString('en-US', { timeZone: user.timezone })
    bodyString += JSON.stringify(bodyData)
  })

  let foodsString = ''
  foods.data?.forEach(food => {
    food.start_time = new Date(food.start_time).toLocaleString('en-US', { timeZone: user.timezone })
    foodsString += JSON.stringify(food)
  })

  let sleepString = ''
  sleep.data?.forEach(sleepData => {
    sleepData.start_time = new Date(sleepData.start_time).toLocaleString('en-US', { timeZone: user.timezone })
    sleepString += JSON.stringify(sleepData)
  })

  return JSON.stringify({
    activitiesString,
    biometricsString,
    bodyString,
    foodsString,
    sleepString
  });

}