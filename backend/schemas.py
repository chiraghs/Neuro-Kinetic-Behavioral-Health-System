from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
import time

class AutonomicState(str, Enum):
    HIGH_READINESS = "HIGH_READINESS"
    BALANCED = "BALANCED"
    ACUTE_STRESS = "ACUTE_STRESS"
    CHRONIC_FATIGUE = "CHRONIC_FATIGUE"

class RoutineType(str, Enum):
    KINETIC_QUEST = "KINETIC_QUEST"            # 15-min active mobility/cardio
    SOMATIC_FLOW = "SOMATIC_FLOW"              # 8-min gentle stretching & movement
    RESTORATIVE_RESET = "RESTORATIVE_RESET"    # 2-4 min parasympathetic breathwork

class TelemetryPayload(BaseModel):
    heart_rate: float = Field(..., ge=30, le=220, description="Beats per minute")
    hrv_rmssd: float = Field(..., ge=5, le=250, description="Root mean square of successive RR differences in ms")
    eeg_alpha_theta: float = Field(default=1.2, ge=0.1, le=5.0, description="Alpha to Theta power ratio (calm vs drowsy/stressed)")
    imu_movement_intensity: float = Field(default=0.4, ge=0.0, le=2.0, description="Kinematic acceleration norm")
    posture_alignment: float = Field(default=85.0, ge=0.0, le=100.0, description="Spinal symmetry score (0-100)")
    timestamp: float = Field(default_factory=time.time)

class AdaptiveGoalResponse(BaseModel):
    autonomic_state: AutonomicState
    allostatic_load_index: float = Field(..., ge=0.0, le=1.0, description="0=Optimal Recovery, 1=Extreme Strain")
    recommended_routine: RoutineType
    target_duration_minutes: int
    breath_pacing_seconds: float = Field(default=5.5, description="Inhale/Exhale duration in seconds for coherence")
    streak_shield_active: bool = False
    empathetic_explanation: str
    timestamp: float = Field(default_factory=time.time)

class HabitDayRecord(BaseModel):
    day_index: int
    date_str: str
    completed: bool
    streak_shield_used: bool
    routine_type: RoutineType
    resting_hrv: float
    adherence_streak: int

class DashboardSummaryResponse(BaseModel):
    total_days: int = 60
    adherence_rate_pct: float
    streak_shield_saves: int
    current_streak_days: int
    setback_recovery_velocity_hours: float
    baseline_hrv_gain_pct: float
    history: List[HabitDayRecord]
