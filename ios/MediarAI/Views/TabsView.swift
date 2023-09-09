//
//  SigninView.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import SwiftUI

struct TabsView: View {
    var body: some View {
        HStack(alignment: .top, spacing: 0) {
            HStack(alignment: .top, spacing: 10) {
                Text("Account")
                    .font(Font.custom("Inter", size: 14).weight(.medium))
                    .lineSpacing(20)
                    .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))
            }
            .padding(EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12))
            .background(.white)
            .cornerRadius(3)
            HStack(alignment: .top, spacing: 10) {
                Text("Password")
                    .font(Font.custom("Inter", size: 14).weight(.medium))
                    .lineSpacing(20)
                    .foregroundColor(Color(red: 0.20, green: 0.25, blue: 0.33))
            }
            .padding(EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12))
            .cornerRadius(3)
        }
        .padding(5)
        .frame(width: 180, height: 42)
        .background(Color(red: 0.95, green: 0.96, blue: 0.98))
        .cornerRadius(6)
    }
}

struct Tabs_Previews: PreviewProvider {
    static var previews: some View {
        TabsView()
    }
}
