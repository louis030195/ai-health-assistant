import Foundation
import SwiftUI

struct InputFieldView: View {
    let label: String
    @Binding var value: String
    let placeholder: String
    var isSecure: Bool = false

    var body: some View {
        VStack(alignment: .leading) {
            Text(label)
                .font(Font.custom("Inter", size: 14).weight(.medium))
                .foregroundColor(.black)

            if isSecure {
                SecureField(placeholder, text: $value)
                    .font(Font.custom("Inter", size: 14).weight(.medium))
                    .padding(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
                    .frame(maxWidth: .infinity, minHeight: 36, maxHeight: 36)
                    .background(.white)
                    .cornerRadius(6)
                    .overlay(
                        RoundedRectangle(cornerRadius: 6)
                            .inset(by: -0.50)
                            .stroke(Color.borderGray, lineWidth: 0.50)
                    )
                    .textContentType(.password) // Suggest password manager
            } else {
                TextField(placeholder, text: $value)
                    .font(Font.custom("Inter", size: 14).weight(.medium))
                    .padding(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
                    .frame(maxWidth: .infinity, minHeight: 36, maxHeight: 36)
                    .background(.white)
                    .cornerRadius(6)
                    .overlay(
                        RoundedRectangle(cornerRadius: 6)
                            .inset(by: -0.50)
                            .stroke(Color.borderGray, lineWidth: 0.50)
                    )
            }
        }
    }
}