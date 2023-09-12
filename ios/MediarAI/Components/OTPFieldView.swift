import SwiftUI

struct OTPFieldView: UIViewRepresentable {
    @Binding var otp: String

    func makeUIView(context: Context) -> OTPStackView {
        let otpView = OTPStackView()
        otpView.delegate = context.coordinator
        return otpView
    }

    func updateUIView(_ uiView: OTPStackView, context: Context) {
        // Update your view here
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, OTPDelegate {
        var parent: OTPFieldView

        init(_ parent: OTPFieldView) {
            self.parent = parent
        }

        func didChangeValidity(isValid: Bool) {
            // Handle validity change
        }
    }
}
