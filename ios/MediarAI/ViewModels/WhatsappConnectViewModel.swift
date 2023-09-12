import Combine
import Supabase
import SwiftUI

class WhatsappConnectViewModel: ObservableObject {
  @Published var countryCode: UInt64? = 1
  @Published var phoneNumber: String = ""
  @Published var phoneNumberError: String = ""
  @Published var otp: String = ""
  @Published var showOtpInput: Bool = false
  @Published var isLoading: Bool = false

  @Published var isOTPSent: Bool = false
  @Published var isOTPVerified: Bool = false
  @Published var isOTPVerificationFailed: Bool = false

  let client = SupabaseClient(
    supabaseURL: URL(string: Constants.supabaseUrl)!,
    supabaseKey: Constants.supabaseKey)

  func updateCountryCode(for countryCode: UInt64) {
    self.countryCode = countryCode
  }
  func checkOtpLength(for otp: String) {
    if otp.count == 6 {
      Task {
        await verifyOtp()
      }
    }
  }
  func validatePhoneNumber() {
    print(phoneNumber)
    let phoneNumberRegex = "^\\+[1-9]\\d{1,14}$"
    let phoneNumberTest = NSPredicate(format: "SELF MATCHES %@", phoneNumberRegex)
    if phoneNumberTest.evaluate(with: phoneNumber) {
      phoneNumberError = ""
    } else {
      phoneNumberError = "Invalid phone number"
    }
  }

  func startVerification() {

    if phoneNumberError == "" {
      self.showOtpInput = true
      isLoading = true
      guard let url = URL(string: "https://mediar.ai/api/whatsapp-verification") else {
        return
      }
      var request = URLRequest(url: url)
      request.httpMethod = "POST"

      // merge `+${countryCode}${phoneNumber}` into a single string
      // let number = "+\(countryCode ?? 1)\(phoneNumber)"
      request.httpBody = try? JSONSerialization.data(withJSONObject: ["to": phoneNumber])
      request.addValue("application/json", forHTTPHeaderField: "Content-Type")

      let task = URLSession.shared.dataTask(with: request) { (data, _, error) in
        if let error = error {
          print("Error: \(error)")
        } else if let data = data {
          // handle the response data
        }
      }
      self.isLoading = false
      self.isOTPSent = true

      task.resume()
    }
  }

  func verifyOtp() async {
    guard let url = URL(string: "https://mediar.ai/api/whatsapp-verification-otp") else {
      return
    }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    var userId: UUID
    do {
      userId = try await self.client.auth.session.user.id
    } catch {
      print("Error: \(error)")
      return
    }

    request.httpBody = try? JSONSerialization.data(withJSONObject: [
      "to": phoneNumber, "otp": otp, "id": userId
    ])
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")

    let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
      if let error = error {
        print("Error: \(error)")
      } else if let data = data, let httpResponse = response as? HTTPURLResponse {
        if httpResponse.statusCode == 200 {
          // OTP verification was successful
          self.isOTPVerified = true
        } else {
          // OTP verification failed
          self.isOTPVerificationFailed = true
        }
      }
    }
    task.resume()
  }
}
