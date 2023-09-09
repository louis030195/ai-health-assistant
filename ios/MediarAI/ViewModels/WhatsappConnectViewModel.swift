// SyncViewModel.swift
import SwiftUI
import Combine

class WhatsappConnectViewModel: ObservableObject {
    // Define your properties here
    @Published var phoneNumber: String = ""
    @Published var otp: String = ""
    @Published var isLoading: Bool = false
    @Published var showOtpInput: Bool = false
    @Published var phoneNumberError: String = ""

    // Define your methods here
    func startVerification() {
        // Implement your startVerification logic here
        // TODO: expose api in vercel thing
    }

    func verifyOtp() {
        // Implement your verifyOtp logic here
    }
}