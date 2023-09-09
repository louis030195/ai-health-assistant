//
//  FormView.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import GoTrue
import SafariServices
import Supabase
import SwiftUI

struct SafariView: UIViewControllerRepresentable {
    @Binding var url: URL

    func makeUIViewController(context: UIViewControllerRepresentableContext<SafariView>) -> SFSafariViewController {
        return SFSafariViewController(url: url)
    }

    func updateUIViewController(_ uiViewController: SFSafariViewController, context: UIViewControllerRepresentableContext<SafariView>) {}
}

struct SigninView: View {
    @EnvironmentObject var model: Model

    @State private var email = ""
    @State private var password = ""
    @State private var url: URL = .init(string: "https://randomUrl")!

    let client = SupabaseClient(supabaseURL: URL(string: Constants.supabaseUrl)!,
                                supabaseKey: Constants.supabaseKey)

    func loginInWithGoogle() {
        Task {
            do {
                print("sign in with google")
                url = try client.auth.getOAuthSignInURL(provider: Provider.google, redirectTo: URL(string: "mediar://auth-callback")!)
                print("url: \(url)")
                model.showSafari = true
            } catch {
                print("### Google Sign in Error: \(error)")
            }
        }
    }

    func loginClassic(email: String, password: String) {
        Task {
            do {
                try await client.auth.signIn(email: email, password: password)
                _ = try await client.auth.session
                model.loggedIn = true
            } catch {
                print("### Login Error: \(error)")
            }
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 32) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Sign in")
                        .font(Font.custom("Inter", size: 18).weight(.semibold))
                        .foregroundColor(Color.darkText)

                    Text("Sign in to your MediarAI account to connect your health data.")
                        .font(Font.custom("Inter", size: 14))
                        .foregroundColor(Color.lightText)

                    // HStack(spacing: 0) {
                    //     Text("You need first to create an account on ")
                    //         .font(Font.custom("Inter", size: 14))
                    //         .foregroundColor(Color.lightText)
                    //     Link("Mediar website.", destination: URL(string: "https://mediar.ai/signin")!)
                    //         .font(Font.custom("Inter", size: 14))
                    //         .foregroundColor(Color.lightText)
                    //         .underline(color: Color.blue)
                    // }
                }

                Button(action: loginInWithGoogle) {
                    HStack {
                        Image(systemName: "google.logo")
                            .foregroundColor(.white)
                        Text("Sign in with Google")
                            .foregroundColor(.white)
                    }
                    .padding(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal)
                    .background(
                        Rectangle()
                            .frame(maxWidth: .infinity)
                            .cornerRadius(8)
                            .foregroundColor(.black)
                    )
                }

                HStack {
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(Color.lightText)
                    Text("OR")
                        .font(.footnote)
                        .foregroundColor(Color.lightText)
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(Color.lightText)
                }

                VStack(alignment: .leading, spacing: 16) {
                    InputFieldView(label: "Email", value: $email, placeholder: "john@mediar.ai", isSecure: false)
                    InputFieldView(label: "Password", value: $password, placeholder: "*******", isSecure: true)
                }
                .frame(maxWidth: .infinity)

                HStack {
                    Spacer()
                    ButtonView(text: "Sign in", variant: .default) {
                        loginClassic(email: email, password: password)
                    }
                }
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(.white)
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .inset(by: 0.50)
                .stroke(Color.borderGray, lineWidth: 0.50)
        )
        .padding(.horizontal)
        .sheet(isPresented: $model.showSafari) {
            SafariView(url: $url)
        }
    }
}

struct SinginView_Previews: PreviewProvider {
    static var previews: some View {
        SigninView()
    }
}

