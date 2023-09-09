// WhatsappConnectView.swift
import SwiftUI

struct WhatsappConnectView: View {
    @ObservedObject var viewModel = WhatsappConnectViewModel()

    var body: some View {
        VStack {
            TextField("Enter phone number", text: $viewModel.phoneNumber)
            if viewModel.showOtpInput {
                TextField("Enter OTP", text: $viewModel.otp)
            }
            Button(action: {
                viewModel.startVerification()
            }) {
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    Text("Send me a WhatsApp verification code")
                }
            }
        }
    }
}

struct WhatsappConnect_Previews: PreviewProvider {
    static var previews: some View {
        WhatsappConnectView()
    }
}
