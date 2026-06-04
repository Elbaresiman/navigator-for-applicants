const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || '/api');
// const API_BASE = '/api';

export const api = {
  async getQuestions() {
    console.log('Fetching questions from:', `${API_BASE}/questions`);
    const response = await fetch(`${API_BASE}/questions`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load questions: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log('Questions received:', data.length);
    return data;
  },

  async calculateResults(sessionId, answers) {
    const formattedAnswers = Object.entries(answers).map(([reactQuestionId, answerId]) => {
      const questionId = parseInt(reactQuestionId) - 1;
      return {
        question_id: questionId,
        answer_id: answerId
      };
    });
    
    const payload = { 
      session_id: sessionId,
      answers: formattedAnswers 
    };
    
    console.log('Sending to /calculate:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await fetch(`${API_BASE}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to calculate results: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Results received:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
};