//
//  HealthKitModel.swift
//  MediarAI
//
//  Created by Louis AB on 02/09/2023.
//

import Foundation

struct HealthData: Codable {
    var activitiesData: [Activity]
    var sleepData: SleepData
    var weightData: Float
    var heartData: HeartData
    var mindfulnessData: MindfulnessData
}

struct Activity: Codable {
    var activityType: String
    var activityDuration: Double
    var activityCalories: Double
    var activityTime: Date
}

struct SleepData: Codable {
    var sleptHours: Double
}

struct HeartData: Codable {
    var avgBpm: Double
    var maxBpm: Double
    var minBpm: Double
}

struct MindfulnessData: Codable {
    var status: String
}
