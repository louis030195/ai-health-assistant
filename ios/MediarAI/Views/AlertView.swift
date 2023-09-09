//
//  SignupView.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import SwiftUI

struct AlertDialogView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Are you sure absolutely sure?")
                    .font(Font.custom("Inter", size: 18).weight(.semibold))
                    .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))
                Text("This action cannot be undone. This will permanently delete your account and remove your data from our servers.")
                    .font(Font.custom("Inter", size: 14))
                    .foregroundColor(Color(red: 0.39, green: 0.45, blue: 0.55))
            }
            HStack(spacing: 8) {
                Spacer()
                ButtonView(text: "Cancel", variant: .outline) {
                    print("Cancel button clicked!")
                }

                ButtonView(text: "Continue", variant: .default) {
                    print("Continue button clicked!")
                }
            }
            .frame(maxWidth: .infinity)
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(.white)
        .cornerRadius(6)
        .overlay(
            RoundedRectangle(cornerRadius: 6)
                .inset(by: 0.50)
                .stroke(Color(red: 0.80, green: 0.84, blue: 0.88), lineWidth: 0.50)
        )
        .padding(.horizontal)
    }
}

struct Singin_Previews: PreviewProvider {
    static var previews: some View {
        SigninView()
    }
}
