import os
import uuid
import json
import logging
from datetime import datetime
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from database import (
    init_db, save_answers, save_result, get_result,
    get_user_answers, create_session, get_session_by_token,
    update_session_share_token
)
from calculations import process_test_results

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    logger.info("Инициализация базы данных...")
    init_db()
    
    logger.info("Загрузка вопросов...")
    load_questions()
    
    logger.info("Сервер готов к работе!")
    yield
    logger.info("Завершение работы сервера...")

app = FastAPI(
    title="IT-навигатор ИУБиП",
    description="Профориентационный бот для абитуриентов",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

QUESTIONS = []
QUESTIONS_BY_ID = {}

def load_questions():
    """Загружает вопросы из JSON файла"""
    global QUESTIONS, QUESTIONS_BY_ID
    
    try:
        with open("questions.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            QUESTIONS = data["questions"]
            QUESTIONS_BY_ID = {q["id"]: q for q in QUESTIONS}
            logger.info(f"Загружено {len(QUESTIONS)} вопросов")
    except FileNotFoundError:
        logger.error("Файл questions.json не найден!")
        QUESTIONS = []
        QUESTIONS_BY_ID = {}
    except json.JSONDecodeError as e:
        logger.error(f"Ошибка парсинга questions.json: {e}")
        QUESTIONS = []
        QUESTIONS_BY_ID = {}

class AnswerItem(BaseModel):
    question_id: int = Field(..., ge=0, le=17)
    answer_id: int = Field(..., ge=0)

class SubmitTestRequest(BaseModel):
    session_id: str
    answers: List[AnswerItem]

class QuestionResponse(BaseModel):
    question_id: int
    text: str
    answers: List[dict]

def validate_answers(answers: List[AnswerItem]) -> bool:
    """Валидация ответов"""
    question_ids = set()
    
    for answer in answers:
        if answer.question_id not in QUESTIONS_BY_ID:
            logger.warning(f"Несуществующий question_id: {answer.question_id}")
            return False
        
        question = QUESTIONS_BY_ID[answer.question_id]
        answers_list = question.get("answers", [])
        
        if answer.answer_id >= len(answers_list):
            logger.warning(f"Несуществующий answer_id {answer.answer_id} для вопроса {answer.question_id}")
            return False
        
        if answer.question_id in question_ids and answer.question_id != 0:
            logger.warning(f"Дубликат вопроса {answer.question_id}")
            return False
        
        question_ids.add(answer.question_id)
    
    required_questions = set(range(1, 18))
    missing = required_questions - question_ids
    if missing:
        logger.warning(f"Отсутствуют ответы на вопросы: {missing}")
        return False
    
    return True

@app.get("/")
async def root():
    """Корневой эндпоинт для проверки работы"""
    return {
        "service": "IT-навигатор ИУБиП",
        "version": "1.0.0",
        "status": "online",
        "questions_count": len(QUESTIONS)
    }

@app.get("/questions", response_model=List[QuestionResponse])
async def get_questions():
    """
    GET /questions
    Возвращает список всех вопросов без поля effects
    """
    if not QUESTIONS:
        raise HTTPException(status_code=500, detail="Вопросы не загружены")
    
    response = []
    for q in QUESTIONS:
        answers_clean = []
        for ans in q.get("answers", []):
            clean_answer = {
                "text": ans["text"]
            }
            if "filter" in ans:
                clean_answer["filter"] = ans["filter"]
            answers_clean.append(clean_answer)
        
        response.append({
            "question_id": q["id"],
            "text": q["text"],
            "answers": answers_clean
        })
    
    return response

@app.post("/submit-test")
async def submit_test(request: SubmitTestRequest):
    """
    POST /submit-test
    Принимает ответы пользователя и сохраняет их
    """
    logger.info(f"Получен тест для session_id: {request.session_id}")
    logger.info(f"Количество ответов: {len(request.answers)}")
    
    if not validate_answers(request.answers):
        raise HTTPException(status_code=400, detail="Невалидные ответы")
    
    try:
        create_session(request.session_id, None)
        
        save_answers(request.session_id, request.answers)
        
        logger.info(f"Ответы сохранены для сессии {request.session_id}")
        return {
            "status": "OK",
            "message": "Ответы успешно сохранены",
            "session_id": request.session_id
        }
    except Exception as e:
        logger.error(f"Ошибка сохранения ответов: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения ответов: {str(e)}")

@app.get("/results/{session_id}")
async def get_results(session_id: str):
    """
    GET /results/{session_id}
    Возвращает полные результаты тестирования
    """
    logger.info(f"Запрос результатов для session_id: {session_id}")
    
    cached_result = get_result(session_id)
    if cached_result:
        logger.info(f"Результат из кэша для {session_id}")
        return json.loads(cached_result)
    
    answers = get_user_answers(session_id)
    if not answers:
        logger.error(f"Нет ответов для сессии {session_id}")
        raise HTTPException(status_code=404, detail="Сессия не найдена или ответы отсутствуют")
    
    logger.info(f"Найдено {len(answers)} ответов для сессии {session_id}")
    
    answers_list = [{"question_id": a[0], "answer_id": a[1]} for a in answers]
    
    if not validate_answers_for_calc(answers_list):
        missing = get_missing_questions(answers_list)
        logger.error(f"Не хватает ответов на вопросы: {missing}")
        raise HTTPException(status_code=400, detail=f"Недостаточно ответов. Отсутствуют вопросы: {missing}")
    
    try:
        result = process_test_results(
            answers=answers_list,
            questions_by_id=QUESTIONS_BY_ID,
            user_id=session_id
        )
        
        save_result(session_id, result)
        
        logger.info(f"Результат вычислен и сохранён для {session_id}")
        return result
    except Exception as e:
        logger.error(f"Ошибка вычисления результатов: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Ошибка обработки результатов: {str(e)}")

@app.get("/share/{token}")
async def share_results(token: str):
    """
    GET /share/{token}
    Получает результаты по share-токену
    """
    logger.info(f"Запрос результатов по токену: {token}")
    
    session_id = get_session_by_token(token)
    if not session_id:
        raise HTTPException(status_code=404, detail="Неверный или устаревший токен")
    
    return await get_results(session_id)

@app.post("/share/generate/{session_id}")
async def generate_share_token(session_id: str):
    """
    POST /share/generate/{session_id}
    Генерирует share-токен для сессии
    """
    logger.info(f"Генерация токена для {session_id}")
    
    token = str(uuid.uuid4()).replace("-", "")[:16]
    
    success = update_session_share_token(session_id, token)
    if not success:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    share_url = f"{base_url}/share/{token}"
    
    return {
        "token": token,
        "share_url": share_url
    }

@app.get("/health")
async def health_check():
    """Проверка здоровья сервера"""
    return {
        "status": "healthy",
        "database": "connected",
        "questions_loaded": len(QUESTIONS) > 0
    }

def validate_requests(answers: List[dict]) -> bool:
    """Общая валидация для submit"""
    question_ids = set()
    for ans in answers:
        if ans["question_id"] in question_ids and ans["question_id"] != 0:
            return False
        question_ids.add(ans["question_id"])
    
    required = set(range(1, 18))
    return required.issubset(question_ids)

def get_missing_questions(answers_list: List[dict]) -> List[int]:
    """Возвращает список ID вопросов, на которые нет ответов"""
    answered = set(a["question_id"] for a in answers_list)
    required = set(range(1, 18))
    missing = required - answered
    if 0 in required:
        required.remove(0)
    return sorted(missing)

def validate_answers_for_calc(answers: List[dict]) -> bool:
    """Валидация перед отправкой в calculations"""
    answered = set(a["question_id"] for a in answers)
    required = set(range(1, 18))
    return required.issubset(answered)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )