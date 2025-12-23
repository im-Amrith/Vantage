import axios from 'axios'

export const api = axios.create({
  baseURL: '',
})

export async function uploadResume(file) {
  const form = new FormData()
  form.append('file', file)

  const res = await api.post('/api/resume/upload', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export async function startInterview({ resumeId, role, jobDescription, numQuestions }) {
  const res = await api.post('/api/interview/start', {
    resume_id: resumeId || null,
    role,
    job_description: jobDescription,
    num_questions: numQuestions,
  })
  return res.data
}

export async function getInterviewHistory() {
  const res = await api.get('/api/interview/history')
  return res.data
}

export async function getDashboardStats() {
  const res = await api.get('/api/dashboard/stats')
  return res.data
}

export async function submitAnswer(sessionId, answerText) {
  const res = await api.post(`/api/interview/${sessionId}/answer`, {
    answer_text: answerText,
  })
  return res.data
}
