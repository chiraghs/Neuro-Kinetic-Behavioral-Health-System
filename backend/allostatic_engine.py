"""
Adaptive Somatic Engine
Implements Allostatic Load Index (ALI) calculation and Goal Governor logic
based on the Neurovisceral Integration Model (Thayer & Lane).
"""

from schemas import TelemetryPayload, AdaptiveGoalResponse, AutonomicState, RoutineType
import math

class AllostaticEngine:
    def __init__(self, baseline_hrv: float = 65.0, baseline_eeg_ratio: float = 1.3):
        self.baseline_hrv = baseline_hrv
        self.baseline_eeg_ratio = baseline_eeg_ratio

    def compute_allostatic_load(self, telemetry: TelemetryPayload) -> float:
        """
        Calculates Allostatic Load Index (ALI) between 0.0 (optimal) and 1.0 (severe strain).
        Higher HRV -> lower load.
        Lower EEG alpha/theta or elevated heart rate relative to rest -> higher load.
        """
        # HRV component: normalized deviation from baseline
        hrv_ratio = telemetry.hrv_rmssd / self.baseline_hrv
        # S-curve dampening
        hrv_strain = 1.0 / (1.0 + math.exp(2.5 * (hrv_ratio - 0.85)))
        
        # Heart rate strain component (assuming resting baseline ~68 bpm)
        hr_strain = max(0.0, min(1.0, (telemetry.heart_rate - 65.0) / 75.0))
        
        # EEG cognitive load component
        eeg_strain = max(0.0, min(1.0, (self.baseline_eeg_ratio - telemetry.eeg_alpha_theta) / self.baseline_eeg_ratio))
        
        # Weighted aggregate
        ali = (0.50 * hrv_strain) + (0.25 * hr_strain) + (0.25 * eeg_strain)
        return round(max(0.0, min(1.0, ali)), 3)

    def evaluate(self, telemetry: TelemetryPayload, days_since_last_session: int = 0) -> AdaptiveGoalResponse:
        ali = self.compute_allostatic_load(telemetry)
        
        # Setback / Hiatus override (Zero-Drop Streak-Shield)
        if days_since_last_session >= 3:
            return AdaptiveGoalResponse(
                autonomic_state=AutonomicState.CHRONIC_FATIGUE if ali > 0.6 else AutonomicState.BALANCED,
                allostatic_load_index=ali,
                recommended_routine=RoutineType.RESTORATIVE_RESET,
                target_duration_minutes=2,
                breath_pacing_seconds=6.0,
                streak_shield_active=True,
                empathetic_explanation=(
                    f"Welcome back after {days_since_last_session} days. Rather than an overwhelming workout, "
                    "your Streak-Shield is activated with a gentle 2-minute nervous system calibration to rebuild momentum guilt-free."
                )
            )

        # Normal physiological adaptation based on live Allostatic Load
        if ali < 0.35:
            state = AutonomicState.HIGH_READINESS
            routine = RoutineType.KINETIC_QUEST
            duration = 15
            pacing = 4.5
            explanation = (
                f"High autonomic readiness detected (HRV: {telemetry.hrv_rmssd:.0f}ms). "
                "Your nervous system is primed for today's 15-minute kinetic mobility & cardio quest."
            )
            shield = False

        elif ali < 0.65:
            state = AutonomicState.BALANCED
            routine = RoutineType.SOMATIC_FLOW
            duration = 8
            pacing = 5.5
            explanation = (
                f"Balanced baseline detected (Allostatic Load: {ali:.2f}). "
                "Prescribed an 8-minute fluid somatic stretch and spinal posture reset."
            )
            shield = False

        else:
            state = AutonomicState.ACUTE_STRESS
            routine = RoutineType.RESTORATIVE_RESET
            duration = 4
            pacing = 6.5  # Slower parasympathetic vagus breathing
            explanation = (
                f"Elevated nervous system strain detected (HRV suppressed to {telemetry.hrv_rmssd:.0f}ms). "
                "Your goal has automatically downscaled to 4 minutes of guided parasympathetic breathwork. Streaks protected."
            )
            shield = True

        return AdaptiveGoalResponse(
            autonomic_state=state,
            allostatic_load_index=ali,
            recommended_routine=routine,
            target_duration_minutes=duration,
            breath_pacing_seconds=pacing,
            streak_shield_active=shield,
            empathetic_explanation=explanation
        )

engine = AllostaticEngine()
