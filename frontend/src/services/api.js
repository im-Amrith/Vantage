import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: BASE_URL,
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

export async function getResumes() {
  const res = await api.get('/api/resume/list')
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

export async function endInterviewSession(sessionId) {
  const res = await api.post(`/api/interview/${sessionId}/end`)
  return res.data
}

export async function getTrackerData() {
  const res = await api.get('/api/tracker')
  return res.data
}

export async function syncTrackerData(data) {
  const res = await api.post('/api/tracker/sync', data)
  return res.data
}

export async function addTrackerJob(job) {
  const res = await api.post('/api/tracker/job', job)
  return res.data
}

export async function executeCode(code, language = 'python') {
  const res = await api.post('/api/dojo/execute', {
    code,
    language,
  })
  return res.data
}

export async function searchCompanyIntel(company) {
  const res = await api.post('/api/recon/search', {
    company,
  })
  return res.data
}
