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
    sandbox: false)
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    print("started launching")
    MetriportClient.checkBackgroundUpdates()  // add this line

    self.window?.overrideUserInterfaceStyle = .light


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
