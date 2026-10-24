import Foundation
import AVFoundation
import MediaPlayer

final class AudioPlayerEngine: ObservableObject {
    static let shared = AudioPlayerEngine()
    
    private let audioEngine = AVAudioEngine()
    private let playerNode = AVAudioPlayerNode()
    @Published var isPlaying = false
    @Published var currentBookTitle = ""
    @Published var currentAuthor = ""
    
    private init() {
        setupAudioSession()
        setupEngine()
    }
    
    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .spokenAudio, options: [])
            try session.setActive(true)
        } catch {
            print("[AudioPlayerEngine] Session error: \(error)")
        }
    }
    
    private func setupEngine() {
        audioEngine.attach(playerNode)
        
        // Anti-Leap 8: Use Float32 standard non-interleaved format for hardware compatibility
        let hardwareFormat = AVAudioFormat(standardFormatWithSampleRate: 44100, channels: 2)
        audioEngine.connect(playerNode, to: audioEngine.mainMixerNode, format: hardwareFormat)
        
        do {
            try audioEngine.start()
        } catch {
            print("[AudioPlayerEngine] Failed to start engine: \(error)")
        }
    }
    
    func playSpeech(text: String, title: String, author: String) {
        currentBookTitle = title
        currentAuthor = author
        isPlaying = true
        
        // Native AVSpeechSynthesizer with background audio ducking
        let utterance = AVSpeechUtterance(string: text)
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        
        let synth = AVSpeechSynthesizer()
        synth.speak(utterance)
        
        updateNowPlaying(title: title, author: author)
    }
    
    func stop() {
        playerNode.stop()
        isPlaying = false
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
    }
    
    private func updateNowPlaying(title: String, author: String) {
        var nowPlayingInfo = [String: Any]()
        nowPlayingInfo[MPMediaItemPropertyTitle] = title
        nowPlayingInfo[MPMediaItemPropertyArtist] = author
        nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = "MindSprint Book Synthesis"
        nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = 1.0
        
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
}
