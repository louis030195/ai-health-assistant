//
//  SyncView.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import HealthKit
import Supabase
import SwiftUI

struct SyncView: View {
  @EnvironmentObject var model: Model
  @State private var showAlert = false
  @State private var message = ""
  let client = SupabaseClient(
    supabaseURL: URL(string: Constants.supabaseUrl)!,
    supabaseKey: Constants.supabaseKey)

  var body: some View {
    VStack {
      // WhatsappConnectView()
      //   .frame(maxWidth: .infinity, alignment: .center)
      //   .padding()

      Text("Connect your health sources")
        .font(.largeTitle)
        .frame(maxWidth: .infinity, alignment: .center)
        .padding()
      Text(
        "This will let Mediar access your health data and be personalised to you. Just click once here."
      )
      .frame(maxWidth: .infinity, alignment: .center)
      .padding()

      MetriportView()

      // ButtonView(text: "Connect Apple Health", variant: .default) {
      //   HealthKitService.fetchAllHealthData { healthData in
      //     if let healthData = healthData {
      //       print("fetched data")
      //       Task {
      //         do {
      //           let result = await HealthDatabaseService.uploadData(healthData: healthData)
      //           let (success, error) = (result.0, result.1)
      //           if success {
      //             message = "Successfully uploaded data to database!"
      //           } else {
      //             message = "Error while uploading data to database: \(error ?? "")"
      //           }
      //           showAlert = true
      //         } catch {
      //           message = "Error while uploading data to database: \(error)"
      //           showAlert = true
      //           print("Error while uploading data to database: \(error)")
      //         }
      //       }
      //     } else {
      //       print("error while fetching data")
      //       message = "Error while fetching health data"
      //       showAlert = true
      //     }
      //   }
      // }
      // .alert(isPresented: $showAlert) {
      //   Alert(
      //     title: Text("Upload Status"), message: Text(message), dismissButton: .default(Text("OK")))
      // }

      Text("Just head back to WhatsApp after this, the main interface of Mediar.")
        .font(.subheadline)
        .foregroundColor(.gray)
        .frame(maxWidth: .infinity, alignment: .center)
        .padding()

      Button(action: {
        if let url = URL(string: "whatsapp://send?phone=+18643852799") {
          if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
          }
        }
      }) {
        Text("Open WhatsApp")
          .font(.subheadline)
          .foregroundColor(.blue)
          .padding(10)
          .overlay(
            RoundedRectangle(cornerRadius: 10)
              .stroke(Color.blue, lineWidth: 1)
          )
      }

      .frame(maxWidth: .infinity, alignment: .center)

      HStack(spacing: 0) {
        Text("First, verify your number on ")
          .font(.subheadline)
          .foregroundColor(.gray)
        Text("mediar.ai/account")
          .font(.subheadline)
          .foregroundColor(.blue)
          .underline()
          .onTapGesture {
            if let url = URL(string: "https://mediar.ai/account") {
              UIApplication.shared.open(url)
            }
          }
      }
      .frame(maxWidth: .infinity, alignment: .center)
      // ButtonView(text: "Disconnect", variant: .default) {
      //         Task {
      //             do {
      //                 try await self.client.auth.signOut()
      //                 model.loggedIn = false
      //             } catch {
      //                 print("Error while signing out: \(error)")
      //             }
      //         }
      //     }

    }.navigationTitle("Sync Health Data")
  }
}

struct SyncView_Previews: PreviewProvider {
  static var previews: some View {
    SyncView()
  }
}
