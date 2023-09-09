//
//  Model.swift
//  MediarAI
//
//  Created by Louis AB on 01/09/2023.
//

import Foundation
import SwiftUI

class Model: ObservableObject {
    @Published var showTab: Bool = true
    @Published var showNav: Bool = true
    @Published var loggedIn: Bool = false
    @Published var showSafari: Bool = false
}
