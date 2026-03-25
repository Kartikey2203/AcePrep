import React from 'react'
import '../style/style.scss'

const Home = () => {
  return (
    <main className='home'>
      <div className="card">

        <div className="card-header">
          <h1>Ace Your <span>Interview</span></h1>
          <p>Upload your resume, paste the job description, and get a personalized preparation report</p>
        </div>

        <div className="fields">

          {/* Left — Job Description */}
          <div className="field-job input-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste the full job posting here — role, responsibilities, required skills..."
            />
          </div>

          {/* Right — Resume + Self Description */}
          <div className="field-right">
            <div className="input-group">
              <label htmlFor="resume">Resume</label>
              <div className="file-zone">
                <span style={{ fontSize: '1.6rem' }}>📄</span>
                <div className="zone-text">
                  <span>Click to upload your resume</span>
                  <span>PDF, DOC, DOCX — max 4 MB</span>
                </div>
                <input type="file" name="resume" id="resume" accept=".pdf,.doc,.docx" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="selfDescription">About You</label>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your background, experience, and what you're looking for..."
              />
            </div>
          </div>

        </div>

        <button type="submit" className="generate-btn">
          Generate Interview Report
        </button>

      </div>

      <footer className="site-footer">
        <span className="footer-brand">AcePrep</span>
        <span className="footer-sep">·</span>
        <span>Powered by AI</span>
        <span className="footer-sep">·</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  )
}

export default Home
