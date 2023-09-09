//
//  HealthDatabaseService.swift
//  MediarAI
//
//  Created by Louis AB on 02/09/2023.
//

import Foundation
import Supabase

struct States: Codable, Identifiable {
    let id: Int? // Note: This is a Primary Key.<pk/>
    let userId: UUID?
    let createdAt: Date?
    let appleHealthData: HealthData?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case createdAt = "created_at"
        case appleHealthData = "apple_health_data"
    }
}

class HealthDatabaseService {
    static let client = SupabaseClient(supabaseURL: URL(string: Constants.supabaseUrl)!,
                                       supabaseKey: Constants.supabaseKey)

    private static func canUpload() async -> Bool {
        do {
            
            let userId = try await self.client.auth.session.user.id
            let query = self.client.database
                .from("states")
                .select()
                .eq(column: "user_id", value: userId)
                //.single()
                //.limit(count: 1)
                .order(column: "created_at", ascending: false, nullsFirst: true)
            let d: [States] = try await query.execute().value
            //print(d)
            
            //let created_at_list: [Date] = try await query.execute().value
            //print(created_at_list)
            guard let latestDate = d.first?.createdAt else {
                print("No date available, can upload.")
                return true
            }

            let currentDate = Date()
            let timeInterval = currentDate.timeIntervalSince(latestDate)

            print("Latest date: \(latestDate)")
            // return timeInterval >= 24 * 3600

            print("Time interval: \(timeInterval >= 24 * 3600)")
            // If the latest update was more than 24 hours ago, allow upload
            return timeInterval >= 24 * 3600
            
            // let userId = try await self.client.auth.session.user.id
            // // https://zfjdysuchblioghfuluq.supabase.co/rest/v1/states?select=*&user_id=eq.20284713-5CD6-4199-8313-0D883F0711A1
            // let url = URL(string: "\(Constants.supabaseUrl)/rest/v1/states?select=*&user_id=eq.\(userId)")!
            // print(url)
            // var request = URLRequest(url: url)
            // request.setValue("application/json", forHTTPHeaderField: "Accept")
            // request.setValue(Constants.supabaseKey, forHTTPHeaderField: "apikey")
            // request.setValue("Bearer \(Constants.supabaseKey)", forHTTPHeaderField: "Authorization")

            // let (data, response) = try await URLSession.shared.data(for: request)
            // do {
            //     let decoder = JSONDecoder()
            //     decoder.dateDecodingStrategy = .iso8601
            //     let states = try decoder.decode([States].self, from: data)
            //     print(states)
            // } catch {
            //     print("Error decoding data: \(error)")
            // }
            // guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            //     print("Invalid response")
            //     return false
            // }
             
            // return false
        } catch let error as NSError {
            print("Error while checking canUpload: \(error)")
            print("Error Description: \(error.description)")
            print("Error Domain: \(error.domain)")
            print("Error Code: \(error.code)")
            print("Error User Info: \(error.userInfo)")
            return false
        }
    }

    static func uploadData(healthData: HealthData) async -> (Bool, String?) {
        do {
            let canUpload = await self.canUpload()
            //print("zzz")
            if !canUpload {
                return (false, "You already uploaded today!")
            }
            let userId = try await self.client.auth.session.user.id
            let state = States(id: nil, userId: userId, createdAt: nil, appleHealthData: healthData)
                // last update from healthData
                //created_at: healthData.activitiesData.last?.date ?? Date())
            // TODO: split in multiple states according to day?
            
            let query = self.client.database
                .from("states")
                .insert(values: state)
            try await query.execute().value
             
            return (true, nil)
        } catch {
            print("Error upload data : \(error)")
            return (false, "\(error)")
        }
    }
}
