import SwiftUI
import PhoneNumberKit

struct PhoneNumberField: UIViewRepresentable {
    @Binding var phoneNumber: String
    private let phoneNumberKit = PhoneNumberKit()

    func makeUIView(context: Context) -> PhoneNumberTextField {
        let phoneNumberTextField = PhoneNumberTextField(withPhoneNumberKit: phoneNumberKit)
        phoneNumberTextField.delegate = context.coordinator
        phoneNumberTextField.withFlag = true
        phoneNumberTextField.withExamplePlaceholder = true
        phoneNumberTextField.keyboardType = .numberPad
        phoneNumberTextField.withDefaultPickerUI = true
        //phoneNumberTextField.addTarget(self, action: #selector(checkMaxLength), for: .editingChanged)
        return phoneNumberTextField
    }

    func updateUIView(_ uiView: PhoneNumberTextField, context: Context) {
        uiView.text = phoneNumber
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: PhoneNumberField

        init(_ parent: PhoneNumberField) {
            self.parent = parent
        }

        func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
            if let text = textField.text,
               let textRange = Range(range, in: text) {
                let updatedText = text.replacingCharacters(in: textRange, with: string)
                parent.phoneNumber = updatedText
            }
            return true
        }
    }
}
