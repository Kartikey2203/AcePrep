import React from 'react'
import '../style/style.scss'
import { useInterview } from '../hooks/useInterview'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

const Home = () => {
  const {generateReport,loading,reports,getAllReports} = useInterview();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [reportsOpen, setReportsOpen] = useState(false);
  const [formData,setFormData] = useState({
    selfDescription:"",
    jobDescription:"",
    resumeFile:null
  })
  
  useEffect(() => {
    getAllReports();
  }, []);
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFormData({...formData, resumeFile: file});
    } else {
      setSelectedFileName("");
      setFormData({...formData, resumeFile: null});
    }
  }
  
  const handleGenerateReport = async () => {
    setError("");
    
    // Validation - use state directly
    if (!formData.resumeFile) {
      setError("Please upload a resume");
      return;
    }
    if (!formData.jobDescription.trim()) {
      setError("Please provide a job description");
      return;
    }
    if (!formData.selfDescription.trim()) {
      setError("Please describe your background");
      return;
    }
    
    try {
      console.log("Submitting form with:", {
        resume: formData.resumeFile.name,
        jobDescription: formData.jobDescription.substring(0, 50) + "...",
        selfDescription: formData.selfDescription.substring(0, 50) + "..."
      });
      
      const data = await generateReport({
        jobDescription: formData.jobDescription,
        selfDescription: formData.selfDescription,
        resumeFile: formData.resumeFile
      });
      
      if(data && data._id) {
        navigate(`/interview/${data._id}`);
      } else if (data && data.data && data.data._id) {
        navigate(`/interview/${data.data._id}`);
      } else {
        setError("Failed to generate report. Please try again.");
      }
    } catch (err) {
      console.error("Generate report error:", err);
      setError(err.response?.data?.message || err.message || "Failed to generate report");
    }
  }

  if(loading){
   return <main className="loading-screen">
    <div className="spinner"></div>
    <h1>Generating Interview Report...</h1>
   </main>
  }
  return (
    <main className='home'>
      <div className="card">

        <div className="card-header">
          <h1>Ace Your <span>Interview</span></h1>
          <p>Upload your resume, paste the job description, and get a personalized preparation report</p>
        </div>

        {error && (
          <div style={{
            background: '#D11149',
            color: 'white',
            padding: '0.8rem 1.2rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
          }}>
            {error}
          </div>
        )}

        <div className="fields">

          {/* Left — Job Description */}
          <div className="field-job input-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
            onChange={(e)=>setFormData({...formData, jobDescription: e.target.value})}
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
                  {selectedFileName ? (
                    <>
                      <span style={{ color: '#a3bcf9' }}>✓ {selectedFileName}</span>
                      <span style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>Click to change</span>
                    </>
                  ) : (
                    <>
                      <span>Click to upload your resume</span>
                      <span>PDF, DOC, DOCX — max 4 MB</span>
                    </>
                  )}
                </div>
                <input 
                  onChange={handleFileSelect}
                  type="file" 
                  name="resume" 
                  id="resume" 
                  accept=".pdf,.doc,.docx" 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="selfDescription">About You</label>
              <textarea
              onChange={(e)=>setFormData({...formData, selfDescription: e.target.value})}
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your background, experience, and what you're looking for..."
              />
            </div>
          </div>

        </div>

        <button 
        onClick={handleGenerateReport}
        disabled={loading}
        type="submit" className="generate-btn">
          Generate Interview Report
        </button>

      </div>

      <div className="past-reports-container">
        <button 
          className={`past-reports-btn ${reportsOpen ? 'open' : ''}`}
          onClick={() => setReportsOpen(!reportsOpen)}
        >
          Previous Reports <span className="chevron">▼</span>
        </button>
        <div className={`past-reports-dropdown ${reportsOpen ? 'show' : ''}`}>
          {reports && reports.length > 0 ? (
            <ul>
              {reports.map((report) => (
                <li key={report._id}>
                  <a href={`/interview/${report._id}`}>
                     <span className="report-title">
                       • {report.title || 'Untitled Interview Report'}
                     </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-reports">No previous reports found.</div>
          )}
        </div>
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
