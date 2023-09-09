//
//  HealthKitService.swift
//  MediarAI
//
//  Created by Louis AB on 02/09/2023.
//

import HealthKit

class HealthKitService {
    static let healthStore = HKHealthStore()

    static func fetchStepCount(completion: @escaping (HKQuantitySample?, Error?) -> Void) {
        let stepCountType = HKObjectType.quantityType(forIdentifier: .stepCount)!
        
        let query = HKSampleQuery(sampleType: stepCountType, predicate: nil, limit: 1, sortDescriptors: nil) { _, results, error in
            completion(results?.first as? HKQuantitySample, error)
        }
        
        healthStore.execute(query)
    }
    
    // Helper function to get yesterday's date range
    static func getYesterdayDateRange() -> NSPredicate {
        let calendar = Calendar.current
        let now = Date()
        guard let startDay = calendar.date(bySettingHour: 0, minute: 0, second: 0, of: now),
              let endDay = calendar.date(bySettingHour: 23, minute: 59, second: 59, of: now)
        else {
            fatalError("Date range error")
        }
        let yesterday = calendar.date(byAdding: .day, value: -1, to: startDay)!
        let endOfYesterday = calendar.date(byAdding: .day, value: -1, to: endDay)!
        
        return HKQuery.predicateForSamples(withStart: yesterday, end: endOfYesterday, options: .strictEndDate)
    }
    
    static func fetchActivitiesData(completion: @escaping ([Activity]) -> Void) {
        print("fetching activities data")
        
        guard let type = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
            print("Error setting up the HKQuantityType")
            completion([])
            return
        }
        
        let query = HKSampleQuery(sampleType: type, predicate: getYesterdayDateRange(), limit: 0, sortDescriptors: nil) { _, results, error in
            if let error = error {
                print("Error fetching activities: \(error)")
                completion([])
                return
            }
            
            guard let stepsSamples = results as? [HKQuantitySample] else {
                print("Error fetching activities")
                completion([])
                return
            }
            
            let activities = stepsSamples.map {
                Activity(
                    activityType: "Walking",
                    activityDuration: 0, // Replace with actual duration if available
                    activityCalories: Double($0.quantity.doubleValue(for: HKUnit.count())),
                    activityTime: $0.startDate // Using the start date of the sample as the activity time
                )
            }
            
            completion(activities)
        }
        
        healthStore.execute(query)
    }

    // Fetch Sleep Data for the previous day
    static func fetchSleepData(completion: @escaping (SleepData?) -> Void) {
        print("fetching sleep")
        let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        let query = HKSampleQuery(sampleType: sleepType, predicate: getYesterdayDateRange(), limit: 0, sortDescriptors: nil) { _, results, error in
            if let error = error {
                print("Error fetching sleep data: \(error)")
                completion(nil)
                return
            }
            
            guard let sleepSamples = results as? [HKCategorySample] else {
                print("error fetching sleep data")
                completion(nil)
                return
            }
            
            print("sleep results : \(results)")
            
            // Calculate the total hours slept
            var totalSleep = 0.0
            for sample in sleepSamples {
                let sleepTime = sample.endDate.timeIntervalSince(sample.startDate)
                totalSleep += sleepTime
            }
            
            let totalHours = totalSleep / 3600 // Convert time to hours
            completion(SleepData(sleptHours: totalHours))
        }
        healthStore.execute(query)
    }
    
    // Fetch Mindfulness Data for the previous day
    static func fetchMindfulnessData(completion: @escaping (MindfulnessData?) -> Void) {
        let mindfulnessType = HKObjectType.categoryType(forIdentifier: .mindfulSession)!
        let query = HKSampleQuery(sampleType: mindfulnessType, predicate: getYesterdayDateRange(), limit: 0, sortDescriptors: nil) { _, results, error in
            if let error = error {
                print("Error fetching mindfulness: \(error)")
                completion(nil)
                return
            }
            
            guard let mindfulnessSamples = results as? [HKCategorySample] else {
                print("error fetching mindfulness data")
                completion(nil)
                return
            }
            
            // Calculate total mindfulness time
            var totalMindfulnessTime = 0.0
            for sample in mindfulnessSamples {
                let mindfulnessDuration = sample.endDate.timeIntervalSince(sample.startDate)
                totalMindfulnessTime += mindfulnessDuration
            }
            
            let totalMinutes = totalMindfulnessTime / 60 // Convert time to minutes
            let status = totalMinutes > 0 ? "Practiced" : "Not Practiced" // Example status
            
            completion(MindfulnessData(status: status))
        }
        healthStore.execute(query)
    }
    
    static func fetchWeightData(completion: @escaping (Float?) -> Void) {
        guard let bodyMassType = HKObjectType.quantityType(forIdentifier: .bodyMass) else {
            print("Error setting up HKQuantityType for body mass")
            completion(nil)
            return
        }
        
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        
        let query = HKSampleQuery(sampleType: bodyMassType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { _, results, error in
            if let error = error {
                print("Error fetching latest weight: \(error)")
                completion(nil)
                return
            }
            
            if let lastWeightSample = results?.last as? HKQuantitySample {
                let lastWeight = lastWeightSample.quantity.doubleValue(for: HKUnit.gramUnit(with: .kilo))
                completion(Float(lastWeight))
            } else {
                completion(nil)
            }
        }
        
        healthStore.execute(query)
    }

    // Fetch Heart Data for the previous day
    static func fetchHeartData(completion: @escaping (HeartData?) -> Void) {
        let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
        
        // Prepare for statistical query
        let options: HKStatisticsOptions = [.discreteMax, .discreteMin, .discreteAverage]
        let statisticsQuery = HKStatisticsQuery(quantityType: heartRateType, quantitySamplePredicate: getYesterdayDateRange(), options: options) { _, statistics, error in
            if let error = error {
                print("Error fetching heart data: \(error)")
                completion(nil)
                return
            }
            
            guard let statistics = statistics else {
                print("error fecthing heart data")
                completion(nil)
                return
            }
            
            // Average BPM
            let avgHeartRate = statistics.averageQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0.0
            
            // Max BPM
            let maxHeartRate = statistics.maximumQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0.0
            
            // Min BPM
            let minHeartRate = statistics.minimumQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0.0
            
            // Create HeartData object
            let heartData = HeartData(avgBpm: avgHeartRate, maxBpm: maxHeartRate, minBpm: minHeartRate)
            completion(heartData)
        }
        
        healthStore.execute(statisticsQuery)
    }

    // Fetch All Data
    static func fetchAllHealthData(completion: @escaping (HealthData?) -> Void) {
        // Empty HealthData object to be populated
        var healthData = HealthData(activitiesData: [], sleepData: SleepData(sleptHours: 0), weightData: 0, heartData: HeartData(avgBpm: 0, maxBpm: 0, minBpm: 0), mindfulnessData: MindfulnessData(status: ""))
        
        let group = DispatchGroup()
        
        // Fetch activities
        group.enter()
        fetchActivitiesData { activities in
            healthData.activitiesData = activities
            group.leave()
        }
        
        // Fetch sleep
        group.enter()
        fetchSleepData { sleepData in
            healthData.sleepData = sleepData ?? SleepData(sleptHours: 0)
            group.leave()
        }
        
        // Fetch weight
        group.enter()
        fetchWeightData { weight in
            healthData.weightData = weight ?? 0
            group.leave()
        }
        
        // Fetch heart
        group.enter()
        fetchHeartData { heartData in
            healthData.heartData = heartData ?? HeartData(avgBpm: 0, maxBpm: 0, minBpm: 0)
            group.leave()
        }
        
        // Fetch mindfulness
        group.enter()
        fetchMindfulnessData { mindfulnessData in
            healthData.mindfulnessData = mindfulnessData ?? MindfulnessData(status: "")
            group.leave()
        }
        
        group.notify(queue: .main) {
            completion(healthData)
        }
    }
}
