import Foundation
import AVFoundation
import MediaPlayer

final class AudioPlayerEngine: NSObject, ObservableObject, AVSpeechSynthesizerDelegate {
    static let shared = AudioPlayerEngine()
    
    private let speechSynthesizer = AVSpeechSynthesizer()
    
    @Published var isPlaying = false
    @Published var isPaused = false
    @Published var currentBookTitle = ""
    @Published var currentAuthor = ""
    
    override private init() {
        super.init()
        speechSynthesizer.delegate = self
        setupAudioSession()
    }
    
    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
            try session.setActive(true)
        } catch {
            print("[AudioPlayerEngine] Session error: \(error)")
        }
    }
    
    func playSpeech(text: String, title: String, author: String) {
        // 1. Immediately kill any currently playing or queued utterance
        if speechSynthesizer.isSpeaking {
            speechSynthesizer.stopSpeaking(at: .immediate)
        }
        
        currentBookTitle = title
        currentAuthor = author
        isPlaying = true
        isPaused = false
        
        let utterance = AVSpeechUtterance(string: text)
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate
        
        // Select Enhanced or Premium Apple Voice if available on device
        let allVoices = AVSpeechSynthesisVoice.speechVoices()
        let enhancedVoice = allVoices.first { v in
            v.language.starts(with: "en") && (v.quality == .enhanced || v.quality == .premium)
        } ?? AVSpeechSynthesisVoice(language: "en-US")
        
        utterance.voice = enhancedVoice
        
        speechSynthesizer.speak(utterance)
        updateNowPlaying(title: title, author: author, isPlaying: true)
    }
    
    func pauseSpeech() {
        if speechSynthesizer.isSpeaking && !speechSynthesizer.isPaused {
            speechSynthesizer.pauseSpeaking(at: .immediate)
            isPaused = true
            updateNowPlaying(title: currentBookTitle, author: currentAuthor, isPlaying: false)
        }
    }
    
    func resumeSpeech() {
        if speechSynthesizer.isPaused {
            speechSynthesizer.continueSpeaking()
            isPaused = false
            isPlaying = true
            updateNowPlaying(title: currentBookTitle, author: currentAuthor, isPlaying: true)
        }
    }
    
    func stop() {
        speechSynthesizer.stopSpeaking(at: .immediate)
        isPlaying = false
        isPaused = false
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
    }
    
    // MARK: - AVSpeechSynthesizerDelegate
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async {
            self.isPlaying = false
            self.isPaused = false
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        }
    }
    
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async {
            self.isPlaying = false
            self.isPaused = false
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        }
    }
    
    private func updateNowPlaying(title: String, author: String, isPlaying: Bool) {
        var nowPlayingInfo = [String: Any]()
        nowPlayingInfo[MPMediaItemPropertyTitle] = title
        nowPlayingInfo[MPMediaItemPropertyArtist] = author
        nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = "MindSprint Book Synthesis"
        nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = isPlaying ? 1.0 : 0.0
        
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
}
