import { Database } from '@/types_db';
import { Activity } from '@metriport/api-sdk/devices/models/activity';
import { Biometrics } from '@metriport/api-sdk/devices/models/biometrics';
import { Body } from '@metriport/api-sdk/devices/models/body';
import { Nutrition } from '@metriport/api-sdk/devices/models/nutrition';
import { Sleep } from '@metriport/api-sdk/devices/models/sleep';
import { createClient } from '@supabase/supabase-js';

export async function syncHealthData(activities: Activity[], biometrics: Biometrics[], bodies: Body[], nutrition: Nutrition[], sleep: Sleep[], userId: string) {
    const supabase = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
    )

    // Process biometrics data
    const biometricsData = biometrics ?? []
    for (const biometric of biometricsData) {
        const { metadata, heart_rate, respiration } = biometric
        const { date, hour, source } = metadata
        const start_time = hour ? `${date}T${hour}:00Z` : `${date}T00:00Z`
        const end_time = start_time // For simplicity, let's assume end_time is the same as start_time

        const { error } = await supabase
            .from('biometrics')
            .upsert({
                // @ts-ignore
                user_id: userId,
                start_time,
                end_time,
                heart_rate, // Insert the whole heart_rate JSON
                respiration, // Insert the whole respiration JSON
                date,
                hour,
                source,
                data_source: metadata.data_source,
                error: metadata.error
                // Add other biometrics fields here as needed
            }, { onConflict: 'start_time, end_time, user_id, source' })
        if (error) {
            console.error('Error inserting biometrics:', error)
        }
    }

    // Process sleep data
    const sleepData = sleep ?? []
    for (const sleep of sleepData) {
        const { start_time, end_time, durations, biometrics, metadata } = sleep

        const { error } = await supabase
            .from('sleep')
            .upsert({
                // @ts-ignore
                user_id: userId,
                start_time,
                end_time,
                durations: durations,
                biometrics: biometrics,
                date: metadata.date,
                hour: metadata.hour,
                source: metadata.source,
                data_source: metadata.data_source,
                error: metadata.error
            }, { onConflict: 'start_time, end_time, user_id, source' })
        if (error) {
            console.error('Error inserting sleep:', error)
        }
    }

    // Process nutrition data
    const nutritionData = nutrition ?? []
    for (const nutrition of nutritionData) {
        for (const food of nutrition.foods ?? []) {
            const {
                name,
                brand,
                nutrition_facts, // insert the whole nutrition JSON
            } = food

            const { error } = await supabase
                .from('foods')
                .upsert({
                    // @ts-ignore
                    user_id: userId,
                    start_time: `${nutrition.metadata.date}T${nutrition.metadata.hour}:00Z`,
                    end_time: `${nutrition.metadata.date}T${nutrition.metadata.hour}:00Z`,
                    name,
                    brand,
                    nutrition_facts,
                    date: nutrition.metadata.date,
                    hour: nutrition.metadata.hour,
                    source: nutrition.metadata.source,
                    data_source: nutrition.metadata.data_source,
                    error: nutrition.metadata.error
                }, { onConflict: 'start_time, end_time, user_id, source' })
            if (error) {
                console.error('Error inserting food:', error)
            }
        }
    }

    // Process activity data
    const activityData = activities ?? []
    for (const activity of activityData) {
        const { summary, metadata } = activity

        const { error } = await supabase
            .from('activities')
            .upsert({
                // @ts-ignore
                user_id: userId,
                start_time: metadata.hour ? `${metadata.date}T${metadata.hour}:00Z` : `${metadata.date}T00:00Z`,
                end_time: metadata.hour ? `${metadata.date}T${metadata.hour}:00Z` : `${metadata.date}T00:00Z`,
                biometrics: summary?.biometrics,
                movement: summary?.movement,
                energy_expenditure: summary?.energy_expenditure,
                date: metadata.date,
                hour: metadata.hour,
                durations: summary?.durations,
                source: metadata.source,
                error: metadata.error
            }, { onConflict: 'start_time, end_time, user_id, source' })
        if (error) {
            console.error('Error inserting activity:', error)
        }
    }

    // Process body data
    const bodyData = bodies ?? []
    for (const body of bodyData) {
        const { metadata, ...otherFields } = body

        const { date, hour, source } = metadata
        const start_time = hour ? `${date}T${hour}:00Z` : `${date}T00:00Z`
        const end_time = start_time // For simplicity, let's assume end_time is the same as start_time

        // @ts-ignore
        const { error } = await supabase
            .from('body')
            .upsert({
                user_id: userId,
                start_time,
                end_time,
                date,
                hour,
                source,
                data_source: metadata.data_source?.toString(),
                error: metadata.error,
                body_fat_pct: otherFields.body_fat_pct,
                height_cm: otherFields.height_cm,
                weight_kg: otherFields.weight_kg,
                bone_mass_kg: otherFields.bone_mass_kg,
                muscle_mass_kg: otherFields.muscle_mass_kg,
                lean_mass_kg: otherFields.lean_mass_kg,
                max_possible_heart_rate_bpm: otherFields.max_possible_heart_rate_bpm,
                weight_samples_kg: { data: otherFields.weight_samples_kg }
                // Add other body fields here as needed
            }, { onConflict: 'start_time, end_time, user_id, source' })
        if (error) {
            console.error('Error inserting body data:', error)
        }
    }
}