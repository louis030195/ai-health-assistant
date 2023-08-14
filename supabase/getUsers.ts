import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

dotenv.config();

const getAllUsersAsCsv = async () => {
    console.log("Getting all users as csv...")

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
    )

    // get all users
    const { data, error } = await supabase
        .from('users')
        .select('*')

    if (error) return console.log("Error fetching profiles:", error)

    let users: string[] = []
    let count = 0;
    const total = data.length;

    for (const e of data) {
        count++;
        console.log(`Progress: ${count}/${total}`);
        const { data: { user }, error } = await supabase.auth.admin.getUserById(e["id"])
        if (error || !user) return console.log("Error fetching user:", error)
        users.push(user.email!)
    }

    // convert to csv
    console.log("Converting to csv...", users)

    let csvData = users.join('\n');
    fs.writeFileSync('/Users/louisbeaumont/Downloads/users.csv', csvData);
}

getAllUsersAsCsv()
