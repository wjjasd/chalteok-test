'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import StepLayout from '@/components/StepLayout'

const AGE_GROUPS = [
  { value: 'teens', label: '10대' },
  { value: 'early_20s', label: '20대 초반' },
  { value: 'mid_20s', label: '20대 중반' },
  { value: 'late_20s', label: '20대 후반' },
  { value: 'early_30s', label: '30대 초반' },
  { value: 'mid_30s', label: '30대 중반' },
  { value: 'late_30s', label: '30대 후반' },
  { value: 'early_40s', label: '40대 초반' },
  { value: 'mid_40s', label: '40대 중반' },
  { value: 'late_40s', label: '40대 후반' },
  { value: 'early_50s', label: '50대 초반' },
  { value: 'mid_50s', label: '50대 중반' },
  { value: 'late_50s', label: '50대 후반' },
  { value: '60s_plus', label: '60대 이상' },
]

const GENDERS = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'nonbinary', label: '기타 성별' },
  { value: 'prefer_not', label: '응답하지 않음' },
]

const RELATIONSHIP_STAGES = [
  { value: 'first_meeting', label: '소개팅·첫만남' },
  { value: 'one_to_three_months', label: '1~3개월' },
  { value: 'three_to_six_months', label: '3~6개월' },
  { value: 'six_months_plus', label: '6개월~1년' },
  { value: 'one_year_plus', label: '1년 이상' },
  { value: 'cohabiting', label: '동거·약혼·결혼' },
]

const PAST_RELATIONSHIPS = [
  { value: '0', label: '0회' },
  { value: '1_2', label: '1~2회' },
  { value: '3_5', label: '3~5회' },
  { value: '6_plus', label: '6회 이상' },
]

const IMPORTANT_VALUES = [
  { value: 'attraction',          label: '설렘·끌림' },
  { value: 'communication',       label: '대화' },
  { value: 'emotional_stability', label: '감정 안정' },
  { value: 'values',              label: '가치관' },
  { value: 'lifestyle',           label: '생활습관' },
  { value: 'trust',               label: '신뢰' },
  { value: 'relational_dynamics', label: '갈등 회복' },
  { value: 'self_growth',         label: '자존감' },
]

const EMOTIONAL_STATES = [
  { value: 'stable', label: '안정적' },
  { value: 'normal', label: '보통' },
  { value: 'somewhat_unstable', label: '다소 불안정' },
  { value: 'very_unstable', label: '매우 불안정' },
]

const CONFLICT_FREQUENCIES = [
  { value: 'rarely', label: '거의 없음' },
  { value: 'monthly', label: '월 1~2회' },
  { value: 'weekly', label: '주 1~2회' },
  { value: 'daily', label: '거의 매일' },
]

function SelectField({
  label,
  required,
  options,
  value,
  onChange,
}: {
  label: string
  required?: boolean
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-2.5 rounded-xl text-sm border transition-colors ${
              value === opt.value
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const profile = useQuizStore((s) => s.profile)
  const setProfile = useQuizStore((s) => s.setProfile)
  const applyRecommendedWeights = useQuizStore((s) => s.applyRecommendedWeights)

  const toggleValue = (v: string) => {
    const current = profile.importantValues
    if (current.includes(v)) {
      setProfile({ importantValues: current.filter((x) => x !== v) })
    } else {
      setProfile({ importantValues: [...current, v] })
    }
  }

  const canProceed = profile.ageGroup && profile.relationshipStage && profile.importantValues.length > 0

  return (
    <StepLayout step={3} totalSteps={14} title="프로필 입력" subtitle="설문 맥락 보정을 위한 기본 정보입니다. 개인을 식별하는 정보는 수집하지 않습니다.">
      <div className="space-y-6">
        <SelectField
          label="연령대"
          required
          options={AGE_GROUPS}
          value={profile.ageGroup}
          onChange={(v) => setProfile({ ageGroup: v })}
        />

        <SelectField
          label="성별"
          options={GENDERS}
          value={profile.gender}
          onChange={(v) => setProfile({ gender: v })}
        />

        <SelectField
          label="현재 관계 단계"
          required
          options={RELATIONSHIP_STAGES}
          value={profile.relationshipStage}
          onChange={(v) => setProfile({ relationshipStage: v })}
        />

        <SelectField
          label="과거 연애 횟수"
          options={PAST_RELATIONSHIPS}
          value={profile.pastRelationships}
          onChange={(v) => setProfile({ pastRelationships: v })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            관계에서 가장 중요하게 여기는 것 <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {IMPORTANT_VALUES.map((opt) => {
              const selected = profile.importantValues.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleValue(opt.value)}
                  className={`px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                    selected
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            현재 정서 상태
          </label>
          <p className="text-xs text-gray-400 mb-2">
            이 사람과의 관계를 생각할 때 내가 느끼는 전반적인 감정 상태를 선택해 주세요.
          </p>
          <div className="flex flex-wrap gap-2">
            {EMOTIONAL_STATES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setProfile({ emotionalState: opt.value })}
                className={`px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                  profile.emotionalState === opt.value
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <SelectField
          label="평가 대상과의 갈등 빈도"
          options={CONFLICT_FREQUENCIES}
          value={profile.conflictFrequency}
          onChange={(v) => setProfile({ conflictFrequency: v })}
        />
      </div>

      <button
        onClick={() => { setLoading(true); applyRecommendedWeights(); router.push('/section/a') }}
        disabled={!canProceed || loading}
        className="mt-8 w-full py-4 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 text-white"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : '다음'}
      </button>
    </StepLayout>
  )
}
