//
//  MediarAIApp.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import BackgroundTasks
import HealthKit
import MetriportSDK  // add this line
import Supabase
import SwiftUI

class AppDelegate: NSObject, UIApplicationDelegate {
  // let healthStore = HKHealthStore()
  var window: UIWindow?
  let healthStore = MetriportHealthStoreManager(
    clientApiKey: Constants.metriportKey,
    sandbox: true)
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    print("started launching")
    MetriportClient.checkBackgroundUpdates()  // add this line
    // if #available(iOS 13.0, *) {
    // Always adopt a light interface style.
    self.window?.overrideUserInterfaceStyle = .light
    // }

    // BGTaskScheduler.shared.register(forTaskWithIdentifier: "ai.mediar.syncHealthData", using: nil) {
    //   task in
    //   if let bgRefreshTask = task as? BGAppRefreshTask {
    //     let syncViewModel = SyncViewModel()
    //     syncViewModel.handleAppRefresh(task: bgRefreshTask)
    //   }
    // }

    // let readTypes: Set<HKObjectType> = [
    //   HKObjectType.quantityType(forIdentifier: .appleExerciseTime)!,
    //   HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
    //   HKObjectType.quantityType(forIdentifier: .bodyMass)!,
    //   HKObjectType.quantityType(forIdentifier: .heartRate)!,
    //   HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
    //   HKObjectType.categoryType(forIdentifier: .mindfulSession)!,
    //   HKObjectType.characteristicType(forIdentifier: .bloodType)!,
    //   HKObjectType.characteristicType(forIdentifier: .biologicalSex)!,
    //   HKObjectType.quantityType(forIdentifier: .bodyMass)!,
    //   HKObjectType.quantityType(forIdentifier: .bodyMassIndex)!,
    //   HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
    //   HKObjectType.quantityType(forIdentifier: .stepCount)!
    // ]

    // // Request HealthKit permissions
    // healthStore.requestAuthorization(toShare: [], read: readTypes) { success, error in
    //   if let error = error {
    //     print("Error requesting HealthKit permissions: \(error.localizedDescription)")
    //     return
    //   }

    //   if success {
    //     print("Successfully received HealthKit permissions")
    //   } else {
    //     print("Failed to receive HealthKit permissions")
    //   }
    // }

    return true
  }
}

@main
struct MediarAIApp: App {
  @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
  var model = Model()

  var body: some Scene {
    WindowGroup {
      AppView()
        .environmentObject(model)
        // .environment(\.colorScheme, .light)
        .preferredColorScheme(.light)
        .onOpenURL(perform: handleURL)
    }
  }

  func handleURL(_ url: URL) {
    if url.host == "auth-callback" {
      let client = SupabaseClient(
        supabaseURL: URL(string: Constants.supabaseUrl)!,
        supabaseKey: Constants.supabaseKey)
      Task {
        do {
          _ = try await client.auth.session(from: url)
          model.loggedIn = true
          print("### Successful oAuth")
        } catch {
          print("### oAuthCallback error: \(error)")
        }
      }
    }
  }
}
