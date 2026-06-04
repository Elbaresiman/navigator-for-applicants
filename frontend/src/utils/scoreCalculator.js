import { questions, specialties, maxScores, subCompetencies } from '../data/questions';

export const calculateScores = (answers) => {
  const scores = {
    cognitive: { current: 0, max: 0 },
    social: { current: 0, max: 0 },
    digital: { current: 0, max: 0 },
    subcategories: {
      analytical: { current: 0, max: 0 },
      critical: { current: 0, max: 0 },
      team: { current: 0, max: 0 },
      digital_lit: { current: 0, max: 0 },
      digital_ethic: { current: 0, max: 0 },
      emotional: { current: 0, max: 0 }
    },
    specialties: {}
  };

  questions.forEach(q => {
    const answerIndex = answers[q.id];
    if (answerIndex !== undefined) {
      const weight = q.answers[answerIndex].weight;
      scores[q.category].current += weight;
      scores[q.category].max += 5;

      q.subcategories.forEach(sub => {
        scores.subcategories[sub].current += weight;
        scores.subcategories[sub].max += 5;
      });
    }
  });

  const meta_percent = {
    cognitive: scores.cognitive.max > 0 ? Math.round((scores.cognitive.current / scores.cognitive.max) * 100) : 0,
    social: scores.social.max > 0 ? Math.round((scores.social.current / scores.social.max) * 100) : 0,
    digital: scores.digital.max > 0 ? Math.round((scores.digital.current / scores.digital.max) * 100) : 0
  };

  const sub_percent = {};
  for (const [key, val] of Object.entries(scores.subcategories)) {
    sub_percent[key] = val.max > 0 ? Math.round((val.current / val.max) * 100) : 0;
  }

  const specs_percent = {};
  Object.keys(specialties).forEach(code => {
    const spec = specialties[code];
    let score = 0;
    if (spec.level === 'college') {
      score = Math.round((meta_percent.cognitive * 0.4 + meta_percent.digital * 0.4 + sub_percent.analytical * 0.2));
    } else {
      score = Math.round((meta_percent.social * 0.3 + meta_percent.cognitive * 0.3 + sub_percent.team * 0.2 + sub_percent.emotional * 0.2));
    }
    specs_percent[code] = Math.min(score, 100);
  });

  const sortedSpecs = Object.entries(specs_percent)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([code]) => code);

  const level_filter = sortedSpecs.some(code => specialties[code]?.level === 'college') &&
                       sortedSpecs.some(code => specialties[code]?.level === 'bachelor')
    ? 'all'
    : sortedSpecs.some(code => specialties[code]?.level === 'college')
      ? 'only_college'
      : 'only_bachelor';

  const superpower = getSuperpower(meta_percent);
  const growth_zone = getGrowthZone(sub_percent);
  const final_text = generateFinalText(meta_percent, sub_percent, specs_percent, sortedSpecs);

  return {
    meta_percent,
    sub_percent,
    specs_percent,
    level_filter,
    top_specs: sortedSpecs,
    superpower,
    growth_zone,
    final_text
  };
};

const getSuperpower = (meta_percent) => {
  const max = Math.max(meta_percent.cognitive, meta_percent.social, meta_percent.digital);
  if (max === meta_percent.cognitive) return 'Когнитивная';
  if (max === meta_percent.social) return 'Социально-коммуникативная';
  return 'Цифровая';
};

const getGrowthZone = (sub_percent) => {
  const min = Math.min(...Object.values(sub_percent));
  const key = Object.keys(sub_percent).find(k => sub_percent[k] === min);
  return subCompetencies[key] || 'Развитие навыков';
};

const generateFinalText = (meta_percent, sub_percent, specs_percent, topSpecs) => {
  const topSpecNames = topSpecs.map(code => specialties[code]?.name || code).join(' и ');
  return `Поздравляем! Ваша суперсила — ${getSuperpower(meta_percent).toLowerCase()} компетенция. 
Рекомендуем обратить внимание на специальности: ${topSpecNames}. 
Зона роста: ${getGrowthZone(sub_percent)}. 
Помните: начать можно с нуля — главное желание и стремление к развитию! 
Приглашаем вас в Академию Цифрового Развития ИУБиП.`;
};
