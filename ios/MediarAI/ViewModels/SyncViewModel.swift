//
//  SyncViewModel.swift
//  MediarAI
//
//  Created by Louis AB on 02/09/2023.
//

import BackgroundTasks
import HealthKit
import os.log

let backgroundLog = OSLog(subsystem: "tech.louisab.MediarAI", category: "background")

class SyncViewModel: ObservableObject {
    func startSync() {
        // schedule the background task
        os_log("Start sync", log: backgroundLog, type: .info)
        scheduleAppRefresh()
    }

    func fetchAndUpload() {
        // Fetch HealthKit data
        HealthKitService.fetchAllHealthData { healthData in
            if let healthData = healthData {
                print("fetched data")
                self.uploadToDatabase(data: healthData)
            } else {
                print("error while fetching data")
            }
        }
    }

    func handleAppRefresh(task: BGAppRefreshTask) {
        os_log("Background task started", log: backgroundLog, type: .info)

        // Fetch HealthKit data
        HealthKitService.fetchAllHealthData { healthData in
            if let healthData = healthData {
                os_log("Fetched health data", log: backgroundLog, type: .info)
                self.uploadToDatabase(data: healthData)
                task.setTaskCompleted(success: true)
            } else {
                os_log("Error fetching health data", log: backgroundLog, type: .info)
                task.setTaskCompleted(success: false)
            }
        }
    }

    private func uploadToDatabase(data: HealthData) {
        Task {
            await HealthDatabaseService.uploadData(healthData: data)
        }
    }

//    private func scheduleAppRefresh() {
//        let request = BGAppRefreshTaskRequest(identifier: "ai.mediar.syncHealthData")
//
//        print("setting up next scheduleAppRefresh")
//
//        // Calculate time until next midnight
//        let calendar = Calendar.current
//        let now = Date()
//        let nextMidnight = calendar.nextDate(after: now, matching: DateComponents(hour: 0), matchingPolicy: .nextTime)!
//        let timeUntilMidnight = nextMidnight.timeIntervalSince(now)
//
//        // Schedule the task for the next midnight
//        request.earliestBeginDate = Date(timeIntervalSinceNow: timeUntilMidnight)
//
//        do {
//            try BGTaskScheduler.shared.submit(request)
//        } catch {
//            print("Could not schedule app refresh: \(error)")
//        }
//    }

    private func scheduleAppRefresh() {
        let request = BGAppRefreshTaskRequest(identifier: "ai.mediar.syncHealthData")

        print("setting up next scheduleAppRefresh")

        // Schedule the task for 1 minute from now
        request.earliestBeginDate = Date(timeIntervalSinceNow: 60)

        do {
            try BGTaskScheduler.shared.submit(request)
        } catch {
            print("Could not schedule app refresh: \(error)")
        }
    }
}
