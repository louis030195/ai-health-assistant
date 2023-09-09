//
//  AppView.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import Supabase
import SwiftUI

struct AppView: View {
    let client = SupabaseClient(supabaseURL: URL(string: Constants.supabaseUrl)!,
                                supabaseKey: Constants.supabaseKey)

    @EnvironmentObject var model: Model

    func checkSession() {
        Task {
            do {
                _ = try await client.auth.session
                model.loggedIn = true
            } catch {
                print("### ignore if session not found: \(error)")
            }
        }
    }

    var body: some View {
        ContentView()
            .onAppear {
                checkSession()
            }
    }
}

struct AppView_Previews: PreviewProvider {
    static var previews: some View {
        AppView()
    }
}
