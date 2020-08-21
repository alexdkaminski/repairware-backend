const jobsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Job = require('../models/job')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

jobsRouter.get('/', async (request, response) => {
  const jobs = await Job
    .find({}).populate('user', { email: 1, name: 1 })

  response.json(jobs.map(job => job.toJSON()))
})

jobsRouter.put('/:id', (request, response, next) => {
  const job = request.body

  Job.findByIdAndUpdate(request.params.id, job, { new: true })
    .then(updatedJob => {
      response.json(updatedJob.toJSON())
    })
    .catch(error => next(error))
})

jobsRouter.get('/:id', async (request, response) => {
  const job = await Job.findById(request.params.id)
  if (job) {
    response.json(job.toJSON())
  } else {
    response.status(404).end()
  }
})


jobsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const job = new Job({
    ...body,
    date: new Date(),
    status: "New job",
    user: user._id
  })

  const savedJob = await job.save()
  user.jobs = user.jobs.concat(savedJob._id)
  await user.save()

  response.json(savedJob.toJSON())
})

jobsRouter.delete('/:id', async (request, response) => {
  await Job.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = jobsRouter