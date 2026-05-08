import json
from typing import Dict, List, Any, Optional, Tuple

MAX_SCORES = {
    "meta": {
        "cognitive": 31,
        "social": 27,
        "digital": 34
    },
    "sub": {
        "analytical": 20,
        "critical": 19,
        "team": 12,
        "digital_lit": 27,
        "digital_ethic": 11,
        "emotional": 13
    },
    "specs": {
        "09.02.07": 24,
        "09.02.11": 38,
        "09.02.12": 26,
        "09.03.03": 36,
        "38.03.05": 30
    }
}

SUB_NAMES = {
    "analytical": "Аналитическое мышление",
    "critical": "Критическое мышление",
    "team": "Командное взаимодействие",
    "digital_lit": "Цифровая грамотность",
    "digital_ethic": "Цифровой этикет",
    "emotional": "Эмоциональный интеллект"
}

META_NAMES = {
    "cognitive": "Когнитивная метакомпетенция",
    "social": "Социально-коммуникативная метакомпетенция",
    "digital": "Цифровая метакомпетенция"
}

SPEC_NAMES = {
    "09.02.07": "09.02.07 Информационные системы и программирование (колледж)",
    "09.02.11": "09.02.11 Информационные системы и программирование (колледж)",
    "09.02.12": "09.02.12 Информационная безопасность (колледж)",
    "09.03.03": "09.03.03 Прикладная информатика (бакалавриат)",
    "38.03.05": "38.03.05 Бизнес-информатика (бакалавриат)"
}

LEVEL_FILTERS = {
    "only_college": ["09.02.07", "09.02.11", "09.02.12"],
    "only_bachelor": ["09.03.03", "38.03.05"],
    "all": ["09.02.07", "09.02.11", "09.02.12", "09.03.03", "38.03.05"]
}


def calculate_scores(answers: List[Dict], questions_by_id: Dict[int, Dict]) -> Dict[str, Dict[str, int]]:
    """
    Суммирует effects по ответам пользователя.
    
    Args:
        answers: список ответов вида [{"question_id": 0, "answer_id": 1}, ...]
        questions_by_id: словарь вопросов {id: question_data}
    
    Returns:
        scores: {"meta": {...}, "sub": {...}, "specs": {...}}
    """
    scores = {
        "meta": {"cognitive": 0, "social": 0, "digital": 0},
        "sub": {
            "analytical": 0, "critical": 0, "team": 0,
            "digital_lit": 0, "digital_ethic": 0, "emotional": 0
        },
        "specs": {"09.02.07": 0, "09.02.11": 0, "09.02.12": 0, "09.03.03": 0, "38.03.05": 0}
    }
    
    for answer in answers:
        question_id = answer["question_id"]
        answer_id = answer["answer_id"]
        
        question = questions_by_id.get(question_id)
        if not question:
            continue
        
        if question_id == 0:
            continue
        
        answers_list = question.get("answers", [])
        if answer_id < len(answers_list):
            effects = answers_list[answer_id].get("effects", {})
            
            meta = effects.get("meta", {})
            for key in scores["meta"]:
                scores["meta"][key] += meta.get(key, 0)
            
            sub = effects.get("sub", {})
            for key in scores["sub"]:
                scores["sub"][key] += sub.get(key, 0)
            
            specs = effects.get("specs", {})
            for key in scores["specs"]:
                scores["specs"][key] += specs.get(key, 0)
    
    return scores


def calculate_percentages(scores: Dict[str, Dict[str, int]]) -> Dict[str, Dict[str, float]]:
    """
    Рассчитывает проценты на основе сырых баллов и максимальных значений.
    
    Args:
        scores: сырые баллы пользователя
    
    Returns:
        percentages: проценты с округлением до целого
    """
    percentages = {
        "meta": {},
        "sub": {},
        "specs": {}
    }
    
    for key in scores["meta"]:
        max_val = MAX_SCORES["meta"][key]
        if max_val > 0:
            percentages["meta"][key] = round(scores["meta"][key] / max_val * 100)
        else:
            percentages["meta"][key] = 0
    
    for key in scores["sub"]:
        max_val = MAX_SCORES["sub"][key]
        if max_val > 0:
            percentages["sub"][key] = round(scores["sub"][key] / max_val * 100)
        else:
            percentages["sub"][key] = 0
    
    for key in scores["specs"]:
        max_val = MAX_SCORES["specs"][key]
        if max_val > 0:
            percentages["specs"][key] = round(scores["specs"][key] / max_val * 100)
        else:
            percentages["specs"][key] = 0
    
    return percentages


def get_level_filter(answers: List[Dict]) -> str:
    """
    Определяет уровень обучения по ответу на вопрос 0.
    
    Returns:
        level_filter: "only_college", "only_bachelor", "all"
    """
    for answer in answers:
        if answer["question_id"] == 0:
            answer_id = answer["answer_id"]
            if answer_id == 0 or answer_id == 1:
                return "only_college"
            elif answer_id == 2:
                return "only_bachelor"
            elif answer_id == 3:
                return "all"
    return "all"


def rank_specialties(percentages: Dict[str, Dict[str, float]], level_filter: str) -> Tuple[List[str], Optional[str], Optional[str]]:
    """
    Ранжирует специальности по проценту и возвращает топ-1 и топ-2.
    
    Returns:
        (top_specs, top1, top2) где top_specs - список всех отфильтрованных спец-тей
    """
    specs = percentages["specs"]
    
    allowed_specs = LEVEL_FILTERS[level_filter]
    filtered_specs = {code: specs[code] for code in allowed_specs if code in specs}
    
    sorted_specs = sorted(filtered_specs.items(), key=lambda x: x[1], reverse=True)
    top_specs = [code for code, _ in sorted_specs]
    
    top1 = top_specs[0] if top_specs else None
    
    top2 = None
    if len(top_specs) >= 2:
        diff = filtered_specs[top_specs[0]] - filtered_specs[top_specs[1]]
        if diff < 10:
            top2 = top_specs[1]
    
    return top_specs, top1, top2


def find_superpower(percentages: Dict[str, Dict[str, float]]) -> str:
    """Находит подкомпетенцию с максимальным процентом."""
    subs = percentages["sub"]
    max_sub = max(subs.items(), key=lambda x: x[1])
    return SUB_NAMES.get(max_sub[0], max_sub[0])


def find_growth_zone(percentages: Dict[str, Dict[str, float]]) -> str:
    """Находит подкомпетенцию с минимальным процентом."""
    subs = percentages["sub"]
    min_sub = min(subs.items(), key=lambda x: x[1])
    return SUB_NAMES.get(min_sub[0], min_sub[0])


def build_final_text(
    top1: str,
    top2: Optional[str],
    superpower: str,
    growth_zone: str,
    all_sub_percentages: Dict[str, float],
    top1_percentage: float
) -> str:
    """
    Генерирует финальный текст по шаблону с дополнительными условиями.
    """
    if top2:
        text = f"🎯 Мы рекомендуем вам **{SPEC_NAMES[top1]}** и **{SPEC_NAMES[top2]}** (их баллы очень близки).\n\n"
    else:
        text = f"🎯 Мы рекомендуем вам **{SPEC_NAMES[top1]}**.\n\n"
    
    text += f"💡 Ваша суперсила — это **{superpower}**. Это отличная база для IT, даже если вы пока не писали код.\n\n"
    text += f"🧩 Над чем стоит поработать — **{growth_zone}**. Но не пугайтесь: у нас учатся с нуля, и преподаватели помогут прокачать всё, чего не хватает.\n\n"
    text += "🛠️ Не волнуйтесь, если у вас пока мало опыта. В Южном университете (ИУБиП) мы учим с азов. Главное — желание развиваться и интерес к технологиям. Хардскиллы придут с практикой.\n\n"
    
    all_low = all(percent < 20 for percent in all_sub_percentages.values())
    if all_low:
        text += "✨ Вы совсем новичок? Это даже хорошо — мы научим всему с самого начала. У нас нет проходных баллов за опыт, только за желание.\n\n"
    
    if top1_percentage < 30:
        text += "💫 Мы видим ваш потенциал, даже если сейчас цифры невысокие. Наши программы подходят для старта с нуля.\n\n"
    
    text += "🌟 **В заключение:** ждём вас в списке первокурсников в новом учебном году! Приходите к нам в колледж или бакалавриат — и вместе мы сделаем из вас востребованного IT-специалиста."
    
    return text


def get_recommendations(
    percentages: Dict[str, Dict[str, float]],
    level_filter: str
) -> Dict[str, Any]:
    """
    Формирует блок рекомендаций.
    
    Returns:
        recommendations: {"top_specs": [...], "superpower": "...", "growth_zone": "..."}
    """
    top_specs, top1, top2 = rank_specialties(percentages, level_filter)
    superpower = find_superpower(percentages)
    growth_zone = find_growth_zone(percentages)
    
    return {
        "top_specs": top_specs,
        "top1": top1,
        "top2": top2,
        "superpower": superpower,
        "growth_zone": growth_zone
    }


def build_result_json(
    user_id: str,
    level_filter: str,
    scores: Dict[str, Dict[str, int]],
    percentages: Dict[str, Dict[str, float]],
    recommendations: Dict[str, Any],
    final_text: str
) -> Dict[str, Any]:
    """
    Собирает итоговый JSON-результат.
    """
    return {
        "user_id": user_id,
        "level_filter": level_filter,
        "scores": scores,
        "percentages": percentages,
        "recommendations": {
            "top_specs": recommendations["top_specs"],
            "superpower": recommendations["superpower"],
            "growth_zone": recommendations["growth_zone"]
        },
        "final_text": final_text
    }


def process_test_results(
    answers: List[Dict],
    questions_by_id: Dict[int, Dict],
    user_id: str = "test_user"
) -> Dict[str, Any]:
    """
    Главная функция-оркестратор, которая принимает ответы пользователя
    и возвращает полный результат.
    
    Это основная функция, которую будет вызывать Разработчик 1.
    """
    scores = calculate_scores(answers, questions_by_id)
    percentages = calculate_percentages(scores)
    level = get_level_filter(answers)
    recommendations = get_recommendations(percentages, level)
    sub_percentages = percentages["sub"]
    top1 = recommendations["top1"]
    top1_percentage = percentages["specs"].get(top1, 0) if top1 else 0
    final_text = build_final_text(
        top1=top1,
        top2=recommendations["top2"],
        superpower=recommendations["superpower"],
        growth_zone=recommendations["growth_zone"],
        all_sub_percentages=sub_percentages,
        top1_percentage=top1_percentage
    )
    result = build_result_json(
        user_id=user_id,
        level_filter=level,
        scores=scores,
        percentages=percentages,
        recommendations=recommendations,
        final_text=final_text
    )
    
    return result