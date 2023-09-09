//
//  Button.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import SwiftUI

enum ButtonVariant {
    case `default`, outline
}

struct ButtonView: View {
    let text: String
    let variant: ButtonVariant?
    let action: () -> Void

    static let defaultColor = Color(red: 0.06, green: 0.09, blue: 0.16)
    static let outlineColor = Color(red: 0.89, green: 0.91, blue: 0.94)
    static let whiteColor = Color.white

    var body: some View {
        Button(action: action) {
            Text(text)
                .font(Font.custom("Inter", size: 14).weight(.medium))
                .foregroundColor(textColor)
                .padding(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                .background(backgroundColor)
                .cornerRadius(6)
        }
        .overlay(
            RoundedRectangle(cornerRadius: 6)
                .inset(by: 0.50)
                .stroke(borderColor, lineWidth: 0.50)
        )
    }

    var textColor: Color {
        switch variant {
        case .default:
            return ButtonView.whiteColor
        case .outline, .none:
            return ButtonView.defaultColor
        }
    }

    var backgroundColor: Color {
        switch variant {
        case .default:
            return ButtonView.defaultColor
        case .outline, .none:
            return ButtonView.whiteColor
        }
    }

    var borderColor: Color {
        switch variant {
        case .default:
            return Color.clear
        case .outline, .none:
            return ButtonView.outlineColor
        }
    }
}
