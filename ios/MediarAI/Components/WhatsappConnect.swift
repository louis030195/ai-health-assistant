import PhoneNumberKit
import SwiftUI

struct WhatsappConnectView: View {
  @ObservedObject var viewModel = WhatsappConnectViewModel()

  var body: some View {
    VStack(alignment: .center) {
      //   InputFieldView(
      //     label: "Phone Number",
      //     value: $viewModel.phoneNumber,
      //     placeholder: "Enter your phone number",
      //     isSecure: false)
      PhoneNumberField(
        phoneNumber: Binding<String>(
          get: { self.viewModel.phoneNumber },
          set: { self.viewModel.phoneNumber = $0 }
        ))

      if viewModel.showOtpInput {
        OTPFieldView(otp: $viewModel.otp)
          .onChange(of: viewModel.otp) { newValue in
            viewModel.checkOtpLength(for: newValue)
          }
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
      .disabled(viewModel.phoneNumberError != "" || viewModel.isLoading)
      .alert(isPresented: $viewModel.isOTPSent) {
        Alert(
          title: Text("OTP Sent"),
          message: Text("Your OTP has been sent. Please check your WhatsApp messages."),
          dismissButton: .default(Text("OK")))
      }
      .alert(isPresented: $viewModel.isOTPVerified) {
        Alert(
          title: Text("OTP Verified"), message: Text("Your OTP has been verified successfully."),
          dismissButton: .default(Text("OK")))
      }
      .alert(isPresented: $viewModel.isOTPVerificationFailed) {
        Alert(
          title: Text("OTP Verification Failed"),
          message: Text("The OTP you entered is incorrect. Please try again."),
          dismissButton: .default(Text("OK")))
      }
    }.frame(maxWidth: .infinity, alignment: .center)
  }
}

struct WhatsappConnect_Previews: PreviewProvider {
  static var previews: some View {
    WhatsappConnectView()
  }
}
