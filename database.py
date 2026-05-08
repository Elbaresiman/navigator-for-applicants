import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
import os

logger = logging.getLogger(__name__)

DB_PATH = os.getenv("DATABASE_PATH", "it_navigator.db")

def get_db_connection():
    """Создаёт соединение с БД"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Инициализирует таблицы БД"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            level_filter INTEGER,
            share_token TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            question_id INTEGER NOT NULL,
            answer_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id),
            UNIQUE(session_id, question_id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS results (
            session_id TEXT PRIMARY KEY,
            result_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("База данных инициализирована")

def create_session(session_id: str, level_answer: Optional[int] = None) -> bool:
    """Создаёт или обновляет сессию"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO sessions (session_id, level_filter)
            VALUES (?, ?)
        ''', (session_id, level_answer))
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Ошибка создания сессии: {e}")
        return False
    finally:
        conn.close()

def save_answers(session_id: str, answers: List) -> bool:
    """
    Сохраняет ответы пользователя
    answers: список объектов AnswerItem (pydantic)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        for answer in answers:
            cursor.execute('''
                INSERT OR REPLACE INTO user_answers (session_id, question_id, answer_id)
                VALUES (?, ?, ?)
            ''', (session_id, answer.question_id, answer.answer_id))
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Ошибка сохранения ответов: {e}")
        return False
    finally:
        conn.close()

def get_user_answers(session_id: str) -> List[tuple]:
    """Получает все ответы пользователя"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT question_id, answer_id
            FROM user_answers
            WHERE session_id = ?
            ORDER BY question_id
        ''', (session_id,))
        return cursor.fetchall()
    except Exception as e:
        logger.error(f"Ошибка получения ответов: {e}")
        return []
    finally:
        conn.close()

def save_result(session_id: str, result_data: Dict[str, Any]) -> bool:
    """Сохраняет результат в кэш"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        result_json = json.dumps(result_data, ensure_ascii=False)
        cursor.execute('''
            INSERT OR REPLACE INTO results (session_id, result_json)
            VALUES (?, ?)
        ''', (session_id, result_json))
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Ошибка сохранения результата: {e}")
        return False
    finally:
        conn.close()

def get_result(session_id: str) -> Optional[str]:
    """Получает результат из кэша"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT result_json
            FROM results
            WHERE session_id = ?
        ''', (session_id,))
        row = cursor.fetchone()
        return row["result_json"] if row else None
    except Exception as e:
        logger.error(f"Ошибка получения результата: {e}")
        return None
    finally:
        conn.close()

def update_session_share_token(session_id: str, token: str) -> bool:
    """Обновляет share_token для сессии"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            UPDATE sessions
            SET share_token = ?
            WHERE session_id = ?
        ''', (token, session_id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        logger.error(f"Ошибка обновления токена: {e}")
        return False
    finally:
        conn.close()

def get_session_by_token(token: str) -> Optional[str]:
    """Находит session_id по share_token"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT session_id
            FROM sessions
            WHERE share_token = ?
        ''', (token,))
        row = cursor.fetchone()
        return row["session_id"] if row else None
    except Exception as e:
        logger.error(f"Ошибка поиска по токену: {e}")
        return None
    finally:
        conn.close()

def get_session_info(session_id: str) -> Optional[Dict]:
    """Получает информацию о сессии"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT session_id, level_filter, share_token, created_at
            FROM sessions
            WHERE session_id = ?
        ''', (session_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        logger.error(f"Ошибка получения информации о сессии: {e}")
        return None
    finally:
        conn.close()

def get_session_by_id(session_id: str) -> Optional[Dict]:
    """Получает информацию о сессии по session_id"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT session_id, level_filter, share_token, created_at
            FROM sessions
            WHERE session_id = ?
        ''', (session_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        logger.error(f"Ошибка получения сессии: {e}")
        return None
    finally:
        conn.close()