//
//  SyncView.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import Combine
import HealthKit
import Supabase
import SwiftUI

struct SyncView: View {
  @EnvironmentObject var model: Model
  @State private var showAlert = false
  @State private var message = ""
  @State private var isPhoneVerified: Bool = true  // default value

  let client = SupabaseClient(
    supabaseURL: URL(string: Constants.supabaseUrl)!,
    supabaseKey: Constants.supabaseKey)

  var body: some View {
    VStack {
      // if !isPhoneVerified {
      // WhatsappConnectView()
      //   .frame(maxWidth: .infinity, alignment: .center)
      //   .padding()
      // }

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
      Spacer()  // Pushes the link to the bottom

      Text("Delete your account and all your data")
        .font(.footnote)
        .foregroundColor(.blue)
        .underline()
        .onTapGesture {
          if let url = URL(string: "mailto:louis@mediar.ai") {
            UIApplication.shared.open(url)
          }
        }
        .padding()
    }
    .onAppear {
      Task {
        await fetchUserDetails()
      }
    }
    .navigationTitle("Mediar")
    .ignoresSafeArea(.keyboard, edges: .bottom)
    // .modifier(KeyboardAdaptive())
  }

  func fetchUserDetails() async {
    guard let user = try? await self.client.auth.session.user else { return }
    do {
      let result: Bool = try await self.client
        .database
        .from("users")
        .select(columns: "phone_verified")
        .eq(column: "id", value: user.id)
        .single()
        .execute()
        .value

      self.isPhoneVerified = result

    } catch {
      print("Failed to execute query: \(error)")
    }
  }
}

struct SyncView_Previews: PreviewProvider {
  static var previews: some View {
    SyncView()
  }
}

struct KeyboardAdaptive: ViewModifier {
  @State private var keyboardHeight: CGFloat = 0

  func body(content: Content) -> some View {
    content
      .padding(.bottom, keyboardHeight)
      .onReceive(Publishers.keyboardHeight) { self.keyboardHeight = $0 }
  }
}

extension Publishers {
  static var keyboardHeight: AnyPublisher<CGFloat, Never> {
    let willShow = NotificationCenter.default.publisher(
      for: UIApplication.keyboardWillShowNotification
    )
    .map { $0.keyboardHeight }

    let willHide = NotificationCenter.default.publisher(
      for: UIApplication.keyboardWillHideNotification
    )
    .map { _ in CGFloat(0) }

    return MergeMany(willShow, willHide)
      .eraseToAnyPublisher()
  }
}

extension Notification {
  var keyboardHeight: CGFloat {
    return (userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect)?.height ?? 0
  }
}
