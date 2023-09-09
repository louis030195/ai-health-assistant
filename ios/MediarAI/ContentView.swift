//
//  ContentView.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import Supabase
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var model: Model

    let client = SupabaseClient(supabaseURL: URL(string: Constants.supabaseUrl)!,
                                supabaseKey: Constants.supabaseKey)

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
        if !model.loggedIn {
            SigninView()
                .environment(\.colorScheme, .light)
        } else {
            SyncView()
                .environment(\.colorScheme, .light)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
