import SwiftUI
import StoreKit

struct ContentView: View {
    @Environment(\.requestReview) private var requestReview
    @StateObject private var audio = AudioPlayerEngine.shared
    @State private var selectedDepth: Int = 0 // 0: Spark, 1: Core, 2: Masterclass
    @State private var showSynthesizeSheet = false
    @State private var searchText = ""
    
    private let obsidianBg = Color(red: 8/255, green: 9/255, blue: 14/255)
    private let goldAccent = Color(red: 229/255, green: 193/255, blue: 125/255)
    
    var body: some View {
        NavigationStack {
            ZStack {
                obsidianBg.ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        
                        // Hero Executive Header
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("MINDSPRINT")
                                    .font(.system(size: 14, weight: .bold, design: .serif))
                                    .tracking(4)
                                    .foregroundColor(goldAccent)
                                
                                Spacer()
                                
                                Button(action: { showSynthesizeSheet = true }) {
                                    Label("Synthesize", systemImage: "sparkles")
                                        .font(.system(size: 12, weight: .bold))
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(goldAccent)
                                        .foregroundColor(.black)
                                        .cornerRadius(20)
                                }
                            }
                            
                            Text("The Executive\nSynthesis Engine.")
                                .font(.system(size: 32, weight: .black, design: .serif))
                                .foregroundColor(.white)
                                .lineLimit(2)
                            
                            Text("1-Min Spark • 15-Min Blink • 40-Min Masterclass")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.gray)
                        }
                        .padding(.horizontal)
                        .padding(.top, 10)
                        
                        // Persistent App Store Rating Banner (Rule 7 Standard)
                        HStack(spacing: 12) {
                            Image(systemName: "star.fill")
                                .foregroundColor(goldAccent)
                                .font(.system(size: 20))
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Enjoying MindSprint?")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Tap to rate on the App Store (un-gated)")
                                    .font(.system(size: 11))
                                    .foregroundColor(.gray)
                            }
                            Spacer()
                            Button("Rate") {
                                requestReview()
                            }
                            .font(.system(size: 12, weight: .bold))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 6)
                            .background(Color.white.opacity(0.1))
                            .foregroundColor(goldAccent)
                            .cornerRadius(12)
                        }
                        .padding(14)
                        .background(Color(red: 20/255, green: 23/255, blue: 34/255))
                        .cornerRadius(16)
                        .padding(.horizontal)
                        
                        // Featured Cornerstone Books Carousel with Real Covers
                        VStack(alignment: .leading, spacing: 12) {
                            Text("CORNERSTONE CANON")
                                .font(.system(size: 11, weight: .bold))
                                .tracking(2)
                                .foregroundColor(.gray)
                                .padding(.horizontal)
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    iOSBookCardView(
                                        title: "Thinking, Fast and Slow",
                                        author: "Daniel Kahneman",
                                        thesis: "System 1 vs System 2 cognitive architecture and heuristics.",
                                        year: "2011",
                                        coverUrl: "https://covers.openlibrary.org/b/id/13290711-L.jpg"
                                    )
                                    iOSBookCardView(
                                        title: "Atomic Habits",
                                        author: "James Clear",
                                        thesis: "You do not rise to your goals; you fall to your systems.",
                                        year: "2018",
                                        coverUrl: "https://covers.openlibrary.org/b/id/12539702-L.jpg"
                                    )
                                    iOSBookCardView(
                                        title: "Principles",
                                        author: "Ray Dalio",
                                        thesis: "Radical truth, transparency and believability-weighted decisions.",
                                        year: "2017",
                                        coverUrl: "https://covers.openlibrary.org/b/id/8315355-L.jpg"
                                    )
                                    iOSBookCardView(
                                        title: "Zero to One",
                                        author: "Peter Thiel",
                                        thesis: "Competition is for losers. Aim for creative monopoly.",
                                        year: "2014",
                                        coverUrl: "https://covers.openlibrary.org/b/id/9002334-L.jpg"
                                    )
                                }
                                .padding(.horizontal)
                            }
                        }
                        
                    }
                    .padding(.bottom, 60)
                }
            }
            .navigationBarHidden(true)
        }
    }
}

struct iOSBookCardView: View {
    let title: String
    let author: String
    let thesis: String
    let year: String
    var coverUrl: String? = nil
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            ZStack(alignment: .bottomLeading) {
                // Hardcover Spine Container
                RoundedRectangle(cornerRadius: 12)
                    .fill(LinearGradient(colors: [Color(red: 26/255, green: 28/255, blue: 38/255), Color(red: 12/255, green: 13/255, blue: 18/255)], startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 170, height: 240)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.white.opacity(0.12), lineWidth: 1)
                    )
                
                // Real Book Cover Image via AsyncImage
                if let coverUrl = coverUrl, let url = URL(string: coverUrl) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 170, height: 240)
                                .clipped()
                                .cornerRadius(12)
                                .overlay(
                                    // 3D Realistic Spine Crease Shadow
                                    HStack {
                                        LinearGradient(colors: [Color.black.opacity(0.7), Color.black.opacity(0.2), Color.clear], startPoint: .leading, endPoint: .trailing)
                                            .frame(width: 14)
                                        Spacer()
                                    }
                                )
                                .overlay(
                                    // Subtle Bottom Vignette for text contrast
                                    VStack {
                                        Spacer()
                                        LinearGradient(colors: [Color.clear, Color.black.opacity(0.8)], startPoint: .top, endPoint: .bottom)
                                            .frame(height: 70)
                                    }
                                    .cornerRadius(12)
                                )
                        default:
                            EmptyView()
                        }
                    }
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(year)
                        .font(.system(size: 9, weight: .bold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.black.opacity(0.6))
                        .foregroundColor(.white)
                        .cornerRadius(4)
                    
                    Text(title)
                        .font(.system(size: 14, weight: .bold, design: .serif))
                        .foregroundColor(.white)
                        .lineLimit(2)
                        .shadow(radius: 2)
                    
                    Text(author)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                        .shadow(radius: 2)
                }
                .padding(12)
            }
            .shadow(color: Color.black.opacity(0.4), radius: 8, x: 0, y: 4)
            
            Text(thesis)
                .font(.system(size: 11))
                .foregroundColor(.gray)
                .lineLimit(2)
                .frame(width: 170, alignment: .leading)
        }
    }
}
