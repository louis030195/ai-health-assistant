import Combine
// SyncViewModel.swift
import SwiftUI

class WhatsappConnectViewModel: ObservableObject {
  // Define your properties here
  @Published var phoneNumber: String = ""
  @Published var otp: String = ""
  @Published var isLoading: Bool = false
  @Published var showOtpInput: Bool = false
  @Published var phoneNumberError: String = ""

  // Define your methods here
  func startVerification() {
    guard let url = URL(string: "https://mediar.ai/api/whatsapp-verification") else {
      return
    }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = try? JSONSerialization.data(withJSONObject: ["to": phoneNumber])
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")

    let task = URLSession.shared.dataTask(with: request) { (data, _, error) in
      if let error = error {
        print("Error: \(error)")
      } else if let data = data {
        // handle the response data
      }
    }
    task.resume()
  }

  func verifyOtp() {
    // Implement your verifyOtp logic here
  }
}
