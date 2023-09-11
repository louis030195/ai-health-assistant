import Foundation
import MetriportSDK
import Supabase
import SwiftUI

class WidgetController: ObservableObject {
  @Published var showWidget = false
  var token = ""

  func openWidget(token: String) {
    self.showWidget = true
    self.token = token
  }

}

struct MetriportView: View {
  @ObservedObject var widgetController = WidgetController()
  let client = SupabaseClient(
    supabaseURL: URL(string: Constants.supabaseUrl)!,
    supabaseKey: Constants.supabaseKey)
  let healthStore = MetriportHealthStoreManager(
    clientApiKey: Constants.metriportKey,
    sandbox: true)

  var body: some View {
    VStack {
      ButtonView(text: "Connect your health sources", variant: .default) {
        Task {
          await fetchTokenAndOpenWidget()
        }
      }
      .sheet(isPresented: $widgetController.showWidget) {
        MetriportWidget(
          healthStore: healthStore,
          token: widgetController.token,
          sandbox: true,
          colorMode: ColorMode.light,
          providers: ["fitbit", "garmin", "withings", "apple", "oura", "googlefit", "whoop"]
        )
      }
    }
    .padding()
  }

  func fetchTokenAndOpenWidget() async {
    // https://mediar.ai/api/metriport-token
    // http://localhost:3000/api/metriport-token
    guard let url = URL(string: "https://mediar.ai/api/metriport-token") else { return }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    do {
      let userId = try await self.client.auth.session.user.id
      print(userId)

      // Convert userId into a JSON object
      let json: [String: Any] = ["userId": userId.uuidString]
      let jsonData = try? JSONSerialization.data(withJSONObject: json)

      request.httpBody = jsonData
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")

      let (data, _) = try await URLSession.shared.data(for: request)
      print(data)
      // Parse the JSON data to get the token
      if let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
        let token = json["token"] as? String {
        print(token)
        DispatchQueue.main.async {
          self.widgetController.openWidget(token: token)
        }
      } else {
        print("Error: Could not parse token from JSON")
      }

    } catch {
      print("Error: \(error)")
    }
  }
}
