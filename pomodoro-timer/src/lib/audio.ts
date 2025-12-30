export class AudioPlayer {
    private audioContext: AudioContext | null = null
    private isInitialized = false

    private async init(): Promise<void> {
        if (this.isInitialized) return

        try {
            this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
            this.isInitialized = true
        } catch (error) {
            console.warn('Audio API not supported:', error)
        }
    }

    private createOscillator(type: OscillatorType = 'sine', frequency = 440, duration = 0.5): void {
        if (!this.audioContext) return

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.type = type
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.start()
        oscillator.stop(this.audioContext.currentTime + duration)
    }

    async playStartSound(): Promise<void> {
        await this.init()
        if (!this.audioContext) return

        // Quick ascending tone
        this.createOscillator('sine', 523.25, 0.2) // C5
    }

    async playEndSound(): Promise<void> {
        await this.init()
        if (!this.audioContext) return

        // Three descending tones
        setTimeout(() => this.createOscillator('sine', 659.25, 0.3), 0) // E5
        setTimeout(() => this.createOscillator('sine', 523.25, 0.3), 200) // C5
        setTimeout(() => this.createOscillator('sine', 392.00, 0.3), 400) // G4
    }

    async playButtonSound(): Promise<void> {
        await this.init()
        if (!this.audioContext) return

        // Soft click sound
        this.createOscillator('square', 880, 0.1) // A5
    }

    resume(): void {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume()
        }
    }
}

export const audioPlayer = new AudioPlayer()